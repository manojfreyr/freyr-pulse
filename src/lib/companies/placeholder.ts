import type { Company } from "@/lib/types";
import { COMPANIES } from "@/lib/mock/companies";
import { src } from "@/lib/mock/sources";

/**
 * Pure helpers for universal company discovery. No persistence here — these are
 * safe to use on the server (API routes) and the client. Persistence happens via
 * the data layer / API.
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

function looksLikeUrl(input: string): boolean {
  return /\.[a-z]{2,}/i.test(input) || input.includes("http");
}

function titleCase(input: string): string {
  return input.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

/**
 * Creates a partial placeholder profile from a name or website. Everything is
 * explicitly Unknown/Inferred — nothing is presented as fact. Live connectors
 * enrich this profile in a later phase. `takenIds` lets a caller avoid id
 * collisions with already-stored companies.
 */
export function createPlaceholderCompany(input: string, takenIds: Iterable<string> = []): Company {
  const trimmed = input.trim();
  const isUrl = looksLikeUrl(trimmed);
  const website = isUrl
    ? trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed.replace(/^www\./, "")}`
    : "";
  const baseName = isUrl ? titleCase(slugify(trimmed)) : titleCase(trimmed);

  let id = slugify(baseName);
  const taken = new Set<string>([...COMPANIES.map((c) => c.id), ...takenIds]);
  if (taken.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 5)}`;

  const monogram = baseName.replace(/[^A-Za-z]/g, "").slice(0, 2) || "?";
  const unknownStr = {
    value: "Unknown",
    confidence: "Unknown" as const,
    sources: [src("User-created placeholder", "Placeholder")],
  };

  return {
    id,
    name: baseName,
    website: website || "Unknown",
    logoMonogram: monogram.charAt(0).toUpperCase() + monogram.slice(1, 2).toLowerCase(),
    aliases: [trimmed.toLowerCase(), id],
    origin: "user",
    isPlaceholder: true,
    snapshot: {
      description:
        "Placeholder profile created from a name/website. No live data has been gathered yet — live connectors will enrich this.",
      headquarters: { city: "Unknown", country: "Unknown", region: "North America", isHeadquarters: true },
      globalLocations: [],
      contactPlaceholder: { phone: "Unknown", email: "Unknown" },
      publicStatus: "Private",
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
