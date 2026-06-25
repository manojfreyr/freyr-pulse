import type { CustomerSegment, Market, ServiceType } from "./types";

/**
 * Code-resident seed defaults (V2.0-A). Used directly by the in-memory repos and
 * to seed an empty Supabase table (seed-when-empty, matching service_catalog), so
 * Supabase and fallback modes return identical defaults. All configurable later.
 */

export const SERVICE_TYPES_SEED: ServiceType[] = [
  { id: "regulatory-affairs", name: "Regulatory Affairs", status: "active", displayOrder: 1, description: "Regulatory strategy, submissions, and lifecycle management." },
  { id: "regulatory-operations", name: "Regulatory Operations", status: "active", displayOrder: 2, description: "Publishing, submission management, and regulatory information management." },
  { id: "technology", name: "Technology", status: "active", displayOrder: 3, description: "Regulatory/quality software platforms and digital solutions." },
  { id: "quality", name: "Quality", status: "active", displayOrder: 4, description: "Quality management, compliance, and audits." },
  { id: "pharmacovigilance", name: "Pharmacovigilance", status: "active", displayOrder: 5, description: "Drug safety and post-market surveillance." },
  { id: "medical-writing", name: "Medical Writing", status: "active", displayOrder: 6, description: "Regulatory, clinical, and scientific writing." },
  { id: "consulting", name: "Consulting", status: "active", displayOrder: 7, description: "Strategic regulatory and compliance consulting." },
  { id: "staffing", name: "Staffing", status: "active", displayOrder: 8, description: "Functional service provision and staff augmentation." },
];

export const SEGMENTS_SEED: CustomerSegment[] = [
  { id: "large-pharma", name: "Large Pharma", status: "active", displayOrder: 1, description: "Global, fully-integrated pharmaceutical companies with broad marketed portfolios.", classificationRules: [] },
  { id: "mid-pharma", name: "Mid Pharma", status: "active", displayOrder: 2, description: "Mid-size pharmaceutical companies with marketed products and active pipelines.", classificationRules: [] },
  { id: "emerging-pharma", name: "Emerging Pharma", status: "active", displayOrder: 3, description: "Smaller or newly-commercial pharmaceutical companies scaling their first products.", classificationRules: [] },
  { id: "biotech", name: "Biotech / Biopharma", status: "active", displayOrder: 4, description: "Research- and pipeline-driven biotechnology / biopharmaceutical developers.", classificationRules: [] },
  { id: "cro", name: "CRO", status: "active", displayOrder: 5, description: "Contract Research Organizations providing clinical/development services.", classificationRules: [] },
  { id: "cdmo", name: "CDMO", status: "active", displayOrder: 6, description: "Contract Development & Manufacturing Organizations.", classificationRules: [] },
  { id: "medical-device", name: "Medical Device", status: "active", displayOrder: 7, description: "Medical device manufacturers (510(k)/PMA/CE-marked products).", classificationRules: [] },
  { id: "diagnostics", name: "Diagnostics", status: "active", displayOrder: 8, description: "Diagnostics and IVD companies.", classificationRules: [] },
  { id: "generics-biosimilars", name: "Generics / Biosimilars", status: "active", displayOrder: 9, description: "Generic and biosimilar developers and manufacturers.", classificationRules: [] },
  { id: "consumer-health", name: "Consumer Health", status: "active", displayOrder: 10, description: "Consumer health, OTC, and wellness companies.", classificationRules: [] },
];

export const MARKETS_SEED: Market[] = [
  { id: "us", name: "United States", region: "Americas", regulatoryBody: "FDA", countryCode: "US", status: "active", displayOrder: 1, relevanceRules: [] },
  { id: "canada", name: "Canada", region: "Americas", regulatoryBody: "Health Canada", countryCode: "CA", status: "active", displayOrder: 2, relevanceRules: [] },
  { id: "eu", name: "European Union", region: "EMEA", regulatoryBody: "EMA", status: "active", displayOrder: 3, relevanceRules: [] },
  { id: "uk", name: "United Kingdom", region: "EMEA", regulatoryBody: "MHRA", countryCode: "GB", status: "active", displayOrder: 4, relevanceRules: [] },
  { id: "switzerland", name: "Switzerland", region: "EMEA", regulatoryBody: "Swissmedic", countryCode: "CH", status: "active", displayOrder: 5, relevanceRules: [] },
  { id: "india", name: "India", region: "APAC", regulatoryBody: "CDSCO", countryCode: "IN", status: "active", displayOrder: 6, relevanceRules: [] },
  { id: "japan", name: "Japan", region: "APAC", regulatoryBody: "PMDA", countryCode: "JP", status: "active", displayOrder: 7, relevanceRules: [] },
  { id: "australia", name: "Australia", region: "APAC", regulatoryBody: "TGA", countryCode: "AU", status: "active", displayOrder: 8, relevanceRules: [] },
];
