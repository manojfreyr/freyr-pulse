import type { Company, FreyrService, SavedAccount, SearchResult } from "@/lib/types";
import type { CustomerSegment, Market, SalesAsset, ServiceApplicabilityRule, ServiceAssetLink } from "@/lib/commercial/types";

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

/** Per-source response cache (Phase 2A.0b). Keyed by (source, key). */
export interface CacheEntry {
  source: string;
  key: string;
  value: unknown;
  fetchedAt: string; // ISO
  expiresAt: string; // ISO
  contentHash?: string;
}

export interface CacheRepo {
  /** Returns a fresh (non-expired) entry, or null on miss/expiry. */
  get(source: string, key: string): Promise<CacheEntry | null>;
  set(entry: CacheEntry): Promise<void>;
  delete(source: string, key: string): Promise<void>;
}

export type JobStatus = "queued" | "running" | "done" | "error";
export type StepStatus = "pending" | "running" | "done" | "error" | "skipped";

export interface JobStep {
  source: string;
  status: StepStatus;
  error?: string;
}

/** An enrichment job (Phase 2A.0b plumbing; orchestration arrives in 2A.0c). */
export interface EnrichmentJob {
  id: string;
  companyId: string;
  status: JobStatus;
  steps: JobStep[];
  progress: number; // 0–100
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobRepo {
  create(job: EnrichmentJob): Promise<EnrichmentJob>;
  get(id: string): Promise<EnrichmentJob | null>;
  update(id: string, patch: Partial<EnrichmentJob>): Promise<EnrichmentJob | null>;
}

// ---- Commercial Enablement (V2.0-A). Additive; nothing consumes these yet. ----

export interface SegmentRepo {
  list(): Promise<CustomerSegment[]>;
  getById(id: string): Promise<CustomerSegment | null>;
  upsert(segment: CustomerSegment): Promise<CustomerSegment>;
  remove(id: string): Promise<void>;
}

export interface MarketRepo {
  list(): Promise<Market[]>;
  getById(id: string): Promise<Market | null>;
  upsert(market: Market): Promise<Market>;
  remove(id: string): Promise<void>;
}

export interface SalesAssetRepo {
  list(): Promise<SalesAsset[]>;
  getById(id: string): Promise<SalesAsset | null>;
  upsert(asset: SalesAsset): Promise<SalesAsset>;
  remove(id: string): Promise<void>;
}

export interface ApplicabilityRepo {
  list(): Promise<ServiceApplicabilityRule[]>;
  listForService(serviceId: string): Promise<ServiceApplicabilityRule[]>;
  getById(id: string): Promise<ServiceApplicabilityRule | null>;
  upsert(rule: ServiceApplicabilityRule): Promise<ServiceApplicabilityRule>;
  remove(id: string): Promise<void>;
}

export interface ServiceAssetRepo {
  list(): Promise<ServiceAssetLink[]>;
  listForService(serviceId: string): Promise<ServiceAssetLink[]>;
  getById(id: string): Promise<ServiceAssetLink | null>;
  upsert(link: ServiceAssetLink): Promise<ServiceAssetLink>;
  remove(id: string): Promise<void>;
}

export interface Repos {
  catalog: CatalogRepo;
  companies: CompanyRepo;
  accounts: AccountRepo;
  cache: CacheRepo;
  jobs: JobRepo;
  // Commercial Enablement (V2.0-A)
  segments: SegmentRepo;
  markets: MarketRepo;
  salesAssets: SalesAssetRepo;
  applicability: ApplicabilityRepo;
  serviceAssets: ServiceAssetRepo;
}
