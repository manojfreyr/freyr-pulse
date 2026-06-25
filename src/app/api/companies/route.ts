import type { Company } from "@/lib/types";
import { getRepos } from "@/lib/db";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");
  const repo = getRepos().companies;
  if (q && q.trim()) return handle(() => repo.search(q));
  return handle(() => repo.list());
}

export async function POST(req: Request) {
  let body: Company;
  try {
    body = (await req.json()) as Company;
  } catch {
    return bad("Invalid JSON body");
  }
  if (!body?.id || !body.name) return bad("A company id and name are required");
  return handle(() => getRepos().companies.create(body));
}
