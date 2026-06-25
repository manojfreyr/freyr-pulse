import type { Company } from "@/lib/types";
import { COMPANIES } from "@/lib/mock/companies";
import { src } from "@/lib/mock/sources";
import { resolveIdentity, type ResolvedIdentity } from "@/lib/discovery/resolve";

/**
 * Pure helpers for universal company discovery. No persistence here — safe on
 * both server (API routes) and client. Persistence happens via the data layer.
 */
export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "")
      .replace(/\.[a-z]{2,}$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "company"
  );
}

/**
 * Builds a partial placeholder profile from a resolved identity. Everything is
 * explicitly Unknown/Inferred — nothing is presented as fact. Live connectors
 * enrich + backfill identity afterwards. `takenIds` avoids id collisions.
 */
export function buildCompanyFromIdentity(identity: ResolvedIdentity, takenIds: Iterable<string> = []): Company {
  const baseName = identity.name || "Company";
  let id = slugify(identity.website ? identity.website : baseName);
  const taken = new Set<string>([...COMPANIES.map((c) => c.id), ...takenIds]);
  if (taken.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 5)}`;

  const monogram = baseName.replace(/[^A-Za-z]/g, "").slice(0, 2) || "?";
  const unknownStr = {
    value: "Unknown",
    confidence: "Unknown" as const,
    sources: [src("User-created placeholder", "Placeholder")],
  };
  const aliases = Array.from(new Set([...identity.aliases, id].filter(Boolean)));

  return {
    id,
    name: baseName,
    website: identity.website || "Unknown",
    logoMonogram: monogram.charAt(0).toUpperCase() + monogram.slice(1, 2).toLowerCase(),
    aliases,
    origin: "user",
    isPlaceholder: true,
    snapshot: {
      description:
        "Placeholder profile created from a name/website. No live data has been gathered yet — live connectors will enrich and backfill this.",
      headquarters: { city: "Unknown", country: "Unknown", region: "North America", isHeadquarters: true },
      globalLocations: [],
      contactPlaceholder: { phone: "Unknown", email: "Unknown" },
      publicStatus: identity.ticker ? "Public" : "Private",
      ...(identity.ticker ? { stockTicker: identity.ticker } : {}),
      annualRevenueUSD: { ...unknownStr },
      employeeCount: { ...unknownStr },
      sizeCategory: "Emerging (<500)",
      industrySegment: "Life sciences (unconfirmed)",
      therapeuticFocus: [],
      lastUpdated: "Not yet researched",
    },
    opportunity: {
      score: 0,
      level: "Low",
      verdict: "Insufficient data to assess. Run live research to generate an opportunity verdict.",
      reasons: [
        "No live data gathered yet for this company",
        "Profile created as a placeholder for future enrichment",
      ],
      nextBestAction: "Enrich this profile with live sources, then re-score.",
      confidence: "Unknown",
      factors: [],
    },
    painPoints: [],
    products: [],
    therapeuticAreas: [],
    triggers: [],
    competitors: [],
    strategy: {
      bestEntryPoint: "Unknown — research needed",
      entryRationale: "No data yet.",
      firstConversationStrategy: "Gather basic firmographics and recent events before outreach.",
      landAndExpand: "To be determined after enrichment.",
      crossSell: [],
      objections: [],
      differentiation: "Freyr's regulatory-specialist focus and flexible managed services.",
      actionPlan: [
        { horizon: "30 days", action: "Enrich profile via live connectors." },
        { horizon: "60 days", action: "Validate signals and score the opportunity." },
        { horizon: "90 days", action: "Build a persona-targeted outreach plan." },
      ],
    },
    sources: [src("User-created placeholder", "Placeholder")],
  };
}

/** Convenience: resolve a raw name/URL/ticker and build a placeholder. */
export function createPlaceholderCompany(input: string, takenIds: Iterable<string> = []): Company {
  return buildCompanyFromIdentity(resolveIdentity(input), takenIds);
}
