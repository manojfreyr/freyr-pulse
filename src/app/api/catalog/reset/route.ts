import { getRepos } from "@/lib/db";
import { handle } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  return handle(() => getRepos().catalog.reset());
}
