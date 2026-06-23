/**
 * Freyr Sales Intelligence Platform — Core Data Models (Phase 1)
 * --------------------------------------------------------------
 * Every model the platform reasons about lives here. These types are the
 * contract between the mock data layer, the generators, and the UI. When live
 * data sources are added in later phases, the API layer (src/lib/api) maps
 * external responses INTO these same types, so the UI never changes.
 *
 * Design rule: nothing is presented as fact without a confidence rating and a
 * source. That principle is encoded in the types (see `Sourced<T>` and
 * `ConfidenceRating`).
 */

/* ------------------------------------------------------------------ *
 * Confidence & sourcing — the trust spine of the whole product
 * ------------------------------------------------------------------ */

export type ConfidenceRating = "Verified" | "Likely" | "Inferred" | "Unknown";

export interface SourceCitation {
  /** Human label, e.g. "FY2024 Annual Report (10-K)". */
  label: string;
  /** Source URL. In Phase 1 this is a placeholder. */
  url: string;
  /** When the underlying data was retrieved. Phase 1: placeholder. */
  dateRetrieved: string;
  /** What kind of source this is — used for the Sources Center grouping. */
  type:
    | "Annual Report"
    | "Press Release"
    | "Regulatory Filing"
    | "News"
    | "Company Website"
    | "Industry Database"
    | "Inferred Analysis"
    | "Placeholder";
}

/** Wraps any claim with its confidence level and supporting sources. */
export interface Sourced<T> {
  value: T;
  confidence: ConfidenceRating;
  sources: SourceCitation[];
}

/* ------------------------------------------------------------------ *
 * Geography & firmographics
 * ------------------------------------------------------------------ */

export interface Location {
  city: string;
  country: string;
  region: "North America" | "Europe" | "Asia Pacific" | "Latin America" | "Middle East & Africa";
  isHeadquarters?: boolean;
}

export type CompanySizeCategory =
  | "Emerging (<500)"
  | "Mid (500–5k)"
  | "Large (5k–50k)"
  | "Enterprise (50k+)";

export type PublicStatus = "Public" | "Private" | "Subsidiary";

/* ------------------------------------------------------------------ *
 * Products, pipeline & therapeutic areas
 * ------------------------------------------------------------------ */

export type ProductLifecycle =
  | "Pipeline"
  | "Filed"
  | "Launched"
  | "Growth"
  | "Mature"
  | "Loss of Exclusivity";

export interface Product {
  name: string;
  category: string; // e.g. "Biologic", "Small molecule", "mRNA vaccine", "Implantable device"
  therapeuticArea: string;
  lifecycle: ProductLifecycle;
  approvedMarkets: string[];
  /** Why this product creates regulatory work Freyr could support. */
  regulatoryImplication: string;
  confidence: ConfidenceRating;
}

export interface TherapeuticArea {
  name: string;
  emphasis: "Core" | "Growth" | "Emerging";
  note: string;
}

/* ------------------------------------------------------------------ *
 * Business triggers (sales signals)
 * ------------------------------------------------------------------ */

export type TriggerType =
  | "M&A"
  | "Divestment"
  | "Partnership"
  | "Product Launch"
  | "Regulatory Approval"
  | "Warning Letter"
  | "Recall"
  | "Clinical Update"
  | "Geographic Expansion"
  | "Restructuring"
  | "Digital Transformation"
  | "Hiring"
  | "Vendor Consolidation";

export interface BusinessTrigger {
  id: string;
  date: string; // ISO-ish display date
  type: TriggerType;
  headline: string;
  whyItMatters: string;
  freyrOpportunity: string;
  confidence: ConfidenceRating;
  source: SourceCitation;
}

/* ------------------------------------------------------------------ *
 * Freyr services & how they map to an account
 * ------------------------------------------------------------------ */

export type ServiceCategory =
  | "Regulatory Affairs"
  | "Regulatory Strategy"
  | "Regulatory Operations"
  | "Submissions"
  | "Publishing"
  | "Labeling"
  | "Artwork"
  | "Regulatory Intelligence"
  | "RIM"
  | "Medical Writing"
  | "Pharmacovigilance"
  | "Medical Information"
  | "Market Access"
  | "Quality & Compliance"
  | "GxP Audits"
  | "CSV / CSA"
  | "SOP Writing & Review"
  | "QMS Support"
  | "Medical Devices"
  | "Combination Products"
  | "Local Regulatory Affairs"
  | "Product Registration"
  | "Technology Platforms"
  | "AI-enabled Regulatory Solutions"
  | "VMO / Managed Services";

/** A Freyr service in the catalogue (company-independent, now fully editable). */
export interface FreyrService {
  id: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  /** Higher-level grouping, e.g. "Regulatory", "Quality & Compliance", "Safety", "Technology", "Commercial". */
  serviceLine: string;
  description: string;
  /** Personas most likely to own the budget / decision for this service. */
  targetPersonas: PersonaId[];
  painPointsSolved: string[];
  buyingTriggers: TriggerType[];
  keywords: string[];
  /** Related service ids (cross-sell paths). */
  relatedServices: string[];
  /** Free-text company signals that indicate fit (TA names, "global", "MDR", sizes…). */
  relevantCompanySignals: string[];
  exampleOpeningMessage: string;
  differentiationPoints: string[];
  /** Confidence rules / placeholders for future scoring logic. */
  confidenceRules: string[];
  activeStatus: boolean;
  lastUpdated: string;
}

/**
 * ──────────────────────────────────────────────────────────────────────────
 * SERVICE RECOMMENDATION FLOW (single source of truth = the Service Catalog)
 * ──────────────────────────────────────────────────────────────────────────
 * Company signals + pain points + triggers
 *   → Service Catalog matcher (matchServices, src/lib/generators/serviceMatch.ts)
 *     → Ranked service recommendations (MatchedService[])
 *       → Hero "Top services to lead with"
 *       → Persona talking points
 *       → Outreach content
 *       → Account strategy
 *
 * Recommendations are NEVER stored on the company. They are derived at runtime
 * from the live, editable catalogue, so deactivating/editing a service or
 * changing its keywords immediately changes every downstream surface.
 *
 * The legacy per-company `serviceRecommendations` array and the curated
 * `opportunity.topServiceIds` list were removed for exactly this reason.
 * `MatchedService` (the matcher's output type) lives in serviceMatch.ts.
 */

/* ------------------------------------------------------------------ *
 * Pain points
 * ------------------------------------------------------------------ */

export interface PainPoint {
  id: string;
  title: string;
  whyItMayExist: string;
  businessImpact: string;
  /** Optional FK -> FreyrService.id. A *signal* that boosts matching when
   *  present; matching works fine without it. */
  relevantServiceId?: string;
  conversationAngle: string;
  confidence: ConfidenceRating;
}

/* ------------------------------------------------------------------ *
 * Competitive landscape
 * ------------------------------------------------------------------ */

export interface Competitor {
  name: string;
  possibleServiceArea: string;
  strength: string;
  freyrDifferentiation: string;
  confidence: ConfidenceRating;
}

/* ------------------------------------------------------------------ *
 * Opportunity scoring
 * ------------------------------------------------------------------ */

export type OpportunityLevel = "High" | "Medium" | "Low";

export type ScoreFactorKey =
  | "companySize"
  | "globalFootprint"
  | "portfolioComplexity"
  | "regulatoryBurden"
  | "businessTriggers"
  | "outsourcingLikelihood"
  | "freyrServiceFit"
  | "potentialAccountValue";

export interface OpportunityScoreFactor {
  key: ScoreFactorKey;
  label: string;
  score: number; // 0–100
  weight: number; // 0–1, contribution to the composite
  explanation: string;
  confidence: ConfidenceRating;
}

/** The headline "Why Should Freyr Care?" verdict. */
export interface OpportunityRecommendation {
  score: number; // 1–100 composite
  level: OpportunityLevel;
  verdict: string; // one-line plain-English summary
  reasons: string[]; // 3–5 reasons to pursue
  nextBestAction: string;
  confidence: ConfidenceRating;
  factors: OpportunityScoreFactor[];
}

/* ------------------------------------------------------------------ *
 * Personas & persona-specific guidance
 * ------------------------------------------------------------------ */

export type PersonaId =
  | "vp-regulatory-affairs"
  | "director-regulatory-operations"
  | "head-of-labeling"
  | "head-of-quality"
  | "head-of-pharmacovigilance"
  | "procurement-leader"
  | "cio-digital"
  | "ceo-business-unit";

/** Persona definition — company-independent guidance for a role. */
export interface Persona {
  id: PersonaId;
  title: string;
  caresAbout: string[];
  kpis: string[];
  painPoints: string[];
  freyrPositioning: string;
  discoveryQuestions: string[];
  openingLineTemplate: string; // may contain {company} / {trigger} tokens
  objections: PersonaObjection[];
  recommendedNextStep: string;
  /** Service categories this persona usually owns — used to tailor talking points. */
  ownsServiceCategories: ServiceCategory[];
}

export interface PersonaObjection {
  objection: string;
  response: string;
}

/** Fully-resolved, company + persona specific talking points (generated). */
export interface TalkingPoint {
  personaId: PersonaId;
  companyId: string;
  caresAbout: string[];
  kpis: string[];
  painPoints: string[];
  freyrPositioning: string;
  discoveryQuestions: string[];
  openingLine: string;
  objections: PersonaObjection[];
  recommendedNextStep: string;
}

/* ------------------------------------------------------------------ *
 * Outreach content (generated)
 * ------------------------------------------------------------------ */

export type OutreachKind =
  | "cold-email"
  | "linkedin-message"
  | "call-opening"
  | "follow-up-email"
  | "meeting-brief"
  | "objection-handling";

export interface OutreachMessage {
  kind: OutreachKind;
  label: string;
  subject?: string; // emails only
  body: string;
}

/* ------------------------------------------------------------------ *
 * Account strategy (generated)
 * ------------------------------------------------------------------ */

export interface ActionPlanItem {
  horizon: "30 days" | "60 days" | "90 days";
  action: string;
}

export interface AccountStrategy {
  bestEntryPoint: string; // persona / function to enter through
  entryRationale: string;
  firstConversationStrategy: string;
  landAndExpand: string;
  crossSell: string[];
  objections: string[];
  differentiation: string;
  actionPlan: ActionPlanItem[];
}

/* ------------------------------------------------------------------ *
 * Company — the aggregate root
 * ------------------------------------------------------------------ */

export interface CompanySnapshot {
  description: string;
  headquarters: Location;
  globalLocations: Location[];
  contactPlaceholder: { phone: string; email: string };
  publicStatus: PublicStatus;
  stockTicker?: string;
  annualRevenueUSD: Sourced<string>; // display string, e.g. "$58.5B"
  employeeCount: Sourced<string>;
  sizeCategory: CompanySizeCategory;
  industrySegment: string;
  therapeuticFocus: string[];
  lastUpdated: string;
}

export interface Company {
  id: string;
  name: string;
  website: string;
  logoMonogram: string; // 1–2 letters for the logo placeholder
  aliases: string[]; // helps search match tickers / nicknames
  /** "demo" = preloaded mock; "user" = created via universal discovery. */
  origin?: "demo" | "user";
  /** True for partial profiles created before live research (Phase 2). */
  isPlaceholder?: boolean;
  snapshot: CompanySnapshot;
  opportunity: OpportunityRecommendation;
  painPoints: PainPoint[];
  products: Product[];
  therapeuticAreas: TherapeuticArea[];
  triggers: BusinessTrigger[];
  competitors: Competitor[];
  strategy: AccountStrategy;
  /** Cross-cutting sources surfaced in the Sources Center. */
  sources: SourceCitation[];
}

/* ------------------------------------------------------------------ *
 * Saved accounts (user state, persisted to localStorage in Phase 1)
 * ------------------------------------------------------------------ */

export type RelationshipStatus =
  | "Prospect"
  | "Existing Client"
  | "Former Client"
  | "Dormant"
  | "Unknown";

export type PriorityLevel = "High" | "Medium" | "Low";

export type MsaStatus = "Active" | "In negotiation" | "None" | "Unknown";

export type SatisfactionLevel = "High" | "Medium" | "Low" | "Unknown";

export interface UserNote {
  id: string;
  body: string;
  createdAt: string; // ISO
}

export interface SavedAccount {
  companyId: string;
  companyName: string;
  accountOwner: string;
  priority: PriorityLevel;
  opportunityScore: number;
  relationshipStatus: RelationshipStatus;
  notes: UserNote[];
  lastRefreshed: string; // ISO
  tags: string[];

  // MSA / preferred-vendor block (manual placeholders in Phase 1)
  msaStatus: MsaStatus;
  preferredVendor: boolean;
  currentFreyrServices: string[];
  satisfaction: SatisfactionLevel;
  lastInteraction: string; // free text / ISO
  nextAction: string;
}

/* ------------------------------------------------------------------ *
 * Search
 * ------------------------------------------------------------------ */

export type SearchFieldKind =
  | "company-name"
  | "website"
  // Phase 2+ search dimensions — declared now so the UI can show them as
  // "coming soon" and the search service can be extended without UI churn.
  | "linkedin-url"
  | "stock-ticker"
  | "contact-name"
  | "email-domain"
  | "product-name"
  | "therapeutic-area"
  | "competitor"
  | "service-provider";

export interface SearchResult {
  company: Company;
  matchedOn: SearchFieldKind;
  matchedText: string;
}
