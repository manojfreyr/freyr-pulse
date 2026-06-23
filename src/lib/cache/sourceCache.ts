import "server-only";
import { getRepos } from "@/lib/db";

/**
 * Per-source response cache (Phase 2A.0b). Backed by the data layer
 * (source_cache table in Supabase, in-memory map in fallback). Postgres-only —
 * no Redis. Manual "Research Again" passes { bypass: true } to force a refresh.
 *
 * No live connectors use this yet; it is the substrate they will call.
 */

/** Default TTLs (seconds) by source. Tunable per source characteristics. */
export const DEFAULT_TTL_SECONDS: Record<string, number> = {
  sec: 60 * 60 * 24, // filings change infrequently
  website: 60 * 60 * 24, // sites change slowly
  news: 60 * 60 * 3, // time-sensitive
  default: 60 * 60 * 6,
};

function ttlFor(source: string): number {
  return DEFAULT_TTL_SECONDS[source] ?? DEFAULT_TTL_SECONDS.default;
}

export async function getCached<T = unknown>(
  source: string,
  key: string,
  opts?: { bypass?: boolean },
): Promise<T | null> {
  if (opts?.bypass) return null; // forced refresh bypasses the cache
  const entry = await getRepos().cache.get(source, key);
  return entry ? (entry.value as T) : null;
}

export async function setCached(
  source: string,
  key: string,
  value: unknown,
  ttlSeconds?: number,
  contentHash?: string,
): Promise<void> {
  const ttl = ttlSeconds ?? ttlFor(source);
  const now = Date.now();
  await getRepos().cache.set({
    source,
    key,
    value,
    fetchedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ttl * 1000).toISOString(),
    contentHash,
  });
}

export async function invalidateCached(source: string, key: string): Promise<void> {
  await getRepos().cache.delete(source, key);
}
