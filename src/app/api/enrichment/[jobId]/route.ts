import { getEnrichmentJob } from "@/lib/enrichment/jobs";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { jobId: string } }) {
  const job = await getEnrichmentJob(params.jobId);
  if (!job) return bad("Job not found", 404);
  return handle(async () => job);
}
