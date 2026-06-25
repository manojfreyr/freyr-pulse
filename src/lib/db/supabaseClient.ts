import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client. Constructed lazily so the app runs in fallback
 * mode (no env vars) without ever touching this. The service-role key must never
 * reach the browser — this module is import-guarded by "server-only".
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing).");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
