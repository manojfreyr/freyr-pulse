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
      // The search carried new identity (e.g. a website URL or ticker). Don't discard it —
      // attach it to the existing record so a URL search improves the profile. Conservative:
      // only fill a missing website; never overwrite an existing one. Always union aliases.
      const aliasSet = new Set((match.aliases ?? []).map((a) => a.toLowerCase()));
      let changed = false;
      identity.aliases.forEach((a) => {
        const k = a.toLowerCase();
        if (a && !aliasSet.has(k)) { aliasSet.add(k); changed = true; }
      });
      if (identity.ticker) aliasSet.add(identity.ticker.toLowerCase());

      const patch: Partial<typeof match> = {};
      const matchHasWebsite = match.website && match.website !== "Unknown";
      if (identity.website && !matchHasWebsite) { patch.website = identity.website; changed = true; }
      if (identity.ticker && !match.snapshot.stockTicker) {
        patch.snapshot = { ...match.snapshot, stockTicker: identity.ticker, publicStatus: "Public" };
        changed = true;
      }

      if (!changed) return { company: match, created: false, improved: false, possibleDuplicates: [] };
      const improved = await repo.create({ ...match, ...patch, aliases: [...aliasSet] });
      return { company: improved, created: false, improved: true, possibleDuplicates: [] };
    }

    const company = buildCompanyFromIdentity(identity, existing.map((c) => c.id));
    const saved = await repo.create(company);
    return { company: saved, created: true, improved: false, possibleDuplicates: possibleDuplicates.map((c) => ({ id: c.id, name: c.name })) };
  });
}
