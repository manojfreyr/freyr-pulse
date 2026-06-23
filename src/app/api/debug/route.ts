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
    tests.push(await roundTrip("service_catalog", "id", { id: probe, data: { probe: true }, active_status: true, updated_at: now }));
    tests.push(await roundTrip("companies", "id", { id: probe, name: "Debug Probe", website: "x", origin: "user", is_placeholder: true, data: { probe: true }, updated_at: now }));
    tests.push(await roundTrip("saved_accounts", "company_id", { company_id: probe, data: { probe: true }, updated_at: now }));
  } catch (e) {
    return NextResponse.json({ dataMode: mode, env, fatal: e instanceof Error ? e.message : String(e), tests });
  }

  const allOk = (tests as { steps: Step[] }[]).every((t) => t.steps.every((s) => s.ok));
  return NextResponse.json({ dataMode: mode, env, allWritesOk: allOk, tests });
}
