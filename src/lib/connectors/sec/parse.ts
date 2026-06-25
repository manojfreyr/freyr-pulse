import type { CompanySignal, SourceCitation } from "@/lib/types";

/**
 * Pure SEC EDGAR parsers — no network. Map the public EDGAR JSON
 * (company_tickers.json, data.sec.gov submissions, optional companyfacts) into
 * signals + citations. Unit-testable against fixtures.
 */

export function padCik(cik: string | number): string {
  return String(cik).replace(/\D/g, "").padStart(10, "0");
}

interface TickerRow {
  cik_str: number;
  ticker: string;
  title: string;
}

/** Resolve a CIK from the SEC ticker map by ticker (alias) or company name. */
export function resolveCik(
  tickerMap: Record<string, TickerRow>,
  query: { name: string; aliases?: string[] },
): string | null {
  const rows = Object.values(tickerMap);
  const aliases = (query.aliases ?? []).map((a) => a.toLowerCase().trim()).filter(Boolean);

  // 1) exact ticker match against aliases
  for (const r of rows) {
    if (aliases.includes(r.ticker.toLowerCase())) return padCik(r.cik_str);
  }
  // 2) exact (normalized) name match
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\b(inc|corp|corporation|company|co|ltd|plc|nv|sa|ag|holdings?)\b/g, "").trim();
  const qn = norm(query.name);
  for (const r of rows) if (norm(r.title) === qn) return padCik(r.cik_str);
  // 3) startsWith on the normalized company name (conservative contains)
  for (const r of rows) {
    const rn = norm(r.title);
    if (qn && (rn.startsWith(qn) || qn.startsWith(rn))) return padCik(r.cik_str);
  }
  return null;
}

function secCitation(label: string, url: string, filingDate?: string): SourceCitation {
  return {
    sourceType: "sec",
    label,
    url,
    publisher: "SEC EDGAR",
    type: "Regulatory Filing",
    dateRetrieved: new Date().toISOString(),
    retrievedAt: new Date().toISOString(),
    ...(filingDate ? { publishedAt: filingDate } : {}),
  };
}

function edgarCompanyUrl(cik: string): string {
  return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=&dateb=&owner=include&count=40`;
}

function edgarFilingUrl(cik: string, accession: string): string {
  const noDashes = accession.replace(/-/g, "");
  const cikNoPad = String(parseInt(cik, 10));
  return `https://www.sec.gov/Archives/edgar/data/${cikNoPad}/${noDashes}/${accession}-index.htm`;
}

/** Maps a filing form type to a trigger signal key (or null to skip). */
function triggerForForm(form: string): { key: string; label: string } | null {
  const f = form.toUpperCase();
  if (f === "8-K") return { key: "material event", label: "Material event (8-K)" };
  if (f.startsWith("S-4") || f === "425" || f.startsWith("DEFM14")) return { key: "m&a", label: "M&A activity (filing)" };
  if (f.startsWith("S-1") || f.startsWith("S-3") || f === "424B4") return { key: "capital raise", label: "Capital raise (filing)" };
  return null;
}

export interface SecSubmissions {
  name?: string;
  sicDescription?: string;
  tickers?: string[];
  exchanges?: string[];
  addresses?: { business?: { stateOrCountry?: string; country?: string; city?: string } };
  filings?: { recent?: { form?: string[]; filingDate?: string[]; accessionNumber?: string[]; primaryDocDescription?: string[] } };
}

/** Build signals from a submissions document. `now` is injectable for tests. */
export function signalsFromSubmissions(cik: string, sub: SecSubmissions, now: Date = new Date()): CompanySignal[] {
  const out: CompanySignal[] = [];
  const companyCite = secCitation(`${sub.name ?? "Company"} — SEC EDGAR filer`, edgarCompanyUrl(cik));

  // Public status — they file with the SEC.
  out.push({ key: "public", label: "Publicly traded (SEC filer)", category: "segment", confidence: "Verified", source: "SEC EDGAR", sourceType: "sec", citations: [companyCite] });

  // Segment from SIC description.
  if (sub.sicDescription) {
    out.push({ key: sub.sicDescription.toLowerCase().trim(), label: sub.sicDescription, category: "segment", confidence: "Likely", source: "SEC SIC classification", sourceType: "sec", citations: [companyCite] });
  }

  // Footprint from business address.
  const country = sub.addresses?.business?.country || sub.addresses?.business?.stateOrCountry;
  if (country) {
    out.push({ key: country.toLowerCase().trim(), label: `HQ: ${country}`, category: "footprint", confidence: "Likely", source: "SEC business address", sourceType: "sec", citations: [companyCite] });
  }

  // Recent filings → triggers (last 18 months, capped).
  const recent = sub.filings?.recent;
  if (recent?.form && recent.filingDate && recent.accessionNumber) {
    const cutoff = new Date(now.getTime() - 18 * 30 * 24 * 60 * 60 * 1000);
    let added = 0;
    for (let i = 0; i < recent.form.length && added < 6; i++) {
      const form = recent.form[i];
      const date = recent.filingDate[i];
      const acc = recent.accessionNumber[i];
      if (!form || !date || !acc) continue;
      if (new Date(date) < cutoff) continue;
      const trig = triggerForForm(form);
      if (!trig) continue;
      const cite = secCitation(`SEC ${form} (${date})`, edgarFilingUrl(cik, acc), date);
      out.push({ key: trig.key, label: trig.label, category: "trigger", confidence: "Likely", source: `SEC ${form}`, sourceType: "sec", citations: [cite], observedAt: date });
      added++;
    }
  }
  return out;
}

interface CompanyFacts {
  facts?: { "us-gaap"?: Record<string, { units?: Record<string, Array<{ val?: number; fy?: number; form?: string; end?: string }>> }> };
}

const REVENUE_CONCEPTS = ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax", "SalesRevenueNet"];

/** Latest annual revenue → a size signal (Verified). Graceful: returns [] if absent. */
export function signalsFromCompanyFacts(cik: string, facts: CompanyFacts): CompanySignal[] {
  const usgaap = facts.facts?.["us-gaap"];
  if (!usgaap) return [];
  for (const concept of REVENUE_CONCEPTS) {
    const usd = usgaap[concept]?.units?.["USD"];
    if (!usd?.length) continue;
    const annual = usd.filter((p) => p.form === "10-K" && typeof p.val === "number");
    const latest = (annual.length ? annual : usd).slice().sort((a, b) => (b.end ?? "").localeCompare(a.end ?? ""))[0];
    if (!latest?.val) continue;
    const billions = latest.val / 1e9;
    const label = billions >= 1 ? `~$${billions.toFixed(1)}B annual revenue` : `~$${(latest.val / 1e6).toFixed(0)}M annual revenue`;
    const sizeKey = billions >= 10 ? "enterprise" : billions >= 1 ? "large" : "mid-market";
    const cite = secCitation(`SEC XBRL ${concept} (FY${latest.fy ?? ""})`, edgarCompanyUrl(cik), latest.end);
    return [{ key: sizeKey, label, category: "size", confidence: "Verified", source: "SEC XBRL financials", sourceType: "sec", citations: [cite], observedAt: latest.end }];
  }
  return [];
}
