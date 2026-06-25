/**
 * Deterministic identity resolution for company onboarding. Pure — no network,
 * no LLM. Turns a raw user input (name, website URL, or ticker) into a canonical
 * shape used to create or match a company.
 */

export interface ResolvedIdentity {
  /** Best-effort display name (backfilled later by SEC/website evidence). */
  name: string;
  /** Normalized https URL when the input was/contained a URL. */
  website?: string;
  /** Lowercased aliases (raw input, host, slug, ticker) for matching. */
  aliases: string[];
  /** Uppercase ticker when the input looked like one. */
  ticker?: string;
  cik?: string;
  /** What the input looked like. */
  kind: "url" | "ticker" | "name";
}

export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(inc|corp|corporation|company|co|ltd|llc|plc|nv|sa|ag|gmbh|holdings?|pharmaceuticals?|pharma|therapeutics|biosciences?|biotech|labs?|laboratories)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function hostOf(url: string): string {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .trim();
}

function looksLikeUrl(input: string): boolean {
  return input.includes("http") || /\.[a-z]{2,}(\/|$)/i.test(input);
}
function looksLikeTicker(input: string): boolean {
  return /^[A-Z]{1,5}$/.test(input.trim());
}
function titleCase(input: string): string {
  return input.replace(/[-_.]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function resolveIdentity(input: string): ResolvedIdentity {
  const raw = input.trim();
  const aliases = new Set<string>([raw.toLowerCase()]);

  if (looksLikeUrl(raw)) {
    const host = hostOf(raw);
    const website = raw.startsWith("http") ? raw.split(/[?#]/)[0] : `https://${host}`;
    const bare = host.replace(/\.[a-z.]+$/i, ""); // drop TLD(s)
    aliases.add(host);
    aliases.add(bare);
    return { name: titleCase(bare), website: `https://${host}`, aliases: [...aliases], kind: "url" };
  }

  if (looksLikeTicker(raw)) {
    aliases.add(raw.toLowerCase());
    return { name: raw.toUpperCase(), ticker: raw.toUpperCase(), aliases: [...aliases], kind: "ticker" };
  }

  const name = titleCase(raw);
  const norm = normalizeName(raw);
  if (norm) aliases.add(norm);
  return { name, aliases: [...aliases], kind: "name" };
}

/** Merge SEC/website identity hints into a resolved identity (used at create time). */
export function withHints(base: ResolvedIdentity, hints: { name?: string; website?: string; ticker?: string; cik?: string }): ResolvedIdentity {
  const aliases = new Set(base.aliases);
  if (hints.name) aliases.add(hints.name.toLowerCase());
  if (hints.ticker) aliases.add(hints.ticker.toLowerCase());
  return {
    ...base,
    name: hints.name ?? base.name,
    website: hints.website ?? base.website,
    ticker: hints.ticker ?? base.ticker,
    cik: hints.cik ?? base.cik,
    aliases: [...aliases],
  };
}
