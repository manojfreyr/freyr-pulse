import type { Company, SearchResult } from "@/lib/types";
import { COMPANIES, COMPANY_BY_ID } from "@/lib/mock/companies";
import { matchCompanies } from "@/lib/api/searchService";
import { src } from "@/lib/mock/sources";

/**
 * Universal company store. Phase 1 keeps the 5 demo companies as mock data but
 * also supports *user-created* companies (placeholder profiles) saved to
 * localStorage. The lookup order is demo → user, so the app already behaves like
 * the production design: check the database, load if found, otherwise allow
 * creating a new (partial) profile to enrich later via live connectors (Phase 2).
 */
const KEY = "freyrpulse.userCompanies.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function listUserCompanies(): Company[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Company[]) : [];
  } catch {
    return [];
  }
}

function persistUserCompanies(list: Company[]): void {
  if (!canUseStorage()) return;
  try { window.localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function allCompanies(): Company[] {
  return [...COMPANIES, ...listUserCompanies()];
}

export function getCompanyById(id: string): Company | null {
  if (COMPANY_BY_ID[id]) return COMPANY_BY_ID[id];
  return listUserCompanies().find((c) => c.id === id) ?? null;
}

export function isUserCompanySaved(id: string): boolean {
  return listUserCompanies().some((c) => c.id === id);
}

export function saveUserCompany(company: Company): Company[] {
  const list = listUserCompanies();
  const next = list.some((c) => c.id === company.id)
    ? list.map((c) => (c.id === company.id ? company : c))
    : [...list, company];
  persistUserCompanies(next);
  return next;
}

export function removeUserCompany(id: string): Company[] {
  const next = listUserCompanies().filter((c) => c.id !== id);
  persistUserCompanies(next);
  return next;
}

/** Search across demo + user companies. */
export function searchAll(query: string): SearchResult[] {
  return matchCompanies(query, allCompanies());
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\.[a-z]{2,}$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "company";
}

function looksLikeUrl(input: string): boolean {
  return /\.[a-z]{2,}/i.test(input) || input.includes("http");
}

function titleCase(input: string): string {
  return input.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

/**
 * Creates a partial placeholder profile from a name or website. Everything is
 * explicitly Unknown/Inferred — nothing is presented as fact. In Phase 2 the
 * live connectors enrich this profile.
 */
export function createPlaceholderCompany(input: string): Company {
  const trimmed = input.trim();
  const isUrl = looksLikeUrl(trimmed);
  const website = isUrl
    ? (trimmed.startsWith("http") ? trimmed : `https://${trimmed.replace(/^www\./, "")}`)
    : "";
  const baseName = isUrl ? titleCase(slugify(trimmed)) : titleCase(trimmed);

  // Ensure a unique id (avoid colliding with demo ids or existing user ids).
  let id = slugify(baseName);
  const taken = new Set([...COMPANIES.map((c) => c.id), ...listUserCompanies().map((c) => c.id)]);
  if (taken.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 5)}`;

  const monogram = baseName.replace(/[^A-Za-z]/g, "").slice(0, 2) || "?";
  const unknownStr = { value: "Unknown", confidence: "Unknown" as const, sources: [src("User-created placeholder", "Placeholder")] };

  return {
    id,
    name: baseName,
    website: website || "Unknown",
    logoMonogram: monogram.charAt(0).toUpperCase() + (monogram.slice(1, 2).toLowerCase()),
    aliases: [trimmed.toLowerCase(), id],
    origin: "user",
    isPlaceholder: true,
    snapshot: {
      description: "Placeholder profile created from a name/website. No live data has been gathered yet — Phase 2 connectors will enrich this.",
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
      verdict: "Insufficient data to assess. Run live research (Phase 2) to generate an opportunity verdict.",
      reasons: [
        "No live data gathered yet for this company",
        "Profile created as a placeholder for future enrichment",
      ],
      nextBestAction: "Enrich this profile with live sources in Phase 2, then re-score.",
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
        { horizon: "30 days", action: "Enrich profile via live connectors (Phase 2)." },
        { horizon: "60 days", action: "Validate signals and score the opportunity." },
        { horizon: "90 days", action: "Build a persona-targeted outreach plan." },
      ],
    },
    sources: [src("User-created placeholder", "Placeholder")],
  };
}
