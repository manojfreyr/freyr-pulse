import { getRepos } from "@/lib/db";
import { handle } from "@/lib/api/http";
import { searchSecDirectory } from "@/lib/connectors/sec/directory";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Combined discovery: local accounts (seed + saved) + SEC public-company directory. */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  return handle(async () => {
    if (!q) return { accounts: [], directory: [] };
    const [accounts, directory] = await Promise.all([
      getRepos().companies.search(q),
      searchSecDirectory(q).catch(() => []),
    ]);
    return { accounts, directory };
  });
}
