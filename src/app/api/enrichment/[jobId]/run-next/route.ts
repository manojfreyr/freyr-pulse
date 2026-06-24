import { getEnrichmentJob } from "@/lib/enrichment/jobs";
import { runStep } from "@/lib/enrichment/orchestrator";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Run the next pending step (exactly one connector). Returns updated job state. */
export async function POST(_req: Request, { params }: { params: { jobId: string } }) {
  const job = await getEnrichmentJob(params.jobId);
  if (!job) return bad("Job not found", 404);
  const next = job.steps.find((s) => s.status === "pending");
  if (!next) return handle(async () => job); // nothing to do; already complete
  return handle(async () => (await runStep(params.jobId, next.source)) ?? job);
}
