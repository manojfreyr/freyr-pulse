import type { Company, SearchResult, SearchFieldKind } from "@/lib/types";
import { COMPANIES } from "@/lib/mock/companies";

/**
 * Search seam. Phase 1 matches on company name, website, and aliases across any
 * supplied company list (demo + user-created). The SearchFieldKind union already
 * declares Phase 2+ dimensions (LinkedIn, ticker, contact, product, therapeutic
 * area, competitor, …) so the UI can show them as "coming soon" and this service
 * can grow without breaking callers.
 */
export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

function matchOne(company: Company, q: string): SearchResult | null {
  const name = company.name.toLowerCase();
  const site = normalize(company.website);

  if (name.includes(q) || q.includes(company.id)) {
    return { company, matchedOn: "company-name", matchedText: company.name };
  }
  if (site && site !== "unknown" && (site.includes(q) || q.includes(site))) {
    return { company, matchedOn: "website", matchedText: company.website };
  }
  for (const alias of company.aliases) {
    if (alias && (alias.includes(q) || q.includes(alias))) {
      const matchedOn: SearchFieldKind = alias.includes(".") ? "website" : "company-name";
      return { company, matchedOn, matchedText: alias };
    }
  }
  return null;
}

function rank(r: SearchResult, q: string): number {
  const name = r.company.name.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  return 40;
}

/** Pure matcher — search a specific list of companies. */
export function matchCompanies(query: string, companies: Company[]): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const results: SearchResult[] = [];
  for (const company of companies) {
    const m = matchOne(company, q);
    if (m) results.push(m);
  }
  return results.sort((a, b) => rank(b, q) - rank(a, q));
}

export interface SearchService {
  search(query: string): Promise<SearchResult[]>;
  enabledFields(): SearchFieldKind[];
}

class MockSearchService implements SearchService {
  enabledFields(): SearchFieldKind[] {
    return ["company-name", "website"];
  }
  async search(query: string): Promise<SearchResult[]> {
    return matchCompanies(query, COMPANIES);
  }
}

export const searchService: SearchService = new MockSearchService();
