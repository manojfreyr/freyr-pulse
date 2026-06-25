import type { Company, FreyrService, SavedAccount, SearchResult } from "@/lib/types";
import { FREYR_SERVICES } from "@/lib/mock/services";
import { COMPANIES, COMPANY_BY_ID } from "@/lib/mock/companies";
import { matchCompanies } from "@/lib/api/searchService";
import { nowIso } from "@/lib/utils/format";
import type { AccountRepo, CacheEntry, CacheRepo, CatalogRepo, CompanyRepo, EnrichmentJob, JobRepo, Repos, SegmentRepo, MarketRepo, SalesAssetRepo, ApplicabilityRepo, ServiceAssetRepo } from "./repositories";
import type { CustomerSegment, Market, SalesAsset, ServiceApplicabilityRule, ServiceAssetLink } from "@/lib/commercial/types";
import { SEGMENTS_SEED, MARKETS_SEED } from "@/lib/commercial/seed";

/**
 * Fallback persistence used when Supabase env vars are absent. Data lives in
 * module-level maps seeded from the code. This persists for the lifetime of a
 * single server process (fine for local `next dev` / demo) but is EPHEMERAL on
 * serverless (each cold start reseeds). Real, shared persistence requires
 * Supabase. This mode exists so the app always runs.
 */

function cloneCatalog(): Map<string, FreyrService> {
  return new Map(FREYR_SERVICES.map((s) => [s.id, { ...s }]));
}

const g = globalThis as unknown as {
  __fpCatalog?: Map<string, FreyrService>;
  __fpUserCompanies?: Map<string, Company>;
  __fpAccounts?: Map<string, SavedAccount>;
  __fpCache?: Map<string, CacheEntry>;
  __fpJobs?: Map<string, EnrichmentJob>;
  __fpSegments?: Map<string, CustomerSegment>;
  __fpMarkets?: Map<string, Market>;
  __fpSalesAssets?: Map<string, SalesAsset>;
  __fpApplicability?: Map<string, ServiceApplicabilityRule>;
  __fpServiceAssets?: Map<string, ServiceAssetLink>;
};

// Use globalThis so the store survives module reloads during dev HMR.
const catalog = (g.__fpCatalog ??= cloneCatalog());
const userCompanies = (g.__fpUserCompanies ??= new Map<string, Company>());
const accounts = (g.__fpAccounts ??= new Map<string, SavedAccount>());
const cache = (g.__fpCache ??= new Map<string, CacheEntry>());
const jobs = (g.__fpJobs ??= new Map<string, EnrichmentJob>());
// Commercial Enablement (V2.0-A): segments/markets seeded from code; the rest start empty.
const segments = (g.__fpSegments ??= new Map(SEGMENTS_SEED.map((s) => [s.id, { ...s }])));
const markets = (g.__fpMarkets ??= new Map(MARKETS_SEED.map((m) => [m.id, { ...m }])));
const salesAssets = (g.__fpSalesAssets ??= new Map<string, SalesAsset>());
const applicability = (g.__fpApplicability ??= new Map<string, ServiceApplicabilityRule>());
const serviceAssets = (g.__fpServiceAssets ??= new Map<string, ServiceAssetLink>());

const catalogRepo: CatalogRepo = {
  async list() {
    return Array.from(catalog.values());
  },
  async upsert(service) {
    const stamped = { ...service, lastUpdated: nowIso() };
    catalog.set(service.id, stamped);
    return stamped;
  },
  async remove(id) {
    catalog.delete(id);
  },
  async reset() {
    catalog.clear();
    for (const [k, v] of cloneCatalog()) catalog.set(k, v);
    return Array.from(catalog.values());
  },
};

function mergedCompanies(): Company[] {
  // Seed first, then stored rows override by id (e.g. an enriched demo company).
  const m = new Map<string, Company>();
  for (const c of COMPANIES) m.set(c.id, c);
  for (const c of userCompanies.values()) m.set(c.id, c);
  return Array.from(m.values());
}

const companyRepo: CompanyRepo = {
  async list() {
    return mergedCompanies();
  },
  async getById(id) {
    return userCompanies.get(id) ?? COMPANY_BY_ID[id] ?? null;
  },
  async search(query) {
    return matchCompanies(query, mergedCompanies());
  },
  async create(company) {
    userCompanies.set(company.id, company);
    return company;
  },
};

const accountRepo: AccountRepo = {
  async list() {
    return Array.from(accounts.values());
  },
  async get(companyId) {
    return accounts.get(companyId) ?? null;
  },
  async save(account) {
    if (!accounts.has(account.companyId)) accounts.set(account.companyId, account);
    return accounts.get(account.companyId)!;
  },
  async update(companyId, patch) {
    const existing = accounts.get(companyId);
    if (!existing) return null;
    const next = { ...existing, ...patch };
    accounts.set(companyId, next);
    return next;
  },
  async remove(companyId) {
    accounts.delete(companyId);
  },
};

const cacheRepo: CacheRepo = {
  async get(source, key) {
    const entry = cache.get(`${source}:${key}`);
    if (!entry) return null;
    if (new Date(entry.expiresAt).getTime() <= Date.now()) {
      cache.delete(`${source}:${key}`); // expired → miss
      return null;
    }
    return entry;
  },
  async set(entry) {
    cache.set(`${entry.source}:${entry.key}`, entry);
  },
  async delete(source, key) {
    cache.delete(`${source}:${key}`);
  },
};

const jobRepo: JobRepo = {
  async create(job) {
    jobs.set(job.id, job);
    return job;
  },
  async get(id) {
    return jobs.get(id) ?? null;
  },
  async update(id, patch) {
    const existing = jobs.get(id);
    if (!existing) return null;
    const next = { ...existing, ...patch, updatedAt: nowIso() };
    jobs.set(id, next);
    return next;
  },
};

const segmentRepo: SegmentRepo = {
  async list() {
    return Array.from(segments.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async getById(id) {
    return segments.get(id) ?? null;
  },
  async upsert(segment) {
    segments.set(segment.id, { ...segment });
    return segment;
  },
  async remove(id) {
    segments.delete(id);
  },
};

const marketRepo: MarketRepo = {
  async list() {
    return Array.from(markets.values()).sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async getById(id) {
    return markets.get(id) ?? null;
  },
  async upsert(market) {
    markets.set(market.id, { ...market });
    return market;
  },
  async remove(id) {
    markets.delete(id);
  },
};

const salesAssetRepo: SalesAssetRepo = {
  async list() {
    return Array.from(salesAssets.values());
  },
  async getById(id) {
    return salesAssets.get(id) ?? null;
  },
  async upsert(asset) {
    salesAssets.set(asset.id, { ...asset });
    return asset;
  },
  async remove(id) {
    salesAssets.delete(id);
  },
};

const applicabilityRepo: ApplicabilityRepo = {
  async list() {
    return Array.from(applicability.values());
  },
  async listForService(serviceId) {
    return Array.from(applicability.values()).filter((r) => r.serviceId === serviceId);
  },
  async getById(id) {
    return applicability.get(id) ?? null;
  },
  async upsert(rule) {
    applicability.set(rule.id, { ...rule });
    return rule;
  },
  async remove(id) {
    applicability.delete(id);
  },
};

const serviceAssetRepo: ServiceAssetRepo = {
  async list() {
    return Array.from(serviceAssets.values());
  },
  async listForService(serviceId) {
    return Array.from(serviceAssets.values()).filter((l) => l.serviceId === serviceId);
  },
  async getById(id) {
    return serviceAssets.get(id) ?? null;
  },
  async upsert(link) {
    serviceAssets.set(link.id, { ...link });
    return link;
  },
  async remove(id) {
    serviceAssets.delete(id);
  },
};

export function memoryRepos(): Repos {
  return {
    catalog: catalogRepo,
    companies: companyRepo,
    accounts: accountRepo,
    cache: cacheRepo,
    jobs: jobRepo,
    segments: segmentRepo,
    markets: marketRepo,
    salesAssets: salesAssetRepo,
    applicability: applicabilityRepo,
    serviceAssets: serviceAssetRepo,
  };
}
