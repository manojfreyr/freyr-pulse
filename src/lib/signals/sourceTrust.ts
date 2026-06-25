import type { ConfidenceRating, SignalSourceType, SourceCitation } from "@/lib/types";

/**
 * Confidence trust model (Phase 2A.0b plumbing).
 *
 * Maps a source to a *baseline* confidence, and provides corroboration + recency
 * helpers. Connectors (later phases) call confidenceFromCitations() to set a
 * signal's confidence from its provenance; mergeSignals() uses these to bump
 * confidence when independent sources agree. Defined and unit-testable now; not
 * wired into the seed-derived signals, so current confidences are unchanged.
 */

export const CONFIDENCE_RANK: Record<ConfidenceRating, number> = {
  Unknown: 0,
  Inferred: 1,
  Likely: 2,
  Verified: 3,
};

const RANK_TO_CONFIDENCE: ConfidenceRating[] = ["Unknown", "Inferred", "Likely", "Verified"];

/** Baseline confidence by source. Structured regulatory data is the strongest. */
export const SOURCE_TRUST: Record<SignalSourceType, ConfidenceRating> = {
  sec: "Verified", // structured XBRL / official filings
  fda: "Verified",
  ema: "Verified",
  clinicaltrials: "Likely",
  news: "Likely", // reputable outlet / first-party press release
  website: "Likely", // official company site
  crm: "Likely",
  msa: "Likely",
  "freyr-history": "Likely",
  profile: "Likely", // seeded firmographic profile
  product: "Likely",
  analysis: "Inferred",
  derived: "Inferred",
  seed: "Likely",
  user: "Unknown",
  placeholder: "Unknown",
};

export function rankToConfidence(rank: number): ConfidenceRating {
  const clamped = Math.max(0, Math.min(RANK_TO_CONFIDENCE.length - 1, rank));
  return RANK_TO_CONFIDENCE[clamped];
}

export function bumpConfidence(level: ConfidenceRating, steps = 1): ConfidenceRating {
  return rankToConfidence(CONFIDENCE_RANK[level] + steps);
}

export function strongerConfidence(a: ConfidenceRating, b: ConfidenceRating): ConfidenceRating {
  return CONFIDENCE_RANK[b] > CONFIDENCE_RANK[a] ? b : a;
}

export function trustOf(sourceType: SignalSourceType | undefined): ConfidenceRating {
  return sourceType ? SOURCE_TRUST[sourceType] : "Inferred";
}

/** Distinct, known source types among a set of citations. */
export function distinctSources(citations: SourceCitation[]): SignalSourceType[] {
  const seen = new Set<SignalSourceType>();
  for (const c of citations) if (c.sourceType) seen.add(c.sourceType);
  return Array.from(seen);
}

/**
 * Confidence for a claim given its citations: the strongest single-source
 * baseline, bumped one level when ≥2 *independent* source types corroborate it.
 * Caps at Verified.
 */
export function confidenceFromCitations(citations: SourceCitation[]): ConfidenceRating {
  if (!citations.length) return "Unknown";
  const sources = distinctSources(citations);
  if (sources.length === 0) return "Inferred";
  let best: ConfidenceRating = "Unknown";
  for (const s of sources) best = strongerConfidence(best, SOURCE_TRUST[s]);
  return sources.length >= 2 ? bumpConfidence(best, 1) : best;
}
