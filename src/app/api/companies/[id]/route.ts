import { getRepos } from "@/lib/db";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const company = await getRepos().companies.getById(params.id);
  if (!company) return bad("Company not found", 404);
  return handle(async () => company);
}
