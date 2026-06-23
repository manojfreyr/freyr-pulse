import type { Company, FreyrService, SavedAccount, SearchResult } from "@/lib/types";

/**
 * Persistence contracts. Two implementations exist: supabaseRepos (shared
 * Postgres) and memoryRepos (in-memory, seed-backed fallback). API routes depend
 * only on these interfaces, so the backend can change without touching callers.
 *
 * Note: the five demo companies always come from the code seed; the company
 * store persists only user-created companies. getById/search/list merge both.
 */
export interface CatalogRepo {
  list(): Promise<FreyrService[]>;
  upsert(service: FreyrService): Promise<FreyrService>;
  remove(id: string): Promise<void>;
  reset(): Promise<FreyrService[]>;
}

export interface CompanyRepo {
  list(): Promise<Company[]>;
  getById(id: string): Promise<Company | null>;
  search(query: string): Promise<SearchResult[]>;
  create(company: Company): Promise<Company>; // upsert a user company
}

export interface AccountRepo {
  list(): Promise<SavedAccount[]>;
  get(companyId: string): Promise<SavedAccount | null>;
  save(account: SavedAccount): Promise<SavedAccount>;
  update(companyId: string, patch: Partial<SavedAccount>): Promise<SavedAccount | null>;
  remove(companyId: string): Promise<void>;
}

export interface Repos {
  catalog: CatalogRepo;
  companies: CompanyRepo;
  accounts: AccountRepo;
}
