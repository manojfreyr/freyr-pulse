import { getRepos } from "@/lib/db";
import { getEnrichmentJob } from "@/lib/enrichment/jobs";
import { runStep } from "@/lib/enrichment/orchestrator";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Run the next pending step (exactly one connector). Returns updated job state
 *  AND the current company, so the client updates the UI from the same response
 *  that performed the write (no dependence on a separate, possibly stale read). */
export async function POST(_req: Request, { params }: { params: { jobId: string } }) {
  const job = await getEnrichmentJob(params.jobId);
  if (!job) return bad("Job not found", 404);
  return handle(async () => {
    const next = job.steps.find((s) => s.status === "pending");
    const updated = next ? (await runStep(params.jobId, next.source)) ?? job : job;
    const company = await getRepos().companies.getById(updated.companyId);
    return { ...updated, company };
  });
}
