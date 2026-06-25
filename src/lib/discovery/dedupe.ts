import type { Company } from "@/lib/types";
import { normalizeName, hostOf, type ResolvedIdentity } from "./resolve";

/**
 * Conservative match-before-create de-duplication. Biased to AVOID wrong merges:
 * a confident match collapses to the existing company; weaker overlaps are
 * surfaced as "possible duplicates" for the user to confirm rather than
 * auto-merged. Pure — no network.
 */

export interface DedupeResult {
  /** Confident existing match (open instead of creating). */
  match: Company | null;
  /** Uncertain overlaps to surface for confirmation. */
  possibleDuplicates: Company[];
}

function companyHosts(c: Company): string[] {
  const out: string[] = [];
  if (c.website && /^https?:\/\//i.test(c.website)) out.push(hostOf(c.website));
  return out;
}
function companyAliases(c: Company): string[] {
  return [c.name.toLowerCase(), ...(c.aliases ?? []).map((a) => a.toLowerCase())];
}

export function findExisting(identity: ResolvedIdentity, companies: Company[]): DedupeResult {
  const idName = normalizeName(identity.name);
  const idHost = identity.website ? hostOf(identity.website) : "";
  const idTicker = identity.ticker?.toLowerCase();
  const idAliases = new Set(identity.aliases.map((a) => a.toLowerCase()));

  const possibles: Company[] = [];

  for (const c of companies) {
    // 1) Strong: same website host → confident match.
    if (idHost && companyHosts(c).includes(idHost)) return { match: c, possibleDuplicates: [] };

    // 2) Strong: confirmed ticker match.
    if (idTicker) {
      const cTicker = c.snapshot.stockTicker?.toLowerCase();
      if (cTicker && cTicker === idTicker) return { match: c, possibleDuplicates: [] };
      if (companyAliases(c).includes(idTicker)) return { match: c, possibleDuplicates: [] };
    }

    // 3) Strong: exact normalized-name equality (both non-empty).
    const cName = normalizeName(c.name);
    if (idName && cName && idName === cName) return { match: c, possibleDuplicates: [] };

    // 4) Weak: alias overlap or one-sided name containment → SURFACE, don't merge.
    const aliasOverlap = companyAliases(c).some((a) => idAliases.has(a));
    const contains = idName && cName && (cName.startsWith(idName) || idName.startsWith(cName));
    if (aliasOverlap || contains) possibles.push(c);
  }

  return { match: null, possibleDuplicates: possibles.slice(0, 5) };
}
