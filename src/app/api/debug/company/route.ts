import { NextResponse } from "next/server";
import { getRepos } from "@/lib/db";
import { dataMode } from "@/lib/db/dataMode";
import { normalizeName, hostOf, resolveIdentity } from "@/lib/discovery/resolve";
import { findExisting } from "@/lib/discovery/dedupe";
import { matchCompanies } from "@/lib/api/searchService";
import { buildCompanyFromIdentity } from "@/lib/companies/placeholder";
import { createEnrichmentJob } from "@/lib/enrichment/jobs";
import { plannedSteps, runStep } from "@/lib/enrichment/orchestrator";
import type { Company } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Per-company persistence inspector + end-to-end onboarding self-test.
 *   GET /api/debug/company?id=<id>[&q=<search>]   inspect one record
 *   GET /api/debug/company?e2e=<name or url>       run onboard→enrich→reload→search
 * Behind the access gate. The e2e mode writes a (cleaned-up) probe company.
 */

function snap(c: Company | null) {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    normalizedName: normalizeName(c.name),
    website: c.website,
    websiteHost: /^https?:/i.test(c.website) ? hostOf(c.website) : null,
    ticker: c.snapshot?.stockTicker ?? null,
    aliases: c.aliases ?? [],
    isPlaceholder: Boolean(c.isPlaceholder),
    lastResearchedAt: c.enrichment?.lastResearchedAt ?? null,
    signalCount: c.enrichment?.signals?.length ?? 0,
    citationCount: c.enrichment?.citations?.length ?? 0,
    runs: c.enrichment?.runs?.map((r) => `${r.source}:${r.ok ? "ok" : "fail"}:${r.signalCount}`) ?? [],
  };
}

function duplicates(target: Company, all: Company[]) {
  const tn = normalizeName(target.name);
  const th = /^https?:/i.test(target.website) ? hostOf(target.website) : "";
  const tt = target.snapshot?.stockTicker?.toLowerCase();
  const ta = new Set((target.aliases ?? []).map((a) => a.toLowerCase()).concat(target.name.toLowerCase()));
  return all
    .filter((c) => c.id !== target.id)
    .filter((c) => {
      const cn = normalizeName(c.name);
      const ch = /^https?:/i.test(c.website) ? hostOf(c.website) : "";
      const ct = c.snapshot?.stockTicker?.toLowerCase();
      const ca = (c.aliases ?? []).map((a) => a.toLowerCase()).concat(c.name.toLowerCase());
      return (!!tn && tn === cn) || (!!th && th === ch) || (!!tt && tt === ct) || ca.some((a) => ta.has(a));
    })
    .map((c) => ({ id: c.id, name: c.name, isPlaceholder: Boolean(c.isPlaceholder), lastResearchedAt: c.enrichment?.lastResearchedAt ?? null }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const q = url.searchParams.get("q");
  const e2e = url.searchParams.get("e2e");
  const repo = getRepos().companies;
  const base: Record<string, unknown> = { dataMode: dataMode() };

  if (e2e) {
    const t: Record<string, unknown> = {};
    const identity = resolveIdentity(e2e);
    const before = await repo.list();
    const dup = findExisting(identity, before);
    t.resolvedIdentity = { name: identity.name, kind: identity.kind, ticker: identity.ticker, aliases: identity.aliases };
    t.matchedExistingOnOnboard = dup.match ? snap(dup.match) : null;
    const company = dup.match ?? (await repo.create(buildCompanyFromIdentity(identity, before.map((c) => c.id))));
    const onboardedId = company.id;
    t.onboardingUpdatesRecord = snap(company);

    let job = await createEnrichmentJob(onboardedId, plannedSteps(company));
    t.plannedSteps = job.steps.map((s) => s.source);
    for (let i = 0; i < job.steps.length + 2; i++) {
      const next = job.steps.find((s) => s.status === "pending");
      if (!next) break;
      job = (await runStep(job.id, next.source)) ?? job;
    }
    t.finalSteps = job.steps.map((s) => `${s.source}:${s.status}`);

    const reloaded = await repo.getById(onboardedId); // simulates refresh
    const all = await repo.list();
    const results = matchCompanies(identity.name, all);
    t.refreshReloadsRecord = snap(reloaded);
    t.searchResolvesTo = results.slice(0, 3).map((r) => snap(r.company));
    t.duplicateCandidates = reloaded ? duplicates(reloaded, all) : [];
    t.idLinkage = {
      onboardedId,
      jobCompanyId: job.companyId,
      reloadedId: reloaded?.id ?? null,
      searchTopId: results[0]?.company.id ?? null,
      allIdsMatch:
        onboardedId === job.companyId &&
        onboardedId === (reloaded?.id ?? null) &&
        onboardedId === (results[0]?.company.id ?? null),
    };
    t.enrichmentPersistsOnReload = Boolean(reloaded?.enrichment?.lastResearchedAt);

    // Clean up the probe so repeated runs don't accumulate (best-effort).
    try {
      const sb = dataMode() === "supabase" ? (await import("@/lib/db/supabaseClient")).getSupabase() : null;
      if (sb && !dup.match) await sb.from("companies").delete().eq("id", onboardedId);
    } catch {
      /* ignore */
    }
    return NextResponse.json({ ...base, e2e: t });
  }

  if (!id) return NextResponse.json({ ...base, usage: "?id=<companyId>&q=<search>  or  ?e2e=<name|url>" }, { status: 400 });

  const all = await repo.list();
  const byId = await repo.getById(id);
  const results = matchCompanies(q || byId?.name || id, all);
  return NextResponse.json({
    ...base,
    requestedId: id,
    getByIdReturns: snap(byId),
    searchResolvesTo: results.slice(0, 5).map((r) => snap(r.company)),
    duplicateCandidates: byId ? duplicates(byId, all) : [],
    allCompanyIds: all.map((c) => ({ id: c.id, isPlaceholder: Boolean(c.isPlaceholder), researched: Boolean(c.enrichment?.lastResearchedAt) })),
  });
}
