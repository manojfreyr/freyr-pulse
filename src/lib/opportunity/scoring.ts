import type { TriggerType } from "@/lib/types";

/**
 * Phase 2D tunable constants for account-level Opportunity Intelligence.
 * All weights/thresholds live here so calibration is a one-file change
 * (mirrors generators/scoring.ts for the service level).
 */

/** Composite factor weights (must sum to 1.0). */
export const FACTOR_WEIGHTS = {
  fit: 0.3,
  timing: 0.25,
  richness: 0.15,
  maturity: 0.15,
  reach: 0.1,
  readiness: 0.05,
} as const;

export type FactorKey = keyof typeof FACTOR_WEIGHTS;

export const FACTOR_LABEL: Record<FactorKey, string> = {
  fit: "Service fit",
  timing: "Timing & triggers",
  richness: "Signal richness",
  maturity: "Maturity alignment",
  reach: "Reach & scale",
  readiness: "Engagement readiness",
};

/** Score → Tier thresholds (inclusive lower bounds). */
export const TIER_THRESHOLDS = { A: 70, B: 45 } as const;
export type Tier = "Tier A" | "Tier B" | "Tier C";

export function tierForScore(score: number): Tier {
  if (score >= TIER_THRESHOLDS.A) return "Tier A";
  if (score >= TIER_THRESHOLDS.B) return "Tier B";
  return "Tier C";
}

/** Computed model is preferred above this evidence bar; below it we fall back to curated. */
export const EVIDENCE_MIN_SIGNALS = 3;

/** Impact weight (0–1) by curated trigger type. */
export const TRIGGER_IMPACT: Record<TriggerType, number> = {
  "Recall": 0.95,
  "Warning Letter": 0.9,
  "Regulatory Approval": 0.85,
  "Product Launch": 0.8,
  "M&A": 0.7,
  "Vendor Consolidation": 0.6,
  "Geographic Expansion": 0.6,
  "Clinical Update": 0.6,
  "Partnership": 0.5,
  "Restructuring": 0.5,
  "Divestment": 0.5,
  "Digital Transformation": 0.45,
  "Hiring": 0.3,
};

/** Impact weight (0–1) by connector-signal trigger key (substring match). */
export const SIGNAL_TRIGGER_IMPACT: { pat: string; impact: number }[] = [
  { pat: "recall", impact: 0.95 },
  { pat: "compliance pressure", impact: 0.92 },
  { pat: "upcoming submission", impact: 0.9 },
  { pat: "post-approval", impact: 0.85 },
  { pat: "product launch", impact: 0.85 },
  { pat: "device launch", impact: 0.8 },
  { pat: "late-stage program", impact: 0.65 },
  { pat: "trial start", impact: 0.55 },
];

export function signalTriggerImpact(key: string): number {
  const k = key.toLowerCase();
  for (const r of SIGNAL_TRIGGER_IMPACT) if (k.includes(r.pat)) return r.impact;
  return 0.5;
}

/** Maturity-stage → alignment value (0–1) for the maturity factor. */
export const MATURITY_VALUE: Record<string, number> = {
  "Remediation": 0.9,
  "Pre-submission": 0.95,
  "Commercial": 0.85,
  "Post-market": 0.8,
  "Late clinical": 0.7,
  "Early clinical": 0.5,
  "Pre-clinical": 0.3,
  "Unknown": 0.2,
};
