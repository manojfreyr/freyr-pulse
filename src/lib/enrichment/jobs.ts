import "server-only";
import { getRepos } from "@/lib/db";
import type { EnrichmentJob } from "@/lib/db/repositories";
import { nowIso, uid } from "@/lib/utils/format";

/**
 * Enrichment-job lifecycle (Phase 2A.0b plumbing). Creates/reads/updates job
 * records backed by the data layer (enrichment_jobs table / in-memory fallback).
 *
 * This is the substrate for the async-with-progress flow. There is NO
 * orchestration here — fanning out to connectors and advancing steps is 2A.0c.
 */

export async function createEnrichmentJob(companyId: string, sources: string[]): Promise<EnrichmentJob> {
  const now = nowIso();
  const job: EnrichmentJob = {
    id: uid("job"),
    companyId,
    status: "queued",
    steps: sources.map((source) => ({ source, status: "pending" })),
    progress: 0,
    createdAt: now,
    updatedAt: now,
  };
  return getRepos().jobs.create(job);
}

export async function getEnrichmentJob(id: string): Promise<EnrichmentJob | null> {
  return getRepos().jobs.get(id);
}

export async function updateEnrichmentJob(
  id: string,
  patch: Partial<EnrichmentJob>,
): Promise<EnrichmentJob | null> {
  return getRepos().jobs.update(id, patch);
}
