import { getRepos } from "@/lib/db";
import { handle, bad } from "@/lib/api/http";
import { resolveIdentity, withHints } from "@/lib/discovery/resolve";
import { findExisting } from "@/lib/discovery/dedupe";
import { buildCompanyFromIdentity } from "@/lib/companies/placeholder";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Match-before-create onboarding. Resolves a raw name/URL/ticker (optionally with
 * SEC-directory hints) into a canonical identity, checks for an existing company
 * (conservative), and only creates + persists when there's no confident match.
 */
export async function POST(req: Request) {
  let body: { input?: string; name?: string; website?: string; ticker?: string; cik?: string };
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body", 400);
  }
  const input = (body.input || body.name || "").trim();
  if (!input) return bad("An input (name, URL, or ticker) is required", 400);

  return handle(async () => {
    const repo = getRepos().companies;
    const identity = withHints(resolveIdentity(input), { name: body.name, website: body.website, ticker: body.ticker, cik: body.cik });

    const existing = await repo.list();
    const { match, possibleDuplicates } = findExisting(identity, existing);
    if (match) {
      return { company: match, created: false, possibleDuplicates: [] };
    }

    const company = buildCompanyFromIdentity(identity, existing.map((c) => c.id));
    const saved = await repo.create(company);
    return { company: saved, created: true, possibleDuplicates: possibleDuplicates.map((c) => ({ id: c.id, name: c.name })) };
  });
}
