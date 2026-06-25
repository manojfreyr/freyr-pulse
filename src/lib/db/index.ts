import "server-only";
import { dataMode, type DataMode } from "./dataMode";
import type { Repos } from "./repositories";
import { memoryRepos } from "./memoryRepos";
import { supabaseRepos } from "./supabaseRepos";

/**
 * Returns the active repositories. Supabase when configured, otherwise the
 * in-memory fallback. Importing supabaseRepos is side-effect-free; the Supabase
 * client is only constructed lazily inside getSupabase(), so the fallback path
 * never connects to anything.
 */
export function getRepos(): Repos {
  return dataMode() === "supabase" ? supabaseRepos() : memoryRepos();
}

export function currentDataMode(): DataMode {
  return dataMode();
}
