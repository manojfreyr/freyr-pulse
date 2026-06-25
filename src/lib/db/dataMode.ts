/**
 * Chooses the persistence backend at runtime. When Supabase env vars are present
 * we use the shared Postgres database; otherwise we fall back to an in-memory,
 * seed-backed store so the app still runs (for local dev / demo). Fallback writes
 * are ephemeral — see memoryRepos.ts.
 *
 * Server-only env vars (never exposed to the client):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (preferred)  or  SUPABASE_ANON_KEY
 */
export type DataMode = "supabase" | "fallback";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY),
  );
}

export function dataMode(): DataMode {
  return isSupabaseConfigured() ? "supabase" : "fallback";
}
