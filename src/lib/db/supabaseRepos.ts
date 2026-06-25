import "server-only";
import type { Company, FreyrService, SavedAccount, SearchResult } from "@/lib/types";
import { FREYR_SERVICES } from "@/lib/mock/services";
import { COMPANIES, COMPANY_BY_ID } from "@/lib/mock/companies";
import { matchCompanies } from "@/lib/api/searchService";
import { nowIso } from "@/lib/utils/format";
import { getSupabase } from "./supabaseClient";
import type { AccountRepo, CacheEntry, CacheRepo, CatalogRepo, CompanyRepo, EnrichmentJob, JobRepo, Repos, SegmentRepo, MarketRepo, SalesAssetRepo, ApplicabilityRepo, ServiceAssetRepo } from "./repositories";
import type { CustomerSegment, Market, SalesAsset, ServiceApplicabilityRule, ServiceAssetLink } from "@/lib/commercial/types";
import { SEGMENTS_SEED, MARKETS_SEED } from "@/lib/commercial/seed";

/**
 * Shared-Postgres persistence via Supabase. Tables: service_catalog, companies,
 * saved_accounts (see supabase/schema.sql). The full domain objects are stored
 * as JSONB (`data`) with a few indexed columns for querying — pragmatic for
 * 2A.0a; later phases normalise signals/citations into their own tables.
 *
 * The five demo companies always come from the code seed; the `companies` table
 * holds only user-created companies.
 */

const TABLES = {
  catalog: "service_catalog",
  companies: "companies",
  accounts: "saved_accounts",
  cache: "source_cache",
  jobs: "enrichment_jobs",
  segments: "customer_segments",
  markets: "markets",
  salesAssets: "sales_assets",
  applicability: "service_applicability",
  serviceAssets: "service_assets",
} as const;

function fail(context: string, error: { message: string; code?: string; details?: string; hint?: string }): never {
  // Surface the real cause in server logs (visible in Vercel function logs).
  console.error(`[supabase] ${context} failed:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
  throw new Error(`Supabase ${context} failed: ${error.message}`);
}

const catalogRepo: CatalogRepo = {
  async list() {
    const { data, error } = await getSupabase().from(TABLES.catalog).select("data").order("updated_at", { ascending: true });
    if (error) fail("catalog.list", error);
    const rows = (data ?? []).map((r) => r.data as FreyrService);
    if (rows.length > 0) return rows;
    // Empty table → seed it from the bundled catalogue (idempotent upsert).
    console.warn("[supabase] service_catalog is empty — seeding from bundled catalogue. If this logs on every read, writes are not persisting.");
    const seed = FREYR_SERVICES.map((s) => ({ id: s.id, data: s, active_status: s.activeStatus, updated_at: nowIso() }));
    const ins = await getSupabase().from(TABLES.catalog).upsert(seed, { onConflict: "id" });
    if (ins.error) fail("catalog.list(seed)", ins.error);
    return [...FREYR_SERVICES];
  },
  async upsert(service) {
    const stamped = { ...service, lastUpdated: nowIso() };
    const { error } = await getSupabase()
      .from(TABLES.catalog)
      .upsert({ id: stamped.id, data: stamped, active_status: stamped.activeStatus, updated_at: nowIso() }, { onConflict: "id" });
    if (error) fail("catalog.upsert", error);
    return stamped;
  },
  async remove(id) {
    const { error } = await getSupabase().from(TABLES.catalog).delete().eq("id", id);
    if (error) fail("catalog.remove", error);
  },
  async reset() {
    const sb = getSupabase();
    const del = await sb.from(TABLES.catalog).delete().neq("id", "");
    if (del.error) fail("catalog.reset(delete)", del.error);
    const rows = FREYR_SERVICES.map((s) => ({ id: s.id, data: s, active_status: s.activeStatus, updated_at: nowIso() }));
    const ins = await sb.from(TABLES.catalog).insert(rows);
    if (ins.error) fail("catalog.reset(insert)", ins.error);
    return [...FREYR_SERVICES];
  },
};

async function fetchUserCompanies(): Promise<Company[]> {
  const { data, error } = await getSupabase().from(TABLES.companies).select("data");
  if (error) fail("companies.fetch", error);
  return (data ?? []).map((r) => r.data as Company);
}

function mergeSeedAndStored(stored: Company[]): Company[] {
  const m = new Map<string, Company>();
  for (const c of COMPANIES) m.set(c.id, c);
  for (const c of stored) m.set(c.id, c); // stored (e.g. enriched) overrides seed
  return Array.from(m.values());
}

const companyRepo: CompanyRepo = {
  async list() {
    return mergeSeedAndStored(await fetchUserCompanies());
  },
  async getById(id) {
    const { data, error } = await getSupabase().from(TABLES.companies).select("data").eq("id", id).maybeSingle();
    if (error) fail("companies.getById", error);
    if (data) return data.data as Company; // stored (may be enriched) wins
    return COMPANY_BY_ID[id] ?? null;
  },
  async search(query) {
    return matchCompanies(query, mergeSeedAndStored(await fetchUserCompanies()));
  },
  async create(company) {
    const { data, error } = await getSupabase()
      .from(TABLES.companies)
      .upsert(
        {
          id: company.id,
          name: company.name,
          website: company.website,
          origin: company.origin ?? "user",
          is_placeholder: Boolean(company.isPlaceholder),
          data: company,
          updated_at: nowIso(),
        },
        { onConflict: "id" },
      )
      .select("id");
    if (error) fail("companies.create", error);
    if (!data || data.length === 0) {
      // PostgREST returns success with 0 rows when RLS silently blocks the write
      // (commonly an UPDATE policy). Surface it instead of losing data on refresh.
      throw new Error(
        "companies.create persisted 0 rows — RLS is likely blocking writes/updates on `companies`. Run supabase/fix-rls.sql against the SAME Supabase project SUPABASE_URL points to.",
      );
    }
    return company;
  },
};

async function getAccount(companyId: string): Promise<SavedAccount | null> {
  const { data, error } = await getSupabase().from(TABLES.accounts).select("data").eq("company_id", companyId).maybeSingle();
  if (error) fail("accounts.get", error);
  return data ? (data.data as SavedAccount) : null;
}

const accountRepo: AccountRepo = {
  async list() {
    const { data, error } = await getSupabase().from(TABLES.accounts).select("data").order("updated_at", { ascending: false });
    if (error) fail("accounts.list", error);
    return (data ?? []).map((r) => r.data as SavedAccount);
  },
  async get(companyId) {
    return getAccount(companyId);
  },
  async save(account) {
    const existing = await getAccount(account.companyId);
    if (existing) return existing; // idempotent: don't overwrite an existing account
    const { error } = await getSupabase()
      .from(TABLES.accounts)
      .insert({ company_id: account.companyId, data: account, updated_at: nowIso() });
    if (error) fail("accounts.save", error);
    return account;
  },
  async update(companyId, patch) {
    const existing = await getAccount(companyId);
    if (!existing) return null;
    const next = { ...existing, ...patch };
    const { error } = await getSupabase()
      .from(TABLES.accounts)
      .update({ data: next, updated_at: nowIso() })
      .eq("company_id", companyId);
    if (error) fail("accounts.update", error);
    return next;
  },
  async remove(companyId) {
    const { error } = await getSupabase().from(TABLES.accounts).delete().eq("company_id", companyId);
    if (error) fail("accounts.remove", error);
  },
};

const cacheRepo: CacheRepo = {
  async get(source, key) {
    const { data, error } = await getSupabase()
      .from(TABLES.cache)
      .select("*")
      .eq("source", source)
      .eq("cache_key", key)
      .maybeSingle();
    if (error) fail("cache.get", error);
    if (!data) return null;
    const entry: CacheEntry = {
      source: data.source,
      key: data.cache_key,
      value: data.value,
      fetchedAt: data.fetched_at,
      expiresAt: data.expires_at,
      contentHash: data.content_hash ?? undefined,
    };
    if (new Date(entry.expiresAt).getTime() <= Date.now()) return null; // expired → miss
    return entry;
  },
  async set(entry) {
    const { error } = await getSupabase()
      .from(TABLES.cache)
      .upsert(
        {
          source: entry.source,
          cache_key: entry.key,
          value: entry.value,
          content_hash: entry.contentHash ?? null,
          fetched_at: entry.fetchedAt,
          expires_at: entry.expiresAt,
        },
        { onConflict: "source,cache_key" },
      );
    if (error) fail("cache.set", error);
  },
  async delete(source, key) {
    const { error } = await getSupabase().from(TABLES.cache).delete().eq("source", source).eq("cache_key", key);
    if (error) fail("cache.delete", error);
  },
};

function rowToJob(d: Record<string, unknown>): EnrichmentJob {
  return {
    id: d.id as string,
    companyId: d.company_id as string,
    status: d.status as EnrichmentJob["status"],
    steps: (d.steps as EnrichmentJob["steps"]) ?? [],
    progress: (d.progress as number) ?? 0,
    error: (d.error as string) ?? undefined,
    createdAt: d.created_at as string,
    updatedAt: d.updated_at as string,
  };
}

async function getJobById(id: string): Promise<EnrichmentJob | null> {
  const { data, error } = await getSupabase().from(TABLES.jobs).select("*").eq("id", id).maybeSingle();
  if (error) fail("jobs.get", error);
  return data ? rowToJob(data) : null;
}

const jobRepo: JobRepo = {
  async create(job) {
    const { error } = await getSupabase().from(TABLES.jobs).insert({
      id: job.id,
      company_id: job.companyId,
      status: job.status,
      steps: job.steps,
      progress: job.progress,
      error: job.error ?? null,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
    });
    if (error) fail("jobs.create", error);
    return job;
  },
  async get(id) {
    return getJobById(id);
  },
  async update(id, patch) {
    const current = await getJobById(id);
    if (!current) return null;
    const next = { ...current, ...patch, updatedAt: nowIso() };
    const { error } = await getSupabase()
      .from(TABLES.jobs)
      .update({
        status: next.status,
        steps: next.steps,
        progress: next.progress,
        error: next.error ?? null,
        updated_at: next.updatedAt,
      })
      .eq("id", id);
    if (error) fail("jobs.update", error);
    return next;
  },
};

// ---- Commercial Enablement (V2.0-A). Additive; nothing consumes these yet. ----

const segmentRepo: SegmentRepo = {
  async list() {
    const { data, error } = await getSupabase().from(TABLES.segments).select("data").order("display_order", { ascending: true });
    if (error) fail("segments.list", error);
    const rows = (data ?? []).map((r) => r.data as CustomerSegment);
    if (rows.length > 0) return rows;
    const seed = SEGMENTS_SEED.map((s) => ({ id: s.id, name: s.name, status: s.status, display_order: s.displayOrder, data: s, updated_at: nowIso() }));
    const ins = await getSupabase().from(TABLES.segments).upsert(seed, { onConflict: "id" });
    if (ins.error) fail("segments.list(seed)", ins.error);
    return [...SEGMENTS_SEED];
  },
  async getById(id) {
    const { data, error } = await getSupabase().from(TABLES.segments).select("data").eq("id", id).maybeSingle();
    if (error) fail("segments.getById", error);
    return (data?.data as CustomerSegment) ?? SEGMENTS_SEED.find((s) => s.id === id) ?? null;
  },
  async upsert(segment) {
    const { error } = await getSupabase()
      .from(TABLES.segments)
      .upsert({ id: segment.id, name: segment.name, status: segment.status, display_order: segment.displayOrder, data: segment, updated_at: nowIso() }, { onConflict: "id" });
    if (error) fail("segments.upsert", error);
    return segment;
  },
  async remove(id) {
    const { error } = await getSupabase().from(TABLES.segments).delete().eq("id", id);
    if (error) fail("segments.remove", error);
  },
};

const marketRepo: MarketRepo = {
  async list() {
    const { data, error } = await getSupabase().from(TABLES.markets).select("data").order("display_order", { ascending: true });
    if (error) fail("markets.list", error);
    const rows = (data ?? []).map((r) => r.data as Market);
    if (rows.length > 0) return rows;
    const seed = MARKETS_SEED.map((m) => ({ id: m.id, name: m.name, region: m.region, regulatory_body: m.regulatoryBody, status: m.status, display_order: m.displayOrder, data: m, updated_at: nowIso() }));
    const ins = await getSupabase().from(TABLES.markets).upsert(seed, { onConflict: "id" });
    if (ins.error) fail("markets.list(seed)", ins.error);
    return [...MARKETS_SEED];
  },
  async getById(id) {
    const { data, error } = await getSupabase().from(TABLES.markets).select("data").eq("id", id).maybeSingle();
    if (error) fail("markets.getById", error);
    return (data?.data as Market) ?? MARKETS_SEED.find((m) => m.id === id) ?? null;
  },
  async upsert(market) {
    const { error } = await getSupabase()
      .from(TABLES.markets)
      .upsert({ id: market.id, name: market.name, region: market.region, regulatory_body: market.regulatoryBody, status: market.status, display_order: market.displayOrder, data: market, updated_at: nowIso() }, { onConflict: "id" });
    if (error) fail("markets.upsert", error);
    return market;
  },
  async remove(id) {
    const { error } = await getSupabase().from(TABLES.markets).delete().eq("id", id);
    if (error) fail("markets.remove", error);
  },
};

const salesAssetRepo: SalesAssetRepo = {
  async list() {
    const { data, error } = await getSupabase().from(TABLES.salesAssets).select("data").order("updated_at", { ascending: true });
    if (error) fail("salesAssets.list", error);
    return (data ?? []).map((r) => r.data as SalesAsset);
  },
  async getById(id) {
    const { data, error } = await getSupabase().from(TABLES.salesAssets).select("data").eq("id", id).maybeSingle();
    if (error) fail("salesAssets.getById", error);
    return (data?.data as SalesAsset) ?? null;
  },
  async upsert(asset) {
    const { error } = await getSupabase()
      .from(TABLES.salesAssets)
      .upsert({ id: asset.id, title: asset.title, asset_type: asset.assetType, status: asset.status, url: asset.url, data: asset, updated_at: nowIso() }, { onConflict: "id" });
    if (error) fail("salesAssets.upsert", error);
    return asset;
  },
  async remove(id) {
    const { error } = await getSupabase().from(TABLES.salesAssets).delete().eq("id", id);
    if (error) fail("salesAssets.remove", error);
  },
};

const applicabilityRepo: ApplicabilityRepo = {
  async list() {
    const { data, error } = await getSupabase().from(TABLES.applicability).select("data");
    if (error) fail("applicability.list", error);
    return (data ?? []).map((r) => r.data as ServiceApplicabilityRule);
  },
  async listForService(serviceId) {
    const { data, error } = await getSupabase().from(TABLES.applicability).select("data").eq("service_id", serviceId);
    if (error) fail("applicability.listForService", error);
    return (data ?? []).map((r) => r.data as ServiceApplicabilityRule);
  },
  async getById(id) {
    const { data, error } = await getSupabase().from(TABLES.applicability).select("data").eq("id", id).maybeSingle();
    if (error) fail("applicability.getById", error);
    return (data?.data as ServiceApplicabilityRule) ?? null;
  },
  async upsert(rule) {
    const { error } = await getSupabase()
      .from(TABLES.applicability)
      .upsert({ id: rule.id, service_id: rule.serviceId, segment_id: rule.segmentId, market_id: rule.marketId, applicability: rule.applicability, data: rule, updated_at: nowIso() }, { onConflict: "id" });
    if (error) fail("applicability.upsert", error);
    return rule;
  },
  async remove(id) {
    const { error } = await getSupabase().from(TABLES.applicability).delete().eq("id", id);
    if (error) fail("applicability.remove", error);
  },
};

const serviceAssetRepo: ServiceAssetRepo = {
  async list() {
    const { data, error } = await getSupabase().from(TABLES.serviceAssets).select("data");
    if (error) fail("serviceAssets.list", error);
    return (data ?? []).map((r) => r.data as ServiceAssetLink);
  },
  async listForService(serviceId) {
    const { data, error } = await getSupabase().from(TABLES.serviceAssets).select("data").eq("service_id", serviceId);
    if (error) fail("serviceAssets.listForService", error);
    return (data ?? []).map((r) => r.data as ServiceAssetLink);
  },
  async getById(id) {
    const { data, error } = await getSupabase().from(TABLES.serviceAssets).select("data").eq("id", id).maybeSingle();
    if (error) fail("serviceAssets.getById", error);
    return (data?.data as ServiceAssetLink) ?? null;
  },
  async upsert(link) {
    const { error } = await getSupabase()
      .from(TABLES.serviceAssets)
      .upsert({ id: link.id, service_id: link.serviceId, asset_id: link.assetId, data: link, updated_at: nowIso() }, { onConflict: "id" });
    if (error) fail("serviceAssets.upsert", error);
    return link;
  },
  async remove(id) {
    const { error } = await getSupabase().from(TABLES.serviceAssets).delete().eq("id", id);
    if (error) fail("serviceAssets.remove", error);
  },
};

export function supabaseRepos(): Repos {
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
