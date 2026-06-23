import "server-only";
import type { Company, FreyrService, SavedAccount, SearchResult } from "@/lib/types";
import { FREYR_SERVICES } from "@/lib/mock/services";
import { COMPANIES, COMPANY_BY_ID } from "@/lib/mock/companies";
import { matchCompanies } from "@/lib/api/searchService";
import { nowIso } from "@/lib/utils/format";
import { getSupabase } from "./supabaseClient";
import type { AccountRepo, CatalogRepo, CompanyRepo, Repos } from "./repositories";

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

const companyRepo: CompanyRepo = {
  async list() {
    return [...COMPANIES, ...(await fetchUserCompanies())];
  },
  async getById(id) {
    if (COMPANY_BY_ID[id]) return COMPANY_BY_ID[id];
    const { data, error } = await getSupabase().from(TABLES.companies).select("data").eq("id", id).maybeSingle();
    if (error) fail("companies.getById", error);
    return data ? (data.data as Company) : null;
  },
  async search(query) {
    const merged = [...COMPANIES, ...(await fetchUserCompanies())];
    return matchCompanies(query, merged);
  },
  async create(company) {
    const { error } = await getSupabase()
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
      );
    if (error) fail("companies.create", error);
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

export function supabaseRepos(): Repos {
  return { catalog: catalogRepo, companies: companyRepo, accounts: accountRepo };
}
