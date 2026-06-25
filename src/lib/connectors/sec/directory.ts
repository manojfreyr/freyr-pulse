import "server-only";
import { getCached, setCached } from "@/lib/cache/sourceCache";
import { normalizeName } from "@/lib/discovery/resolve";

/**
 * Search the free SEC company_tickers.json directory (every US public filer).
 * Reuses the existing source_cache; deterministic ranking; no paid API.
 */

const TICKERS_URL = "https://www.sec.gov/files/company_tickers.json";

export interface SecDirectoryHit {
  name: string;
  ticker: string;
  cik: string; // zero-padded to 10
}
interface TickerRow {
  cik_str: number;
  ticker: string;
  title: string;
}

function userAgent(): string {
  return process.env.SEC_USER_AGENT || "Freyr Pulse research bot (set SEC_USER_AGENT to your contact email)";
}
function padCik(cik: number): string {
  return String(cik).padStart(10, "0");
}

async function loadDirectory(): Promise<TickerRow[] | null> {
  const cached = await getCached<TickerRow[]>("sec", "directory:all");
  if (cached) return cached;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(TICKERS_URL, { headers: { "User-Agent": userAgent(), Accept: "application/json" }, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, TickerRow>;
    const rows = Object.values(json);
    await setCached("sec", "directory:all", rows);
    return rows;
  } catch {
    return null;
  }
}

export async function searchSecDirectory(query: string, limit = 6): Promise<SecDirectoryHit[]> {
  const rows = await loadDirectory();
  if (!rows) return [];
  const q = query.trim();
  if (!q) return [];
  const qUpper = q.toUpperCase();
  const qn = normalizeName(q);

  const scored: { row: TickerRow; rank: number }[] = [];
  for (const row of rows) {
    const rn = normalizeName(row.title);
    let rank = 0;
    if (row.ticker.toUpperCase() === qUpper) rank = 100;
    else if (qn && rn === qn) rank = 90;
    else if (qn && rn.startsWith(qn)) rank = 70;
    else if (qn && qn.length >= 3 && rn.includes(qn)) rank = 50;
    else if (qn && qn.length >= 3 && qn.includes(rn) && rn.length >= 3) rank = 40;
    if (rank > 0) scored.push({ row, rank });
  }
  scored.sort((a, b) => (b.rank !== a.rank ? b.rank - a.rank : a.row.title.localeCompare(b.row.title)));
  return scored.slice(0, limit).map(({ row }) => ({ name: row.title, ticker: row.ticker, cik: padCik(row.cik_str) }));
}
