import type { ConfidenceRating } from "@/lib/types";
import { CONFIDENCE_RANK } from "@/lib/signals/sourceTrust";

/**
 * Phase 2B evidence-weighting primitives — pure + deterministic, no LLM.
 * All tunable constants live here so calibration is a one-file change.
 */

/** Base points by match type (preserves Phase-1 relative ordering as the floor). */
export const BASE_WEIGHTS = {
  signal: 12,
  trigger: 10,
  keyword: 5,
  painpoint: 30, // explicit human-noted company→service link
} as const;

export type MatchType = keyof typeof BASE_WEIGHTS;

/** Confidence → multiplier. Unknown/placeholder signals barely move the score. */
export const CONFIDENCE_MULT: Record<ConfidenceRating, number> = {
  Verified: 1.0,
  Likely: 0.75,
  Inferred: 0.45,
  Unknown: 0.15,
};

export function confidenceMultiplier(c: ConfidenceRating): number {
  return CONFIDENCE_MULT[c];
}

/**
 * Recency multiplier for time-sensitive signals. Signals without an observed
 * date (firmographics, therapeutic areas, segment) are timeless → 1.0.
 * Deterministic step function (each band is explainable in the "why").
 */
export function recencyMultiplier(observedAt?: string, now: Date = new Date()): number {
  if (!observedAt) return 1.0;
  const t = new Date(observedAt).getTime();
  if (Number.isNaN(t)) return 1.0;
  const months = (now.getTime() - t) / (30 * 24 * 3600 * 1000);
  if (months < 0) return 1.0; // future-dated (e.g. expected completion) treated as current
  if (months <= 6) return 1.0;
  if (months <= 12) return 0.85;
  if (months <= 18) return 0.6;
  if (months <= 24) return 0.4;
  return 0.2;
}

/** Small, capped bonus when a service is supported by independent sources. */
export function corroborationBonus(distinctSourceCount: number): number {
  if (distinctSourceCount >= 3) return 1.15;
  if (distinctSourceCount === 2) return 1.1;
  return 1.0;
}

export type EvidenceStrength = "Strong" | "Moderate" | "Limited";

/**
 * Deterministic strength band shown to users instead of a raw score.
 * Strong: a Verified item, or ≥2 sources with a recent item.
 * Moderate: any Likely item. Limited: only Inferred/Unknown.
 */
export function evidenceStrength(
  items: { confidence: ConfidenceRating; recencyFactor: number }[],
  distinctSourceCount: number,
): EvidenceStrength {
  if (!items.length) return "Limited";
  const best = items.reduce((m, i) => Math.max(m, CONFIDENCE_RANK[i.confidence]), 0);
  const hasRecent = items.some((i) => i.recencyFactor >= 0.85);
  if (best >= CONFIDENCE_RANK.Verified) return "Strong";
  if (distinctSourceCount >= 2 && hasRecent && best >= CONFIDENCE_RANK.Likely) return "Strong";
  if (best >= CONFIDENCE_RANK.Likely) return "Moderate";
  return "Limited";
}
