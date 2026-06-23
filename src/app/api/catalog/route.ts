import type { FreyrService } from "@/lib/types";
import { getRepos } from "@/lib/db";
import { handle, bad } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return handle(() => getRepos().catalog.list());
}

export async function POST(req: Request) {
  let body: FreyrService;
  try {
    body = (await req.json()) as FreyrService;
  } catch {
    return bad("Invalid JSON body");
  }
  if (!body?.id || typeof body.serviceName !== "string") return bad("A service id and serviceName are required");
  return handle(() => getRepos().catalog.upsert(body));
}
