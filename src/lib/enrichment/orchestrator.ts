import "server-only";
import type { Company, SourceCitation, SourceRun } from "@/lib/types";
import type { EnrichmentJob } from "@/lib/db/repositories";
import { getRepos } from "@/lib/db";
import { mergeSignals } from "@/lib/signals/companySignals";
import { nowIso } from "@/lib/utils/format";
import type { EnrichInput, LiveConnector } from "@/lib/connectors/types";
import { secConnector } from "@/lib/connectors/sec";
import { trialsConnector } from "@/lib/connectors/trials";
import { fdaConnector } from "@/lib/connectors/fda";
import { websiteConnector } from "@/lib/connectors/website";

/**
 * Enrichment orchestration (Phase 2A.0c). No queue, no cron: the client calls
 * runStep once per source, so each request runs exactly one connector and
 * returns updated job state — async-with-progress on free-tier serverless.
 * Manual "Research Again" always bypasses the cache.
 */

export const REGISTRY: LiveConnector[] = [secConnector, trialsConnector, fdaConnector, websiteConnector];

function toInput(company: Company): EnrichInput {
  return { id: company.id, name: company.name, website: company.website, aliases: company.aliases };
}

/** Connector ids that can run for this company (in run order). */
export function plannedSteps(company: Company): string[] {
  const input = toInput(company);
  return REGISTRY.filter((c) => c.appliesTo(input)).map((c) => c.id);
}

function dedupeCitations(citations: SourceCitation[]): SourceCitation[] {
  const seen = new Set<string>();
  const out: SourceCitation[] = [];
  for (const c of citations) {
    const k = `${c.sourceType ?? ""}|${c.url}|${c.label}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(c);
    }
  }
  return out;
}

/** Run the single named step of a job: fetch+parse one connector, merge its
 *  output into the company's enrichment, persist, and advance the job. */
export async function runStep(jobId: string, connectorId: string): Promise<EnrichmentJob | null> {
  const repos = getRepos();
  const job = await repos.jobs.get(jobId);
  if (!job) return null;

  const connector = REGISTRY.find((c) => c.id === connectorId);
  // Mark the step running.
  let steps = job.steps.map((s) => (s.source === connectorId ? { ...s, status: "running" as const } : s));
  await repos.jobs.update(jobId, { status: "running", steps });

  const company = await repos.companies.getById(job.companyId);

  let signalCount = 0;
  let ok = true;
  let error: string | undefined;

  if (!company) {
    ok = false;
    error = "Company not found.";
  } else if (!connector) {
    ok = false;
    error = `Unknown connector "${connectorId}".`;
  } else {
    let output;
    try {
      output = await connector.enrich(toInput(company), { bypassCache: true });
    } catch (e) {
      ok = false;
      error = e instanceof Error ? e.message : "Connector failed.";
      output = { signals: [], citations: [], notes: [error] };
    }
    signalCount = output.signals.length;

    const prev = company.enrichment;
    const mergedSignals = mergeSignals(prev?.signals ?? [], output.signals);
    const citations = dedupeCitations([...(prev?.citations ?? []), ...output.citations]);
    const run: SourceRun = { source: connectorId, ok, signalCount, ranAt: nowIso(), ...(error ? { error } : {}) };
    const runs = [...(prev?.runs ?? []).filter((r) => r.source !== connectorId), run];

    const enriched: Company = {
      ...company,
      enrichment: { signals: mergedSignals, citations, lastResearchedAt: nowIso(), runs },
    };
    await repos.companies.create(enriched); // upsert (user-origin companies persist; demo merge handled by repo)
  }

  // Advance the step + job.
  const settledStatus: "done" | "error" = ok ? "done" : "error";
  steps = steps.map((s) =>
    s.source === connectorId ? { ...s, status: settledStatus, ...(error ? { error } : {}) } : s,
  );
  const settled = steps.filter((s) => s.status === "done" || s.status === "error").length;
  const progress = Math.round((settled / steps.length) * 100);
  const status = settled >= steps.length ? "done" : "running";
  return repos.jobs.update(jobId, { steps, progress, status });
}
