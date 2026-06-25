import type { SavedAccount } from "@/lib/types";
import { getRepos } from "@/lib/db";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handle(() => getRepos().accounts.list());
}

export async function POST(req: Request) {
  let body: SavedAccount;
  try {
    body = (await req.json()) as SavedAccount;
  } catch {
    return bad("Invalid JSON body");
  }
  if (!body?.companyId) return bad("A companyId is required");
  return handle(() => getRepos().accounts.save(body));
}
