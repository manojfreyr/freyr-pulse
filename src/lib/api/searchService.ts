import type { Company, SearchResult, SearchFieldKind } from "@/lib/types";
import { COMPANIES } from "@/lib/mock/companies";

/**
 * Search seam. Phase 1 matches on company name, website, and aliases. The
 * SearchFieldKind union already declares Phase 2+ dimensions (LinkedIn, ticker,
 * contact, product, therapeutic area, competitor, ...) so the UI can show them
 * as "coming soon" and this service can grow without breaking callers.
 */
export interface SearchService {
  search(query: string): Promise<SearchResult[]>;
  /** Which search dimensions are live right now. */
  enabledFields(): SearchFieldKind[];
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

class MockSearchService implements SearchService {
  enabledFields(): SearchFieldKind[] {
    return ["company-name", "website"];
  }

  async search(query: string): Promise<SearchResult[]> {
    const q = normalize(query);
    if (!q) return [];

    const results: SearchResult[] = [];
    for (const company of COMPANIES) {
      const match = matchCompany(company, q);
      if (match) results.push(match);
    }
    // Rank: exact-ish name matches first, then the rest.
    return results.sort((a, b) => score(b, q) - score(a, q));
  }
}

function matchCompany(company: Company, q: string): SearchResult | null {
  const name = company.name.toLowerCase();
  const site = normalize(company.website);

  if (name.includes(q) || q.includes(company.id)) {
    return { company, matchedOn: "company-name", matchedText: company.name };
  }
  if (site.includes(q) || q.includes(site)) {
    return { company, matchedOn: "website", matchedText: company.website };
  }
  for (const alias of company.aliases) {
    if (alias.includes(q) || q.includes(alias)) {
      const matchedOn: SearchFieldKind = alias.includes(".") ? "website" : "company-name";
      return { company, matchedOn, matchedText: alias };
    }
  }
  return null;
}

function score(r: SearchResult, q: string): number {
  const name = r.company.name.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  return 40;
}

export const searchService: SearchService = new MockSearchService();
