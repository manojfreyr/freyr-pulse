import { getRepos } from "@/lib/db";
import { createEnrichmentJob } from "@/lib/enrichment/jobs";
import { plannedSteps } from "@/lib/enrichment/orchestrator";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Create an enrichment job for a company. Does not run any step — the client
 *  drives steps via /api/enrichment/[jobId]/run-next. */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const company = await getRepos().companies.getById(params.id);
  if (!company) return bad("Company not found", 404);
  const steps = plannedSteps(company);
  return handle(async () => {
    const job = await createEnrichmentJob(company.id, steps);
    return { jobId: job.id, steps: job.steps, status: job.status };
  });
}
