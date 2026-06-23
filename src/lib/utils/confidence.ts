import type { ConfidenceRating, OpportunityLevel } from "@/lib/types";

export function confClass(c: ConfidenceRating): string {
  switch (c) {
    case "Verified": return "conf conf-verified";
    case "Likely": return "conf conf-likely";
    case "Inferred": return "conf conf-inferred";
    case "Unknown": return "conf conf-unknown";
  }
}

export function levelClass(level: OpportunityLevel): string {
  switch (level) {
    case "High": return "level level-high";
    case "Medium": return "level level-medium";
    case "Low": return "level level-low";
  }
}

/** Map a 0–100 score to an opportunity level (used if a level isn't supplied). */
export function scoreToLevel(score: number): OpportunityLevel {
  if (score >= 80) return "High";
  if (score >= 55) return "Medium";
  return "Low";
}

export function confidenceBlurb(c: ConfidenceRating): string {
  switch (c) {
    case "Verified": return "Confirmed against a primary source.";
    case "Likely": return "Strongly supported, not independently confirmed.";
    case "Inferred": return "Reasoned from available signals — treat as a hypothesis.";
    case "Unknown": return "Insufficient evidence — validate before relying on it.";
  }
}
