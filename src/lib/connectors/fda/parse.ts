import type { CompanySignal, SignalCategory, SourceCitation } from "@/lib/types";

/**
 * Pure openFDA parsers — no network. Map Drugs@FDA, 510(k)/PMA, and enforcement
 * records into segment / product / device signals + lifecycle triggers
 * (post-approval, device launch, recall). FDA actions are hard facts → Verified.
 */

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\b(inc|corp|corporation|company|co|ltd|llc|plc|nv|sa|ag|gmbh|holdings?|pharmaceuticals?|pharma|therapeutics|biosciences?|biotech)\b/g, "").replace(/\s+/g, " ").trim();
}
function firmMatches(value: string | undefined, query: { name: string; aliases?: string[] }): boolean {
  if (!value) return false;
  const v = norm(value);
  if (!v) return false;
  const targets = [norm(query.name), ...(query.aliases ?? []).map(norm)].filter(Boolean);
  return targets.some((t) => t && (v === t || v.startsWith(t) || t.startsWith(v)));
}
function isoDate(d?: string): string | undefined {
  if (!d) return undefined;
  const m = d.match(/^(\d{4})-?(\d{2})-?(\d{2})$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : d;
}
function withinMonths(date: string | undefined, months: number, now: Date): boolean {
  const iso = isoDate(date);
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && now.getTime() - t < months * 30 * 24 * 3600 * 1000 && now.getTime() - t > -7 * 24 * 3600 * 1000;
}
function fdaCitation(label: string, url: string, date?: string): SourceCitation {
  const at = new Date().toISOString();
  return { sourceType: "fda", label, url, publisher: "FDA", type: "Regulatory Filing", dateRetrieved: at, retrievedAt: at, ...(isoDate(date) ? { publishedAt: isoDate(date) } : {}) };
}
function mk(key: string, label: string, category: SignalCategory, citations: SourceCitation[], confidence: CompanySignal["confidence"] = "Verified", observedAt?: string): CompanySignal {
  return { key, label, category, confidence, source: "FDA (openFDA)", sourceType: "fda", citations, ...(observedAt ? { observedAt } : {}) };
}

/* ---- Drugs@FDA ---- */
export interface DrugsFdaResult {
  sponsor_name?: string;
  application_number?: string;
  products?: { brand_name?: string }[];
  submissions?: { submission_type?: string; submission_status?: string; submission_status_date?: string }[];
}
function drugAppUrl(appNo?: string): string {
  const num = (appNo || "").replace(/\D/g, "");
  return `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=${num}`;
}
export function signalsFromDrugsFda(results: DrugsFdaResult[], query: { name: string; aliases?: string[] }, now: Date = new Date()): CompanySignal[] {
  const mine = results.filter((r) => firmMatches(r.sponsor_name, query));
  if (!mine.length) return [];
  const out: CompanySignal[] = [];
  const first = mine[0];
  const baseCite = fdaCitation(`${first.sponsor_name ?? query.name} — Drugs@FDA`, drugAppUrl(first.application_number));

  out.push(mk("approved products", "Has FDA-approved drug products", "regulatory", [baseCite]));
  out.push(mk("pharmaceutical", "Pharmaceutical (FDA approvals)", "segment", [baseCite]));

  const brands = new Set<string>();
  for (const r of mine) for (const p of r.products ?? []) if (p.brand_name) brands.add(p.brand_name);
  Array.from(brands).slice(0, 3).forEach((b) => out.push(mk(b.toLowerCase(), b, "product", [baseCite])));

  // Most recent approval → trigger.
  let latest: { date?: string; appNo?: string } | null = null;
  for (const r of mine) {
    for (const s of r.submissions ?? []) {
      if (s.submission_status === "AP" && s.submission_status_date) {
        if (!latest || (isoDate(s.submission_status_date) ?? "") > (isoDate(latest.date) ?? "")) {
          latest = { date: s.submission_status_date, appNo: r.application_number };
        }
      }
    }
  }
  if (latest && withinMonths(latest.date, 12, now)) {
    const cite = fdaCitation(`FDA approval (${isoDate(latest.date)})`, drugAppUrl(latest.appNo), latest.date);
    out.push(mk("post-approval", "Recent FDA drug approval", "trigger", [cite], "Verified", isoDate(latest.date)));
    out.push(mk("product launch", "Recent product approval", "trigger", [cite], "Verified", isoDate(latest.date)));
  }
  return out;
}

/* ---- Devices: 510(k) + PMA ---- */
export interface Device510kResult {
  applicant?: string;
  k_number?: string;
  device_name?: string;
  decision_date?: string;
}
export interface PmaResult {
  applicant?: string;
  pma_number?: string;
  trade_name?: string;
  decision_date?: string;
}
export function signalsFromDevices(k510: Device510kResult[], pma: PmaResult[], query: { name: string; aliases?: string[] }, now: Date = new Date()): CompanySignal[] {
  const mine510 = k510.filter((r) => firmMatches(r.applicant, query));
  const minePma = pma.filter((r) => firmMatches(r.applicant, query));
  if (!mine510.length && !minePma.length) return [];
  const out: CompanySignal[] = [];

  const anyUrl = mine510[0]
    ? fdaCitation(`510(k) ${mine510[0].k_number}`, `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${mine510[0].k_number}`, mine510[0].decision_date)
    : fdaCitation(`PMA ${minePma[0].pma_number}`, `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpma/pma.cfm?id=${minePma[0].pma_number}`, minePma[0].decision_date);

  out.push(mk("device", "Medical device (FDA clearances)", "derived", [anyUrl]));
  out.push(mk("medtech", "Medtech (FDA clearances)", "segment", [anyUrl]));
  out.push(mk("mdr/ivdr", "Device regulatory footprint", "derived", [anyUrl]));

  const recent510 = mine510.find((r) => withinMonths(r.decision_date, 12, now));
  const recentPma = minePma.find((r) => withinMonths(r.decision_date, 12, now));
  if (recent510) {
    const cite = fdaCitation(`510(k) ${recent510.k_number} (${isoDate(recent510.decision_date)})`, `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${recent510.k_number}`, recent510.decision_date);
    out.push(mk("device launch", `Recent 510(k) clearance: ${recent510.device_name ?? recent510.k_number}`, "trigger", [cite], "Verified", isoDate(recent510.decision_date)));
  } else if (recentPma) {
    const cite = fdaCitation(`PMA ${recentPma.pma_number} (${isoDate(recentPma.decision_date)})`, `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpma/pma.cfm?id=${recentPma.pma_number}`, recentPma.decision_date);
    out.push(mk("device launch", `Recent PMA approval: ${recentPma.trade_name ?? recentPma.pma_number}`, "trigger", [cite], "Verified", isoDate(recentPma.decision_date)));
  }
  return out;
}

/* ---- Enforcement / recalls ---- */
export interface EnforcementResult {
  recalling_firm?: string;
  product_description?: string;
  reason_for_recall?: string;
  classification?: string;
  recall_initiation_date?: string;
  recall_number?: string;
}
export function signalsFromEnforcement(results: EnforcementResult[], query: { name: string; aliases?: string[] }, now: Date = new Date()): CompanySignal[] {
  const mine = results.filter((r) => firmMatches(r.recalling_firm, query) && withinMonths(r.recall_initiation_date, 18, now));
  if (!mine.length) return [];
  const r = mine[0];
  const cite = fdaCitation(`FDA recall ${r.recall_number ?? ""} — ${r.classification ?? ""} (${isoDate(r.recall_initiation_date)})`, "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts", r.recall_initiation_date);
  return [
    mk("recall", `Recent FDA recall (${r.classification ?? "field action"})`, "trigger", [cite], "Verified", isoDate(r.recall_initiation_date)),
    mk("compliance pressure", "Recent recall / enforcement activity", "regulatory", [cite], "Verified", isoDate(r.recall_initiation_date)),
  ];
}
