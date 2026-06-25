import { NextResponse } from "next/server";
import { dataMode } from "@/lib/db/dataMode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Persistence diagnostics. Performs a real insert -> read-back -> delete on each
 * table and returns the raw Supabase error for any failing step. This pinpoints
 * RLS denials (code 42501), missing columns (42703), missing unique/PK
 * constraints for upsert (42P10), missing tables (42P01), etc. Safe: it only
 * touches throwaway rows it then deletes. Behind the access gate in production.
 */
type Step = { step: string; ok: boolean; error?: unknown; rowsReadBack?: number };

function describe(error: unknown) {
  if (!error) return undefined;
  const e = error as { message?: string; code?: string; details?: string; hint?: string };
  return { message: e.message, code: e.code, details: e.details, hint: e.hint };
}

async function roundTrip(
  table: string,
  idColumn: string,
  row: Record<string, unknown>,
): Promise<{ table: string; steps: Step[] }> {
  const { getSupabase } = await import("@/lib/db/supabaseClient");
  const sb = getSupabase();
  const id = row[idColumn] as string;
  const steps: Step[] = [];

  const ins = await sb.from(table).insert(row);
  steps.push({ step: "insert", ok: !ins.error, error: describe(ins.error) });

  const sel = await sb.from(table).select("*").eq(idColumn, id);
  steps.push({ step: "read-back", ok: !sel.error, error: describe(sel.error), rowsReadBack: sel.data?.length ?? 0 });

  const del = await sb.from(table).delete().eq(idColumn, id);
  steps.push({ step: "delete", ok: !del.error, error: describe(del.error) });

  return { table, steps };
}

/** Lightweight existence/readability check (for tables we don't write in debug,
 *  e.g. those with FKs). A missing table errors with 42P01. */
async function existsCheck(table: string): Promise<{ table: string; steps: Step[] }> {
  const { getSupabase } = await import("@/lib/db/supabaseClient");
  const sel = await getSupabase().from(table).select("*").limit(1);
  return { table, steps: [{ step: "exists", ok: !sel.error, error: describe(sel.error) }] };
}

/** Companies enrichment-UPDATE round-trip: insert placeholder → upsert(UPDATE) with
 *  enrichment + is_placeholder=false → read back → confirm it actually persisted.
 *  This is the exact path runStep uses; RLS that allows INSERT but denies UPDATE
 *  shows up here (the earlier insert-only check would miss it). */
async function companiesEnrichmentRoundTrip(): Promise<{ table: string; steps: Step[]; persistence: Record<string, boolean> }> {
  const { getSupabase } = await import("@/lib/db/supabaseClient");
  const sb = getSupabase();
  const id = `__debug_enrich_${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const steps: Step[] = [];

  const insRow = { id, name: "Debug Probe", website: "x", origin: "user", is_placeholder: true, data: { id, isPlaceholder: true }, updated_at: now };
  const ins = await sb.from("companies").upsert(insRow, { onConflict: "id" }).select("id");
  steps.push({ step: "insert(upsert)", ok: !ins.error && (ins.data?.length ?? 0) > 0, error: describe(ins.error), rowsReadBack: ins.data?.length ?? 0 });

  const enrichedData = { id, isPlaceholder: false, enrichment: { signals: [{ key: "probe" }], citations: [], lastResearchedAt: now, runs: [] } };
  const updRow = { id, name: "Debug Probe", website: "x", origin: "user", is_placeholder: false, data: enrichedData, updated_at: now };
  const upd = await sb.from("companies").upsert(updRow, { onConflict: "id" }).select("id");
  steps.push({ step: "update(upsert)", ok: !upd.error && (upd.data?.length ?? 0) > 0, error: describe(upd.error), rowsReadBack: upd.data?.length ?? 0 });

  const sel = await sb.from("companies").select("data,is_placeholder").eq("id", id).maybeSingle();
  const data = (sel.data?.data ?? {}) as { enrichment?: { lastResearchedAt?: string }; isPlaceholder?: boolean };
  const persistence = {
    enrichmentPersisted: Boolean(data.enrichment),
    lastResearchedAtPersisted: Boolean(data.enrichment?.lastResearchedAt),
    isPlaceholderFalsePersisted: sel.data?.is_placeholder === false && data.isPlaceholder === false,
  };
  steps.push({ step: "read-back", ok: !sel.error, error: describe(sel.error), rowsReadBack: sel.data ? 1 : 0 });

  await sb.from("companies").delete().eq("id", id);
  return { table: "companies(enrichment UPDATE)", steps, persistence };
}

export async function GET() {
  const mode = dataMode();
  const env = {
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY),
    APP_ACCESS_PASSPHRASE: Boolean(process.env.APP_ACCESS_PASSPHRASE),
  };

  if (mode !== "supabase") {
    return NextResponse.json({
      dataMode: mode,
      env,
      note: "Not in Supabase mode — set SUPABASE_URL and a key. Persistence uses the ephemeral in-memory fallback.",
    });
  }

  const probe = `__debug_${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const tests: unknown[] = [];
  try {
    // 2A.0a tables
    tests.push(await roundTrip("service_catalog", "id", { id: probe, data: { probe: true }, active_status: true, updated_at: now }));
    tests.push(await roundTrip("companies", "id", { id: probe, name: "Debug Probe", website: "x", origin: "user", is_placeholder: true, data: { probe: true }, updated_at: now }));
    tests.push(await roundTrip("saved_accounts", "company_id", { company_id: probe, data: { probe: true }, updated_at: now }));
    // 2A.0b tables (provenance, cache, jobs)
    tests.push(await roundTrip("citations", "id", { id: probe, source_type: "news", label: "Debug Probe", url: "x", retrieved_at: now }));
    tests.push(await roundTrip("source_cache", "cache_key", { source: "__debug", cache_key: probe, value: { probe: true }, fetched_at: now, expires_at: now }));
    tests.push(await roundTrip("enrichment_jobs", "id", { id: probe, company_id: "debug", status: "queued", steps: [], progress: 0, created_at: now, updated_at: now }));
    tests.push(await existsCheck("signal_citations"));
  } catch (e) {
    return NextResponse.json({ dataMode: mode, env, fatal: e instanceof Error ? e.message : String(e), tests });
  }

  // The decisive test for THIS bug: does an enrichment UPDATE persist?
  let enrichmentTest: Awaited<ReturnType<typeof companiesEnrichmentRoundTrip>> | { error: string };
  try {
    enrichmentTest = await companiesEnrichmentRoundTrip();
  } catch (e) {
    enrichmentTest = { error: e instanceof Error ? e.message : String(e) };
  }

  const allOk = (tests as { steps: Step[] }[]).every((t) => t.steps.every((s) => s.ok));
  const p = "persistence" in enrichmentTest ? enrichmentTest.persistence : null;
  const enrichmentPersists = Boolean(p && p.enrichmentPersisted && p.lastResearchedAtPersisted && p.isPlaceholderFalsePersisted);
  const conclusion = enrichmentPersists
    ? "OK — companies UPDATE persists enrichment, lastResearchedAt, and isPlaceholder=false. Refresh persistence should work."
    : "FAIL — enrichment UPDATE did not persist. If insert(upsert) is ok but update(upsert) returns 0 rows or error 42501, RLS is blocking UPDATE on `companies`: run supabase/fix-rls.sql against the SAME project SUPABASE_URL points to.";

  return NextResponse.json({ dataMode: mode, env, allWritesOk: allOk, enrichmentPersists, conclusion, enrichmentTest, tests });
}
