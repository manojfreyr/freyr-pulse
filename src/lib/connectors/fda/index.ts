import "server-only";
import type { ConnectorOutput, EnrichInput, LiveConnector } from "@/lib/connectors/types";
import { emptyOutput } from "@/lib/connectors/types";
import { getCached, setCached } from "@/lib/cache/sourceCache";
import type { CompanySignal, SourceCitation } from "@/lib/types";
import {
  signalsFromDevices,
  signalsFromDrugsFda,
  signalsFromEnforcement,
  type Device510kResult,
  type DrugsFdaResult,
  type EnforcementResult,
  type PmaResult,
} from "./parse";

const UA = "FreyrPulseBot/1.0 (+internal sales-intelligence research)";

/** Optional free API key raises rate limits; keyless access works fine at manual volume. */
function withKey(url: string): string {
  const key = process.env.OPENFDA_API_KEY;
  return key ? `${url}&api_key=${encodeURIComponent(key)}` : url;
}

async function fdaSearch<T>(endpoint: string, field: string, name: string): Promise<T[] | null> {
  try {
    const search = `${field}:"${name.replace(/"/g, "")}"`;
    const url = withKey(`https://api.fda.gov/${endpoint}.json?search=${encodeURIComponent(search)}&limit=50`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: controller.signal });
    clearTimeout(timer);
    if (res.status === 404) return []; // openFDA returns 404 for "no matches"
    if (!res.ok) return null;
    const json = (await res.json()) as { results?: T[] };
    return json.results ?? [];
  } catch {
    return null;
  }
}

async function cached<T>(bypass: boolean, id: string, slot: string, run: () => Promise<T[] | null>): Promise<T[] | null> {
  const key = `${slot}:${id}`;
  if (!bypass) {
    const hit = await getCached<T[]>("fda", key);
    if (hit) return hit;
  }
  const fresh = await run();
  if (fresh) await setCached("fda", key, fresh);
  return fresh;
}

export const fdaConnector: LiveConnector = {
  id: "fda",
  label: "openFDA",
  appliesTo() {
    return true; // name-based; companies with no FDA footprint return empty gracefully
  },
  async enrich(input, opts): Promise<ConnectorOutput> {
    const bypass = opts.bypassCache;
    // Each endpoint degrades independently — one failure doesn't sink the rest.
    const [drugs, k510, pma, enf] = await Promise.all([
      cached<DrugsFdaResult>(bypass, input.id, "drugsfda", () => fdaSearch("drug/drugsfda", "sponsor_name", input.name)),
      cached<Device510kResult>(bypass, input.id, "510k", () => fdaSearch("device/510k", "applicant", input.name)),
      cached<PmaResult>(bypass, input.id, "pma", () => fdaSearch("device/pma", "applicant", input.name)),
      cached<EnforcementResult>(bypass, input.id, "enforcement", () => fdaSearch("drug/enforcement", "recalling_firm", input.name)),
    ]);

    const q = { name: input.name, aliases: input.aliases };
    const signals: CompanySignal[] = [
      ...signalsFromDrugsFda(drugs ?? [], q),
      ...signalsFromDevices(k510 ?? [], pma ?? [], q),
      ...signalsFromEnforcement(enf ?? [], q),
    ];

    if (!signals.length) {
      return emptyOutput("No FDA drug/device/enforcement records matched this company.");
    }
    const citations: SourceCitation[] = signals.flatMap((s) => s.citations ?? []);
    return { signals, citations, notes: [`Matched ${signals.length} FDA signal(s).`] };
  },
};
