import type { Company, ConfidenceRating } from "@/lib/types";

/**
 * ──────────────────────────────────────────────────────────────────────────
 * COMPANY SIGNAL LAYER
 * ──────────────────────────────────────────────────────────────────────────
 * A normalized, source-agnostic description of "what we know about a company"
 * that sits between raw data and the consumers that reason over it.
 *
 *   Phase 1:  structured Company  ─┐
 *   Phase 2:  live connectors    ──┼─→ CompanySignal[]  →  matcher / scoring / UI
 *                                  ┘   (mergeSignals)
 *
 * Why this exists:
 *  - The matcher used to flatten a company into an anonymous bag of strings,
 *    discarding the confidence + provenance the rest of the app tracks. Signals
 *    keep that metadata, so recommendations can be confidence-weighted later.
 *  - Live sources (FDA, SEC, news, CRM…) emit discrete facts, not whole Company
 *    objects. CompanySignal is the clean normalization + merge target for them.
 *
 * Scope (intentionally thin): no persistence, no scoring changes. `deriveSignals`
 * is a faithful, structured replacement for the old in-matcher bag — the matching
 * key set it produces is identical, so current behavior is preserved exactly.
 */

export type SignalCategory =
  | "therapeutic-area"
  | "segment"
  | "size"
  | "footprint"
  | "trigger"
  | "product"
  | "market"
  | "pain-point"
  | "derived";

export interface CompanySignal {
  /** Normalized lowercase token used for matching (e.g. "oncology", "global"). */
  key: string;
  /** Human-readable form for display. */
  label: string;
  category: SignalCategory;
  confidence: ConfidenceRating;
  /** Provenance: where this signal came from (Phase 2: connector/source name). */
  source: string;
  /** Optional future weighting hook (unused by Phase 1 scoring). */
  weight?: number;
}

const CONFIDENCE_RANK: Record<ConfidenceRating, number> = {
  Verified: 3,
  Likely: 2,
  Inferred: 1,
  Unknown: 0,
};

/** Keeps the higher-confidence signal when two share a key. */
function strongerSignal(a: CompanySignal, b: CompanySignal): CompanySignal {
  return CONFIDENCE_RANK[b.confidence] > CONFIDENCE_RANK[a.confidence] ? b : a;
}

/**
 * Derives the normalized signal set for a company from its structured profile.
 * Confidence + source are carried from the underlying fields where they exist
 * (triggers, products, pain points) and default sensibly otherwise.
 */
export function deriveSignals(company: Company): CompanySignal[] {
  const byKey = new Map<string, CompanySignal>();
  const add = (
    raw: string | undefined,
    category: SignalCategory,
    confidence: ConfidenceRating,
    source: string,
    label?: string,
  ) => {
    if (!raw) return;
    const key = raw.toLowerCase().trim();
    if (!key) return;
    const signal: CompanySignal = { key, label: label ?? raw, category, confidence, source };
    const existing = byKey.get(key);
    byKey.set(key, existing ? strongerSignal(existing, signal) : signal);
  };

  const PROFILE = "Company profile";

  // For unknown / newly-created placeholder profiles, generic profile-derived
  // signals (segment, size, footprint, therapeutic focus) are unverified guesses
  // — label them Unknown until live sources confirm them. Demo profiles keep
  // their curated Likely/Inferred ratings. Trigger/product/pain-point signals
  // always carry their own per-item confidence and are unaffected.
  const profileConf: ConfidenceRating = company.isPlaceholder ? "Unknown" : "Likely";
  const derivedConf: ConfidenceRating = company.isPlaceholder ? "Unknown" : "Inferred";

  // Therapeutic focus / areas
  company.snapshot.therapeuticFocus.forEach((t) => add(t, "therapeutic-area", profileConf, PROFILE));
  company.therapeuticAreas.forEach((t) => add(t.name, "therapeutic-area", profileConf, PROFILE));

  // Segment & size
  add(company.snapshot.industrySegment, "segment", profileConf, PROFILE);
  add(company.snapshot.sizeCategory, "size", profileConf, PROFILE);

  // Footprint
  const regions = new Set(company.snapshot.globalLocations.map((l) => l.region));
  if (regions.size >= 2) {
    add("global", "footprint", profileConf, PROFILE);
    add("many markets", "footprint", profileConf, PROFILE);
  }
  if (company.snapshot.sizeCategory.startsWith("Enterprise") || company.snapshot.sizeCategory.startsWith("Large")) {
    add("enterprise", "size", profileConf, PROFILE);
    add("broad portfolio", "derived", derivedConf, PROFILE);
  }

  // Triggers (type + a few derived terms from the headline)
  company.triggers.forEach((t) => {
    const src = t.source?.label ?? "News & events";
    add(t.type, "trigger", t.confidence, src);
    const h = t.headline.toLowerCase();
    ["biosimilar", "acquisition", "oncology", "cell therapy", "mdr", "ivdr", "digital", "vendor", "device", "launch", "expansion", "integration"].forEach((k) => {
      if (h.includes(k)) add(k, "trigger", t.confidence, src);
    });
  });

  // Products
  company.products.forEach((p) => {
    const src = "Product portfolio";
    add(p.category, "product", p.confidence, src);
    add(p.therapeuticArea, "therapeutic-area", p.confidence, src);
    p.approvedMarkets.forEach((m) => add(m, "market", p.confidence, src));
    const c = p.category.toLowerCase();
    if (c.includes("biosimilar")) add("biosimilar", "derived", p.confidence, src);
    if (c.includes("cell therapy")) add("cell therapy", "derived", p.confidence, src);
    if (c.includes("device") || c.includes("implant")) {
      add("device", "derived", p.confidence, src);
      add("medtech", "derived", p.confidence, src);
      add("mdr/ivdr", "derived", p.confidence, src);
    }
    if (c.includes("connected") || c.includes("digital") || c.includes("samd")) {
      add("connected", "derived", p.confidence, src);
      add("digital", "derived", p.confidence, src);
      add("software", "derived", p.confidence, src);
    }
    if (c.includes("combination")) add("delivery", "derived", p.confidence, src);
    if (c.includes("mrna")) add("mrna", "derived", p.confidence, src);
  });

  // Pain points (titles)
  company.painPoints.forEach((pp) => add(pp.title, "pain-point", pp.confidence, "Pain-point analysis"));

  // Segment-derived
  const seg = company.snapshot.industrySegment.toLowerCase();
  if (seg.includes("device") || seg.includes("medtech")) {
    add("device", "derived", derivedConf, PROFILE);
    add("medtech", "derived", derivedConf, PROFILE);
    add("mdr/ivdr", "derived", derivedConf, PROFILE);
  }
  if (seg.includes("diagnostic")) add("diagnostics", "derived", derivedConf, PROFILE);

  return Array.from(byKey.values());
}

/** The set of matching keys (equivalent to the old anonymous signal bag). */
export function signalKeys(signals: CompanySignal[]): Set<string> {
  return new Set(signals.map((s) => s.key));
}

/** Substring-tolerant match used by the matcher (preserves prior semantics). */
export function signalMatches(keys: Set<string>, term: string): boolean {
  const t = term.toLowerCase();
  if (keys.has(t)) return true;
  for (const k of keys) {
    if (k.includes(t) || t.includes(k)) return true;
  }
  return false;
}

/** Groups signals by category — handy for a future "Signals" UI panel. */
export function groupSignalsByCategory(signals: CompanySignal[]): Record<SignalCategory, CompanySignal[]> {
  const out = {} as Record<SignalCategory, CompanySignal[]>;
  for (const s of signals) (out[s.category] ??= []).push(s);
  return out;
}

/**
 * Phase 2 merge: combine signals from multiple sources (structured profile +
 * each live connector), de-duplicating by key and keeping the highest-confidence
 * instance. When two sources agree, provenance is combined for transparency.
 */
export function mergeSignals(...lists: CompanySignal[][]): CompanySignal[] {
  const byKey = new Map<string, CompanySignal>();
  for (const list of lists) {
    for (const s of list) {
      const existing = byKey.get(s.key);
      if (!existing) {
        byKey.set(s.key, s);
      } else {
        const winner = strongerSignal(existing, s);
        const sources = Array.from(new Set([existing.source, s.source])).join(", ");
        byKey.set(s.key, { ...winner, source: sources });
      }
    }
  }
  return Array.from(byKey.values());
}
