import type { Company, FreyrService, SavedAccount, SearchResult } from "@/lib/types";
import type { EnrichmentJob } from "@/lib/db/repositories";

/**
 * Client-side API wrapper. The UI calls these instead of touching localStorage;
 * the server decides whether data is backed by Supabase or the in-memory
 * fallback. All functions are async.
 */

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

const jsonInit = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { "content-type": "application/json" },
  body: body === undefined ? undefined : JSON.stringify(body),
});

/* ---- health ---- */
export async function getHealth(): Promise<{ status: string; dataMode: "supabase" | "fallback" }> {
  return json(await fetch("/api/health", { cache: "no-store" }));
}

/* ---- catalog ---- */
export async function getCatalog(): Promise<FreyrService[]> {
  return json(await fetch("/api/catalog", { cache: "no-store" }));
}
export async function saveService(service: FreyrService): Promise<FreyrService> {
  return json(await fetch("/api/catalog", jsonInit("POST", service)));
}
export async function deleteService(id: string): Promise<void> {
  await json(await fetch(`/api/catalog/${encodeURIComponent(id)}`, jsonInit("DELETE")));
}
export async function resetCatalog(): Promise<FreyrService[]> {
  return json(await fetch("/api/catalog/reset", jsonInit("POST")));
}

/* ---- companies ---- */
export async function searchCompanies(query: string): Promise<SearchResult[]> {
  return json(await fetch(`/api/companies?q=${encodeURIComponent(query)}`, { cache: "no-store" }));
}
export async function listCompanies(): Promise<Company[]> {
  return json(await fetch("/api/companies", { cache: "no-store" }));
}
export async function getCompany(id: string): Promise<Company | null> {
  const res = await fetch(`/api/companies/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  return json(res);
}
export async function createCompany(company: Company): Promise<Company> {
  return json(await fetch("/api/companies", jsonInit("POST", company)));
}

/* ---- accounts ---- */
export async function listAccounts(): Promise<SavedAccount[]> {
  return json(await fetch("/api/accounts", { cache: "no-store" }));
}
export async function saveAccount(account: SavedAccount): Promise<SavedAccount> {
  return json(await fetch("/api/accounts", jsonInit("POST", account)));
}
export async function updateAccount(companyId: string, patch: Partial<SavedAccount>): Promise<SavedAccount | null> {
  return json(await fetch(`/api/accounts/${encodeURIComponent(companyId)}`, jsonInit("PATCH", patch)));
}
export async function removeAccount(companyId: string): Promise<void> {
  await json(await fetch(`/api/accounts/${encodeURIComponent(companyId)}`, jsonInit("DELETE")));
}
/* ---- enrichment (Phase 2A.0c) ---- */
export async function startEnrichment(companyId: string): Promise<{ jobId: string; steps: EnrichmentJob["steps"]; status: string }> {
  return json(await fetch(`/api/companies/${encodeURIComponent(companyId)}/enrich`, jsonInit("POST")));
}
export async function runNextStep(jobId: string): Promise<EnrichmentJob & { company?: Company | null }> {
  return json(await fetch(`/api/enrichment/${encodeURIComponent(jobId)}/run-next`, jsonInit("POST")));
}
export async function getJob(jobId: string): Promise<EnrichmentJob> {
  return json(await fetch(`/api/enrichment/${encodeURIComponent(jobId)}`, { cache: "no-store" }));
}

/* ---- export (Phase 2C) ---- */
export async function exportBrief(
  companyId: string,
  deliverable: string,
  format: string,
  persona?: string,
): Promise<{ blob: Blob; filename: string }> {
  const res = await fetch(
    `/api/companies/${encodeURIComponent(companyId)}/export`,
    jsonInit("POST", { deliverable, format, persona }),
  );
  if (!res.ok) {
    let message = `Export failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") || "";
  const m = cd.match(/filename="(.+?)"/);
  return { blob, filename: m?.[1] ?? `${companyId}-${deliverable}.${format}` };
}

/* ---- discovery & onboarding (Phase 2E) ---- */
export interface DirectoryHit { name: string; ticker: string; cik: string }
export async function discover(query: string): Promise<{ accounts: SearchResult[]; directory: DirectoryHit[] }> {
  return json(await fetch(`/api/discovery?q=${encodeURIComponent(query)}`, { cache: "no-store" }));
}
export async function onboardCompany(
  input: string,
  hints?: { name?: string; website?: string; ticker?: string; cik?: string },
): Promise<{ company: Company; created: boolean; possibleDuplicates: { id: string; name: string }[] }> {
  return json(await fetch("/api/companies/onboard", jsonInit("POST", { input, ...hints })));
}
export async function saveCompany(company: Company): Promise<Company> {
  return json(await fetch("/api/companies", jsonInit("POST", company)));
}
