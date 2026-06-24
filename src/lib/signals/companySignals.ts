import type { Company, CompanySignal, ConfidenceRating, SignalCategory, SignalSourceType, SourceCitation } from "@/lib/types";
import { CONFIDENCE_RANK, bumpConfidence, distinctSources } from "@/lib/signals/sourceTrust";

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

export type { SignalCategory, CompanySignal } from "@/lib/types";

/** Keeps the higher-confidence signal when two share a key. */
function strongerSignal(a: CompanySignal, b: CompanySignal): CompanySignal {
  return CONFIDENCE_RANK[b.confidence] > CONFIDENCE_RANK[a.confidence] ? b : a;
}

/** Default machine source type per signal category. */
const CATEGORY_SOURCE: Record<SignalCategory, SignalSourceType> = {
  "therapeutic-area": "profile",
  segment: "profile",
  size: "profile",
  footprint: "profile",
  product: "product",
  market: "product",
  trigger: "news",
  "pain-point": "analysis",
  derived: "derived",
};

function dedupeCitations(citations: SourceCitation[]): SourceCitation[] {
  const seen = new Set<string>();
  const out: SourceCitation[] = [];
  for (const c of citations) {
    const k = `${c.sourceType ?? ""}|${c.url}|${c.label}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(c);
    }
  }
  return out;
}

/** Merge two same-key signals from within one company: stronger confidence wins,
 *  but citations from both are unioned (so provenance isn't lost). */
function mergeDerived(a: CompanySignal, b: CompanySignal): CompanySignal {
  const winner = strongerSignal(a, b);
  const citations = dedupeCitations([...(a.citations ?? []), ...(b.citations ?? [])]);
  return citations.length ? { ...winner, citations } : winner;
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
    opts?: { label?: string; sourceType?: SignalSourceType; citations?: SourceCitation[]; observedAt?: string },
  ) => {
    if (!raw) return;
    const key = raw.toLowerCase().trim();
    if (!key) return;
    const signal: CompanySignal = {
      key,
      label: opts?.label ?? raw,
      category,
      confidence,
      source,
      sourceType: opts?.sourceType ?? CATEGORY_SOURCE[category],
      ...(opts?.citations?.length ? { citations: opts.citations } : {}),
      ...(opts?.observedAt ? { observedAt: opts.observedAt } : {}),
    };
    const existing = byKey.get(key);
    byKey.set(key, existing ? mergeDerived(existing, signal) : signal);
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
    const citation: SourceCitation | undefined = t.source
      ? { ...t.source, sourceType: t.source.sourceType ?? "news" }
      : undefined;
    const opts = citation ? { sourceType: "news" as const, citations: [citation] } : { sourceType: "news" as const };
    add(t.type, "trigger", t.confidence, src, opts);
    const h = t.headline.toLowerCase();
    ["biosimilar", "acquisition", "oncology", "cell therapy", "mdr", "ivdr", "digital", "vendor", "device", "launch", "expansion", "integration"].forEach((k) => {
      if (h.includes(k)) add(k, "trigger", t.confidence, src, opts);
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

  const profileSignals = Array.from(byKey.values());

  // Fold in live-research signals (Phase 2A.0c). mergeSignals dedupes by key,
  // keeps the stronger confidence, unions citations, and bumps confidence when
  // independent sources corroborate. For un-enriched companies this is a no-op,
  // so existing behavior is unchanged.
  const live = company.enrichment?.signals ?? [];
  return live.length ? mergeSignals(profileSignals, live) : profileSignals;
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
        continue;
      }
      const winner = strongerSignal(existing, s);
      const citations = dedupeCitations([...(existing.citations ?? []), ...(s.citations ?? [])]);
      const sources = Array.from(new Set([existing.source, s.source])).filter(Boolean).join(", ");
      // Corroboration: ≥2 independent source types agreeing on the same key
      // bumps confidence one level (capped at Verified).
      const independentSources = new Set<SignalSourceType>();
      [existing, s].forEach((sig) => {
        if (sig.sourceType) independentSources.add(sig.sourceType);
        distinctSources(sig.citations ?? []).forEach((st) => independentSources.add(st));
      });
      const confidence =
        independentSources.size >= 2 ? bumpConfidence(winner.confidence, 1) : winner.confidence;

      byKey.set(s.key, {
        ...winner,
        confidence,
        source: sources || winner.source,
        ...(citations.length ? { citations } : {}),
      });
    }
  }
  return Array.from(byKey.values());
}
