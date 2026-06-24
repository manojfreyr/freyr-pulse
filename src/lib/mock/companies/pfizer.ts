import type { Company } from "@/lib/types";
import { src } from "@/lib/mock/sources";

export const pfizer: Company = {
  id: "pfizer",
  name: "Pfizer Inc.",
  website: "https://www.pfizer.com",
  logoMonogram: "Pf",
  aliases: ["pfizer", "pfe", "pfizer inc", "pfizer.com"],

  snapshot: {
    description:
      "Global, research-driven biopharmaceutical company with one of the broadest portfolios in the industry, spanning vaccines, oncology, internal medicine, inflammation & immunology, and rare disease.",
    headquarters: { city: "New York", country: "United States", region: "North America", isHeadquarters: true },
    globalLocations: [
      { city: "New York", country: "United States", region: "North America", isHeadquarters: true },
      { city: "Sandwich", country: "United Kingdom", region: "Europe" },
      { city: "Freiburg", country: "Germany", region: "Europe" },
      { city: "Singapore", country: "Singapore", region: "Asia Pacific" },
      { city: "Mumbai", country: "India", region: "Asia Pacific" },
      { city: "São Paulo", country: "Brazil", region: "Latin America" },
    ],
    contactPlaceholder: { phone: "+1 (xxx) xxx-xxxx — placeholder", email: "contact@placeholder.com" },
    publicStatus: "Public",
    stockTicker: "NYSE: PFE",
    annualRevenueUSD: { value: "~$58–63B", confidence: "Likely", sources: [src("FY annual report (10-K)", "Annual Report")] },
    employeeCount: { value: "~80,000", confidence: "Likely", sources: [src("Company website — careers", "Company Website")] },
    sizeCategory: "Enterprise (50k+)",
    industrySegment: "Large-cap pharmaceutical",
    therapeuticFocus: ["Vaccines", "Oncology", "Internal Medicine", "Inflammation & Immunology", "Rare Disease"],
    lastUpdated: "Phase 1 — mock data",
  },

  opportunity: {
    score: 91,
    level: "High",
    verdict:
      "A flagship enterprise account: vast global portfolio, intense regulatory complexity, and active M&A make this a high-value, multi-service opportunity.",
    reasons: [
      "Very large, diverse global product portfolio across many therapeutic areas",
      "High regulatory complexity spanning drugs, vaccines, and combination products",
      "Active M&A and integration activity creating regulatory and quality workload",
      "Strong fit for labeling, regulatory operations, RIM, and managed services",
      "Scale that supports a strategic, multi-service relationship",
    ],
    nextBestAction:
      "Engage the VP Regulatory Affairs or Director Regulatory Operations with a regulatory operations and labeling efficiency conversation, anchored to recent acquisition integration.",
    confidence: "Inferred",
    factors: [
      { key: "companySize", label: "Company size", score: 98, weight: 0.15, explanation: "Enterprise-scale workforce and revenue imply substantial regulatory and quality operations.", confidence: "Likely" },
      { key: "globalFootprint", label: "Global footprint", score: 96, weight: 0.15, explanation: "Operations and registrations across virtually all major and emerging markets.", confidence: "Likely" },
      { key: "portfolioComplexity", label: "Portfolio complexity", score: 95, weight: 0.15, explanation: "Drugs, vaccines, and combination products across many therapeutic areas multiply labeling and submission work.", confidence: "Likely" },
      { key: "regulatoryBurden", label: "Regulatory burden", score: 94, weight: 0.15, explanation: "Continuous global submissions, label maintenance, and PV at very high volume.", confidence: "Inferred" },
      { key: "businessTriggers", label: "Recent business triggers", score: 88, weight: 0.12, explanation: "Acquisitions and pipeline launches create integration and capacity needs.", confidence: "Inferred" },
      { key: "outsourcingLikelihood", label: "Outsourcing likelihood", score: 82, weight: 0.10, explanation: "Large pharma routinely outsources regulatory operations, labeling, and PV at the margins.", confidence: "Inferred" },
      { key: "freyrServiceFit", label: "Fit with Freyr services", score: 90, weight: 0.10, explanation: "Needs map cleanly to Freyr's labeling, reg-ops, RIM, PV, and managed-services strengths.", confidence: "Inferred" },
      { key: "potentialAccountValue", label: "Potential account value", score: 95, weight: 0.08, explanation: "Scale supports a large, multi-year, multi-service relationship.", confidence: "Inferred" },
    ],
  },

  painPoints: [
    { id: "pf-pp-1", title: "Global labeling harmonisation", whyItMayExist: "A very large portfolio across many markets makes consistent, timely label updates difficult.", businessImpact: "Compliance risk and delayed updates across regions.", relevantServiceId: "labeling", conversationAngle: "Explore CCDS-to-local turnaround time and label consistency.", confidence: "Inferred" },
    { id: "pf-pp-2", title: "Submission backlog at peaks", whyItMayExist: "Concurrent filings and acquisition integration create capacity surges.", businessImpact: "Slipped timelines and team burnout.", relevantServiceId: "reg-ops", conversationAngle: "Discuss how peaks are absorbed today.", confidence: "Inferred" },
    { id: "pf-pp-3", title: "RIM modernisation after M&A", whyItMayExist: "Acquisitions bring disparate systems and data that must be unified.", businessImpact: "Data integrity gaps and inefficiency.", relevantServiceId: "rim", conversationAngle: "Ask about post-acquisition data harmonisation.", confidence: "Inferred" },
    { id: "pf-pp-4", title: "PV case volume", whyItMayExist: "Large marketed portfolio generates high adverse-event volume.", businessImpact: "Compliance risk if reporting slips.", relevantServiceId: "pv", conversationAngle: "Explore case volume trends and capacity.", confidence: "Inferred" },
    { id: "pf-pp-5", title: "Vendor consolidation", whyItMayExist: "Many niche suppliers across regulatory, quality, and PV.", businessImpact: "Governance overhead and unpredictable spend.", relevantServiceId: "vmo", conversationAngle: "Discuss appetite to consolidate suppliers.", confidence: "Inferred" },
    { id: "pf-pp-6", title: "Combination product complexity", whyItMayExist: "Drug-device products require specialised regulatory handling.", businessImpact: "Delays and rework on complex filings.", relevantServiceId: "combination", conversationAngle: "Ask about combination product pipeline.", confidence: "Inferred" },
  ],

  products: [
    { name: "mRNA & protein vaccines (portfolio)", category: "Vaccine", therapeuticArea: "Vaccines", lifecycle: "Growth", approvedMarkets: ["US", "EU", "Japan", "Global"], regulatoryImplication: "Ongoing variant updates and global label maintenance.", confidence: "Inferred" },
    { name: "Oncology portfolio", category: "Biologic / small molecule", therapeuticArea: "Oncology", lifecycle: "Growth", approvedMarkets: ["US", "EU", "Global"], regulatoryImplication: "Frequent indication expansions and complex submissions.", confidence: "Inferred" },
    { name: "Internal medicine portfolio", category: "Small molecule", therapeuticArea: "Internal Medicine", lifecycle: "Mature", approvedMarkets: ["Global"], regulatoryImplication: "Large label-maintenance footprint across markets.", confidence: "Inferred" },
    { name: "Inflammation & immunology assets", category: "Biologic", therapeuticArea: "Inflammation & Immunology", lifecycle: "Growth", approvedMarkets: ["US", "EU"], regulatoryImplication: "Biologics lifecycle and combination delivery considerations.", confidence: "Inferred" },
    { name: "Rare disease assets", category: "Biologic", therapeuticArea: "Rare Disease", lifecycle: "Launched", approvedMarkets: ["US", "EU"], regulatoryImplication: "Orphan pathways and specialised market access work.", confidence: "Inferred" },
  ],

  therapeuticAreas: [
    { name: "Vaccines", emphasis: "Core", note: "High-volume global label and submission activity." },
    { name: "Oncology", emphasis: "Growth", note: "Active pipeline and indication expansion." },
    { name: "Inflammation & Immunology", emphasis: "Growth", note: "Biologics with combination delivery." },
    { name: "Rare Disease", emphasis: "Emerging", note: "Orphan pathways, specialised access." },
  ],

  triggers: [
    { id: "pf-tr-1", date: "Recent (placeholder)", type: "M&A", headline: "Major oncology-focused acquisition integration ongoing", whyItMatters: "Integration drives regulatory, RIM, and quality workload.", freyrOpportunity: "RIM migration, reg-ops capacity, and labeling harmonisation.", confidence: "Inferred", source: src("Press release placeholder", "Press Release") },
    { id: "pf-tr-2", date: "Recent (placeholder)", type: "Product Launch", headline: "New product and indication launches across regions", whyItMatters: "Launches create submission and labeling surges.", freyrOpportunity: "Submission and labeling support.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "pf-tr-3", date: "Recent (placeholder)", type: "Digital Transformation", headline: "Regulatory and quality digital modernisation underway", whyItMatters: "Modernisation needs implementation and validation expertise.", freyrOpportunity: "RIM, technology platforms, and CSV/CSA.", confidence: "Inferred", source: src("Industry news placeholder", "News") },
    { id: "pf-tr-4", date: "Recent (placeholder)", type: "Restructuring", headline: "Cost-efficiency and operating-model changes", whyItMatters: "Efficiency drives interest in managed services.", freyrOpportunity: "VMO and managed-service models.", confidence: "Inferred", source: src("Analyst note placeholder", "News") },
    { id: "pf-tr-5", date: "Recent (placeholder)", type: "Geographic Expansion", headline: "Continued emerging-market registration activity", whyItMatters: "Expansion needs local regulatory coverage.", freyrOpportunity: "Local RA and product registration.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "pf-tr-6", date: "Recent (placeholder)", type: "Hiring", headline: "Regulatory and quality hiring signals", whyItMatters: "Hiring indicates capacity pressure Freyr can relieve.", freyrOpportunity: "Augmentation and managed pods.", confidence: "Unknown", source: src("Job board placeholder", "Industry Database") },
  ],

  competitors: [
    { name: "IQVIA", possibleServiceArea: "Regulatory, RIM, and data services", strength: "Scale and data assets.", freyrDifferentiation: "Deeper regulatory-specialist focus and flexible managed-service pods.", confidence: "Inferred" },
    { name: "Parexel", possibleServiceArea: "Regulatory consulting and operations", strength: "Established regulatory consulting brand.", freyrDifferentiation: "Cost-effective execution depth and labeling specialisation.", confidence: "Inferred" },
    { name: "Veeva", possibleServiceArea: "RIM and labeling technology", strength: "Dominant regulatory platform.", freyrDifferentiation: "Implementation, data, and managed operations on top of platforms.", confidence: "Inferred" },
    { name: "Accenture", possibleServiceArea: "Digital and operating-model transformation", strength: "Broad consulting and digital reach.", freyrDifferentiation: "Regulatory domain depth rather than generalist consulting.", confidence: "Inferred" },
    { name: "PharmaLex", possibleServiceArea: "Regulatory and PV services", strength: "Regulatory and PV breadth.", freyrDifferentiation: "Technology-enabled delivery and labeling/artwork focus.", confidence: "Inferred" },
  ],

  strategy: {
    bestEntryPoint: "Director Regulatory Operations, with the VP Regulatory Affairs as the executive sponsor.",
    entryRationale: "Operations leaders feel capacity and RIM pain most acutely and can pilot scope quickly, while the VP provides strategic sponsorship.",
    firstConversationStrategy: "Anchor on a specific, current trigger (acquisition integration) and offer a focused operational assessment rather than a broad pitch.",
    landAndExpand: "Start with a defined reg-ops or labeling pilot, prove right-first-time quality, then expand into RIM, PV, and managed services.",
    crossSell: ["Labeling harmonisation", "RIM modernisation", "Pharmacovigilance overflow", "Managed-service pods"],
    objections: ["Strong internal teams already", "Existing CRO relationships", "Procurement preference for fewer changes"],
    differentiation: "Regulatory-specialist focus, labeling/artwork depth, and flexible managed-service commercials versus generalist consultancies.",
    actionPlan: [
      { horizon: "30 days", action: "Secure an intro to Reg Ops; run a focused assessment of submission peaks and RIM data health." },
      { horizon: "60 days", action: "Propose a scoped pilot (labeling or reg-ops) with clear success metrics and exec sponsorship." },
      { horizon: "90 days", action: "Deliver pilot value, present an expansion roadmap across RIM, PV, and managed services." },
    ],
  },

  sources: [
    src("FY annual report (10-K)", "Annual Report"),
    src("Company website — pipeline & locations", "Company Website"),
    src("Industry analysis — outsourcing trends", "Inferred Analysis"),
    src("Press release — acquisition", "Press Release"),
  ],
};
