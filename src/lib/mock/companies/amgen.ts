import type { Company } from "@/lib/types";
import { src } from "@/lib/mock/sources";

export const amgen: Company = {
  id: "amgen",
  name: "Amgen Inc.",
  website: "https://www.amgen.com",
  logoMonogram: "Am",
  aliases: ["amgen", "amgn", "amgen inc", "amgen.com"],

  snapshot: {
    description:
      "One of the world's largest independent biotechnology companies, focused on biologics and increasingly biosimilars across oncology, inflammation, bone health, cardiovascular, and rare disease.",
    headquarters: { city: "Thousand Oaks", country: "United States", region: "North America", isHeadquarters: true },
    globalLocations: [
      { city: "Thousand Oaks", country: "United States", region: "North America", isHeadquarters: true },
      { city: "Cambridge", country: "United States", region: "North America" },
      { city: "Dublin", country: "Ireland", region: "Europe" },
      { city: "Breda", country: "Netherlands", region: "Europe" },
      { city: "Singapore", country: "Singapore", region: "Asia Pacific" },
    ],
    contactPlaceholder: { phone: "+1 (xxx) xxx-xxxx — placeholder", email: "contact@placeholder.com" },
    publicStatus: "Public",
    stockTicker: "NASDAQ: AMGN",
    annualRevenueUSD: { value: "~$28–33B", confidence: "Likely", sources: [src("FY annual report (10-K)", "Annual Report")] },
    employeeCount: { value: "~25,000", confidence: "Likely", sources: [src("Company website — careers", "Company Website")] },
    sizeCategory: "Large (5k–50k)",
    industrySegment: "Biotechnology (biologics & biosimilars)",
    therapeuticFocus: ["Oncology", "Inflammation", "Bone Health", "Cardiovascular", "Rare Disease"],
    lastUpdated: "Phase 1 — mock data",
  },

  opportunity: {
    score: 86,
    level: "High",
    verdict:
      "A biologics-heavy enterprise with growing biosimilars and recent large M&A — complex submissions, labeling, and integration make this a strong multi-service account.",
    reasons: [
      "Biologics-heavy portfolio with complex, high-stakes submissions",
      "Expanding biosimilars business multiplying global registrations and labels",
      "Recent large acquisition driving integration and RIM workload",
      "Strong fit for regulatory operations, labeling, RIM, and managed services",
      "Mature outsourcing posture typical of large biotech",
    ],
    topServiceIds: ["reg-ops", "labeling", "rim", "product-reg", "vmo"],
    nextBestAction:
      "Engage the Director Regulatory Operations on biosimilar registration scale and post-acquisition RIM harmonisation.",
    confidence: "Inferred",
    factors: [
      { key: "companySize", label: "Company size", score: 88, weight: 0.15, explanation: "Large biotech workforce and revenue base.", confidence: "Likely" },
      { key: "globalFootprint", label: "Global footprint", score: 88, weight: 0.15, explanation: "Broad international presence and registrations.", confidence: "Likely" },
      { key: "portfolioComplexity", label: "Portfolio complexity", score: 90, weight: 0.15, explanation: "Biologics plus biosimilars create complex, high-volume regulatory work.", confidence: "Inferred" },
      { key: "regulatoryBurden", label: "Regulatory burden", score: 88, weight: 0.15, explanation: "Biosimilar registrations multiply submission and labeling load globally.", confidence: "Inferred" },
      { key: "businessTriggers", label: "Recent business triggers", score: 85, weight: 0.12, explanation: "Major acquisition and biosimilar launches are active signals.", confidence: "Inferred" },
      { key: "outsourcingLikelihood", label: "Outsourcing likelihood", score: 82, weight: 0.10, explanation: "Large biotech routinely outsources operations and registrations.", confidence: "Inferred" },
      { key: "freyrServiceFit", label: "Fit with Freyr services", score: 88, weight: 0.10, explanation: "Excellent fit for reg-ops, labeling, RIM, and product registration.", confidence: "Inferred" },
      { key: "potentialAccountValue", label: "Potential account value", score: 86, weight: 0.08, explanation: "Large, durable account with biosimilar-driven volume.", confidence: "Inferred" },
    ],
  },

  serviceRecommendations: [
    { serviceId: "reg-ops", relevanceScore: 90, whyRelevant: "Biologics and biosimilar filings create sustained, complex operational load.", likelyBuyer: "director-regulatory-operations", triggerOrPainPoint: "Complex submission volume", suggestedOpeningMessage: "We add regulatory operations capacity for complex biologics and biosimilar filings.", confidence: "Inferred" },
    { serviceId: "product-reg", relevanceScore: 89, whyRelevant: "Biosimilars require many parallel global registrations.", likelyBuyer: "director-regulatory-operations", triggerOrPainPoint: "Biosimilar global registration scale", suggestedOpeningMessage: "We run high-volume global registrations so biosimilar rollouts stay on schedule.", confidence: "Inferred" },
    { serviceId: "labeling", relevanceScore: 87, whyRelevant: "More products and markets mean more labels to derive and maintain.", likelyBuyer: "head-of-labeling", triggerOrPainPoint: "Growing labeling footprint", suggestedOpeningMessage: "We accelerate local label derivation and keep a growing portfolio consistent.", confidence: "Inferred" },
    { serviceId: "rim", relevanceScore: 86, whyRelevant: "A large acquisition leaves RIM data to migrate and harmonise.", likelyBuyer: "director-regulatory-operations", triggerOrPainPoint: "Post-acquisition RIM harmonisation", suggestedOpeningMessage: "We migrate and harmonise RIM data after acquisitions and run it ongoing.", confidence: "Inferred" },
    { serviceId: "vmo", relevanceScore: 82, whyRelevant: "Scale and variable demand favour managed-service pods.", likelyBuyer: "procurement-leader", triggerOrPainPoint: "Capacity flexibility", suggestedOpeningMessage: "Managed-service pods flex with biosimilar and pipeline demand.", confidence: "Inferred" },
    { serviceId: "combination", relevanceScore: 78, whyRelevant: "Biologics increasingly involve device delivery.", likelyBuyer: "vp-regulatory-affairs", triggerOrPainPoint: "Combination-product handling", suggestedOpeningMessage: "We handle combination-product strategy and submissions for biologic delivery.", confidence: "Inferred" },
    { serviceId: "quality", relevanceScore: 75, whyRelevant: "Acquisition integration stresses quality systems and SOP harmonisation.", likelyBuyer: "head-of-quality", triggerOrPainPoint: "Quality integration", suggestedOpeningMessage: "We support quality-system harmonisation through integration.", confidence: "Inferred" },
  ],

  painPoints: [
    { id: "am-pp-1", title: "Biosimilar registration scale", whyItMayExist: "Each biosimilar needs many parallel global registrations.", businessImpact: "Delays cost market-entry advantage.", relevantServiceId: "product-reg", conversationAngle: "Discuss how biosimilar registrations are resourced.", confidence: "Inferred" },
    { id: "am-pp-2", title: "Complex biologics submissions", whyItMayExist: "Biologics filings are large, technical, and high-stakes.", businessImpact: "Risk and rework if capacity is tight.", relevantServiceId: "reg-ops", conversationAngle: "Explore submission complexity and peaks.", confidence: "Inferred" },
    { id: "am-pp-3", title: "Post-acquisition RIM harmonisation", whyItMayExist: "A major acquisition adds disparate systems and data.", businessImpact: "Data integrity and efficiency loss.", relevantServiceId: "rim", conversationAngle: "Ask about integration of regulatory data.", confidence: "Inferred" },
    { id: "am-pp-4", title: "Growing labeling footprint", whyItMayExist: "More products and markets expand labeling work.", businessImpact: "Consistency and timeliness risk.", relevantServiceId: "labeling", conversationAngle: "Discuss labeling capacity as the portfolio grows.", confidence: "Inferred" },
    { id: "am-pp-5", title: "Quality integration burden", whyItMayExist: "Integrating an acquired company strains quality systems.", businessImpact: "Compliance risk during transition.", relevantServiceId: "quality", conversationAngle: "Explore quality-system harmonisation needs.", confidence: "Inferred" },
    { id: "am-pp-6", title: "Vendor consolidation", whyItMayExist: "Acquisitions multiply suppliers across functions.", businessImpact: "Governance overhead and cost.", relevantServiceId: "vmo", conversationAngle: "Ask about appetite to consolidate vendors.", confidence: "Inferred" },
  ],

  products: [
    { name: "Oncology biologics portfolio", category: "Biologic", therapeuticArea: "Oncology", lifecycle: "Growth", approvedMarkets: ["US", "EU", "Global"], regulatoryImplication: "Complex submissions and frequent indication updates.", confidence: "Inferred" },
    { name: "Inflammation biologics", category: "Biologic", therapeuticArea: "Inflammation", lifecycle: "Mature", approvedMarkets: ["Global"], regulatoryImplication: "Large global label-maintenance footprint.", confidence: "Inferred" },
    { name: "Biosimilars portfolio", category: "Biosimilar", therapeuticArea: "Multiple", lifecycle: "Growth", approvedMarkets: ["US", "EU", "Global"], regulatoryImplication: "High-volume parallel global registrations.", confidence: "Inferred" },
    { name: "Bone health biologics", category: "Biologic", therapeuticArea: "Bone Health", lifecycle: "Mature", approvedMarkets: ["Global"], regulatoryImplication: "Ongoing lifecycle management.", confidence: "Inferred" },
    { name: "Cardiovascular & rare disease assets", category: "Biologic / small molecule", therapeuticArea: "Cardiovascular / Rare Disease", lifecycle: "Launched", approvedMarkets: ["US", "EU"], regulatoryImplication: "Specialised access and orphan pathways.", confidence: "Inferred" },
  ],

  therapeuticAreas: [
    { name: "Oncology", emphasis: "Core", note: "Flagship biologics with active expansion." },
    { name: "Inflammation", emphasis: "Core", note: "Mature, high-volume global footprint." },
    { name: "Biosimilars", emphasis: "Growth", note: "Multiplying global registration and labeling work." },
    { name: "Rare Disease", emphasis: "Emerging", note: "Recently expanded via acquisition." },
  ],

  triggers: [
    { id: "am-tr-1", date: "Recent (placeholder)", type: "M&A", headline: "Large rare-disease acquisition integration ongoing", whyItMatters: "Integration drives RIM, regulatory, and quality workload.", freyrOpportunity: "RIM migration, reg-ops, and quality support.", confidence: "Inferred", source: src("Press release placeholder", "Press Release") },
    { id: "am-tr-2", date: "Recent (placeholder)", type: "Product Launch", headline: "Continued biosimilar launches across markets", whyItMatters: "Biosimilar launches require many registrations and labels.", freyrOpportunity: "Product registration and labeling.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "am-tr-3", date: "Recent (placeholder)", type: "Regulatory Approval", headline: "New indication approvals for oncology biologics", whyItMatters: "Approvals trigger label updates across regions.", freyrOpportunity: "Labeling and submissions.", confidence: "Inferred", source: src("Regulatory filing placeholder", "Regulatory Filing") },
    { id: "am-tr-4", date: "Recent (placeholder)", type: "Geographic Expansion", headline: "Expanding biosimilar presence internationally", whyItMatters: "New markets need local coverage.", freyrOpportunity: "Local RA and registration.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "am-tr-5", date: "Recent (placeholder)", type: "Digital Transformation", headline: "Investing in data and automation", whyItMatters: "Modernisation needs implementation and validation.", freyrOpportunity: "RIM, tech platforms, CSV/CSA.", confidence: "Inferred", source: src("Industry news placeholder", "News") },
    { id: "am-tr-6", date: "Recent (placeholder)", type: "Vendor Consolidation", headline: "Post-acquisition supplier rationalisation", whyItMatters: "Consolidation favours fewer, broader partners.", freyrOpportunity: "Managed-service consolidation.", confidence: "Unknown", source: src("Analyst note placeholder", "News") },
  ],

  competitors: [
    { name: "IQVIA", possibleServiceArea: "Regulatory, RIM, registrations", strength: "Scale and data.", freyrDifferentiation: "Specialist registration and labeling depth at better value.", confidence: "Inferred" },
    { name: "Parexel", possibleServiceArea: "Regulatory consulting and ops", strength: "Regulatory consulting brand.", freyrDifferentiation: "Execution depth for high-volume biosimilar work.", confidence: "Inferred" },
    { name: "Veeva", possibleServiceArea: "RIM and labeling technology", strength: "Leading platforms.", freyrDifferentiation: "Migration and managed operations on top of platforms.", confidence: "Inferred" },
    { name: "Deloitte", possibleServiceArea: "Integration and transformation", strength: "Integration consulting.", freyrDifferentiation: "Regulatory specialism rather than generalist consulting.", confidence: "Inferred" },
    { name: "Cognizant", possibleServiceArea: "Life-sciences IT and operations", strength: "IT and BPO scale.", freyrDifferentiation: "Regulatory domain expertise embedded in delivery.", confidence: "Inferred" },
  ],

  strategy: {
    bestEntryPoint: "Director Regulatory Operations, anchored on biosimilar registration scale.",
    entryRationale: "Biosimilar volume and post-acquisition RIM work create immediate, ownable operational pain.",
    firstConversationStrategy: "Lead with biosimilar registration throughput and post-acquisition data harmonisation as concrete, current problems.",
    landAndExpand: "Begin with a registration or RIM-migration scope, prove delivery, then expand into labeling, quality, and managed services.",
    crossSell: ["Global labeling", "Quality integration support", "Managed-service pods", "Combination-product support"],
    objections: ["Mature internal capabilities", "Existing large vendors", "Integration distraction"],
    differentiation: "High-volume registration and labeling execution at strong value, with managed-service flexibility.",
    actionPlan: [
      { horizon: "30 days", action: "Reach Reg Ops; quantify biosimilar registration volume and RIM-integration scope." },
      { horizon: "60 days", action: "Propose a registration or RIM-migration pilot with clear throughput metrics." },
      { horizon: "90 days", action: "Deliver pilot; present expansion into labeling, quality, and managed services." },
    ],
  },

  sources: [
    src("FY annual report (10-K)", "Annual Report"),
    src("Company website — pipeline & biosimilars", "Company Website"),
    src("Industry analysis — biosimilars", "Inferred Analysis"),
    src("Press release — acquisition", "Press Release"),
  ],
};
