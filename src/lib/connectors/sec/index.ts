import "server-only";
import type { ConnectorOutput, EnrichInput, LiveConnector } from "@/lib/connectors/types";
import { emptyOutput } from "@/lib/connectors/types";
import { getCached, setCached } from "@/lib/cache/sourceCache";
import { padCik, resolveCik, signalsFromCompanyFacts, signalsFromSubmissions, type SecSubmissions } from "./parse";
import type { CompanySignal, SourceCitation } from "@/lib/types";

const TICKERS_URL = "https://www.sec.gov/files/company_tickers.json";
const SUBMISSIONS_URL = (cik: string) => `https://data.sec.gov/submissions/CIK${cik}.json`;
const FACTS_URL = (cik: string) => `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;

function userAgent(): string {
  // SEC fair-access requires a descriptive UA with contact info.
  return process.env.SEC_USER_AGENT || "Freyr Pulse research bot (set SEC_USER_AGENT to your contact email)";
}

async function secGet<T>(url: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      headers: { "User-Agent": userAgent(), Accept: "application/json", "Accept-Encoding": "gzip, deflate" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms)); // politeness between requests

async function resolveCikCached(input: EnrichInput, bypassCache: boolean): Promise<string | null> {
  const cacheKey = `cik:${input.id}`;
  if (!bypassCache) {
    const cached = await getCached<string>("sec", cacheKey);
    if (cached) return cached;
  }
  // Ticker map is large and stable — cache it for a long time regardless of bypass.
  let map = await getCached<Record<string, { cik_str: number; ticker: string; title: string }>>("sec", "tickermap");
  if (!map) {
    map = await secGet<Record<string, { cik_str: number; ticker: string; title: string }>>(TICKERS_URL);
    if (map) await setCached("sec", "tickermap", map, 60 * 60 * 24 * 30);
  }
  if (!map) return null;
  const cik = resolveCik(map, { name: input.name, aliases: input.aliases });
  if (cik) await setCached("sec", cacheKey, cik, 60 * 60 * 24 * 30);
  return cik;
}

export const secConnector: LiveConnector = {
  id: "sec",
  label: "SEC EDGAR",
  appliesTo() {
    return true; // always attempt; non-filers return an empty result gracefully
  },
  async enrich(input, opts): Promise<ConnectorOutput> {
    const cik = await resolveCikCached(input, opts.bypassCache);
    if (!cik) {
      return emptyOutput("No SEC filer matched — likely private, foreign, or pre-IPO. SEC covers US public companies only.");
    }
    const padded = padCik(cik);

    const subKey = `submissions:${padded}`;
    let sub = opts.bypassCache ? null : await getCached<SecSubmissions>("sec", subKey);
    if (!sub) {
      sub = await secGet<SecSubmissions>(SUBMISSIONS_URL(padded));
      if (sub) await setCached("sec", subKey, sub);
      await sleep(150);
    }
    if (!sub) return emptyOutput("Found a CIK but the SEC submissions request failed.");

    const signals: CompanySignal[] = signalsFromSubmissions(padded, sub);

    // Optional financials (graceful — skip on any failure).
    const factsKey = `facts:${padded}`;
    let facts = opts.bypassCache ? null : await getCached<Parameters<typeof signalsFromCompanyFacts>[1]>("sec", factsKey);
    if (!facts) {
      facts = await secGet<Parameters<typeof signalsFromCompanyFacts>[1]>(FACTS_URL(padded));
      if (facts) await setCached("sec", factsKey, facts);
    }
    if (facts) signals.push(...signalsFromCompanyFacts(padded, facts));

    const citations: SourceCitation[] = signals.flatMap((s) => s.citations ?? []);
    return { signals, citations, notes: [`Matched SEC CIK ${padded}; ${signals.length} signal(s).`] };
  },
};
