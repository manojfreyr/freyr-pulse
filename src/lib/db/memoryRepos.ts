import type { Company, FreyrService, SavedAccount, SearchResult } from "@/lib/types";
import { FREYR_SERVICES } from "@/lib/mock/services";
import { COMPANIES, COMPANY_BY_ID } from "@/lib/mock/companies";
import { matchCompanies } from "@/lib/api/searchService";
import { nowIso } from "@/lib/utils/format";
import type { AccountRepo, CatalogRepo, CompanyRepo, Repos } from "./repositories";

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
};

// Use globalThis so the store survives module reloads during dev HMR.
const catalog = (g.__fpCatalog ??= cloneCatalog());
const userCompanies = (g.__fpUserCompanies ??= new Map<string, Company>());
const accounts = (g.__fpAccounts ??= new Map<string, SavedAccount>());

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

function allCompaniesList(): Company[] {
  return [...COMPANIES, ...userCompanies.values()];
}

const companyRepo: CompanyRepo = {
  async list() {
    return allCompaniesList();
  },
  async getById(id) {
    return COMPANY_BY_ID[id] ?? userCompanies.get(id) ?? null;
  },
  async search(query) {
    return matchCompanies(query, allCompaniesList());
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

export function memoryRepos(): Repos {
  return { catalog: catalogRepo, companies: companyRepo, accounts: accountRepo };
}
