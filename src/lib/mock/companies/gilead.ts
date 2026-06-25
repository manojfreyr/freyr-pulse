import type { Company } from "@/lib/types";
import { src } from "@/lib/mock/sources";

export const gilead: Company = {
  id: "gilead",
  name: "Gilead Sciences, Inc.",
  website: "https://www.gilead.com",
  logoMonogram: "Gi",
  aliases: ["gilead", "gild", "gilead sciences", "gilead.com"],

  snapshot: {
    description:
      "Research-based biopharmaceutical company historically anchored in virology (HIV, hepatitis) and expanding aggressively into oncology, including cell therapy, through acquisition and pipeline growth.",
    headquarters: { city: "Foster City", country: "United States", region: "North America", isHeadquarters: true },
    globalLocations: [
      { city: "Foster City", country: "United States", region: "North America", isHeadquarters: true },
      { city: "Stockley Park", country: "United Kingdom", region: "Europe" },
      { city: "Cork", country: "Ireland", region: "Europe" },
      { city: "Singapore", country: "Singapore", region: "Asia Pacific" },
      { city: "Tokyo", country: "Japan", region: "Asia Pacific" },
    ],
    contactPlaceholder: { phone: "+1 (xxx) xxx-xxxx — placeholder", email: "contact@placeholder.com" },
    publicStatus: "Public",
    stockTicker: "NASDAQ: GILD",
    annualRevenueUSD: { value: "~$27–29B", confidence: "Likely", sources: [src("FY annual report (10-K)", "Annual Report")] },
    employeeCount: { value: "~18,000", confidence: "Likely", sources: [src("Company website — careers", "Company Website")] },
    sizeCategory: "Large (5k–50k)",
    industrySegment: "Biopharmaceutical (virology & oncology)",
    therapeuticFocus: ["HIV", "Viral Hepatitis", "Oncology / Cell Therapy", "Inflammation"],
    lastUpdated: "Phase 1 — mock data",
  },

  opportunity: {
    score: 83,
    level: "High",
    verdict:
      "A virology leader pivoting hard into oncology and cell therapy — new modalities, acquisitions, and global expansion make this a strong, strategically timely account.",
    reasons: [
      "Aggressive expansion into oncology and complex cell therapy modalities",
      "Acquisition-driven growth creating integration and RIM workload",
      "Established global virology portfolio with heavy label-maintenance needs",
      "Strong fit for regulatory strategy, operations, RIM, and PV",
      "Cell therapy complexity demanding specialist regulatory support",
    ],
    nextBestAction:
      "Engage the VP Regulatory Affairs on cell-therapy regulatory strategy and post-acquisition RIM and operations integration.",
    confidence: "Inferred",
    factors: [
      { key: "companySize", label: "Company size", score: 82, weight: 0.15, explanation: "Large biopharma workforce and revenue.", confidence: "Likely" },
      { key: "globalFootprint", label: "Global footprint", score: 84, weight: 0.15, explanation: "Global virology presence; expanding oncology reach.", confidence: "Likely" },
      { key: "portfolioComplexity", label: "Portfolio complexity", score: 86, weight: 0.15, explanation: "Small molecules, biologics, and cell therapy span very different pathways.", confidence: "Inferred" },
      { key: "regulatoryBurden", label: "Regulatory burden", score: 84, weight: 0.15, explanation: "Mature virology maintenance plus complex new-modality filings.", confidence: "Inferred" },
      { key: "businessTriggers", label: "Recent business triggers", score: 86, weight: 0.12, explanation: "Oncology acquisitions and cell-therapy launches are active signals.", confidence: "Inferred" },
      { key: "outsourcingLikelihood", label: "Outsourcing likelihood", score: 82, weight: 0.10, explanation: "Pivoting biopharma often outsources to add new-area capacity fast.", confidence: "Inferred" },
      { key: "freyrServiceFit", label: "Fit with Freyr services", score: 84, weight: 0.10, explanation: "Strong fit for strategy, operations, RIM, and PV.", confidence: "Inferred" },
      { key: "potentialAccountValue", label: "Potential account value", score: 84, weight: 0.08, explanation: "Strategic account with growing, complex needs.", confidence: "Inferred" },
    ],
  },

  painPoints: [
    { id: "gi-pp-1", title: "New-modality regulatory strategy", whyItMayExist: "Cell therapy and novel oncology assets bring unfamiliar pathways.", businessImpact: "Slower, riskier filings in priority growth areas.", relevantServiceId: "reg-strategy", conversationAngle: "Discuss confidence in cell-therapy filing strategy.", confidence: "Inferred" },
    { id: "gi-pp-2", title: "Rising submission volume", whyItMayExist: "Oncology expansion multiplies submissions beyond virology norms.", businessImpact: "Capacity strain and timeline risk.", relevantServiceId: "reg-ops", conversationAngle: "Explore how growing volume is resourced.", confidence: "Inferred" },
    { id: "gi-pp-3", title: "Post-acquisition RIM harmonisation", whyItMayExist: "Acquisitions add disparate systems and data.", businessImpact: "Data integrity and efficiency loss.", relevantServiceId: "rim", conversationAngle: "Ask about integration of regulatory data.", confidence: "Inferred" },
    { id: "gi-pp-4", title: "Complex PV for new modalities", whyItMayExist: "Cell therapy safety monitoring is intensive and specialised.", businessImpact: "Compliance and patient-safety risk.", relevantServiceId: "pv", conversationAngle: "Explore PV readiness for cell therapy.", confidence: "Inferred" },
    { id: "gi-pp-5", title: "Labeling across mixed portfolio", whyItMayExist: "Mature virology plus new oncology products expand labeling scope.", businessImpact: "Consistency and timeliness risk.", relevantServiceId: "labeling", conversationAngle: "Discuss labeling capacity across the portfolio.", confidence: "Inferred" },
    { id: "gi-pp-6", title: "Authoring capacity for complex filings", whyItMayExist: "Complex oncology dossiers demand specialised writing.", businessImpact: "Bottlenecks delay filings.", relevantServiceId: "med-writing", conversationAngle: "Ask where authoring capacity is tightest.", confidence: "Inferred" },
  ],

  products: [
    { name: "HIV treatment & prevention portfolio", category: "Small molecule / combination", therapeuticArea: "HIV", lifecycle: "Mature", approvedMarkets: ["Global"], regulatoryImplication: "Large global label-maintenance footprint.", confidence: "Likely" },
    { name: "Viral hepatitis portfolio", category: "Small molecule", therapeuticArea: "Viral Hepatitis", lifecycle: "Mature", approvedMarkets: ["Global"], regulatoryImplication: "Ongoing lifecycle and label maintenance.", confidence: "Inferred" },
    { name: "Cell therapy assets", category: "Cell therapy", therapeuticArea: "Oncology", lifecycle: "Growth", approvedMarkets: ["US", "EU"], regulatoryImplication: "Highly complex, specialised regulatory pathways.", confidence: "Inferred" },
    { name: "Oncology biologics & ADCs", category: "Biologic / ADC", therapeuticArea: "Oncology", lifecycle: "Growth", approvedMarkets: ["US", "EU"], regulatoryImplication: "Complex submissions and indication expansion.", confidence: "Inferred" },
    { name: "Inflammation pipeline", category: "Small molecule / biologic", therapeuticArea: "Inflammation", lifecycle: "Pipeline", approvedMarkets: ["—"], regulatoryImplication: "Future submission and labeling demand.", confidence: "Inferred" },
  ],

  therapeuticAreas: [
    { name: "HIV", emphasis: "Core", note: "Global franchise with heavy label maintenance." },
    { name: "Viral Hepatitis", emphasis: "Core", note: "Mature global portfolio." },
    { name: "Oncology / Cell Therapy", emphasis: "Growth", note: "Strategic pivot via acquisition and pipeline." },
    { name: "Inflammation", emphasis: "Emerging", note: "Earlier-stage pipeline." },
  ],

  triggers: [
    { id: "gi-tr-1", date: "Recent (placeholder)", type: "M&A", headline: "Oncology / cell-therapy acquisitions integrating", whyItMatters: "Integration drives RIM, operations, and strategy workload.", freyrOpportunity: "RIM migration, reg-ops, and strategy support.", confidence: "Inferred", source: src("Press release placeholder", "Press Release") },
    { id: "gi-tr-2", date: "Recent (placeholder)", type: "Clinical Update", headline: "Oncology and cell-therapy pipeline advancing", whyItMatters: "Complex new modalities need strategy and PV build-out.", freyrOpportunity: "Reg strategy, PV, and writing.", confidence: "Inferred", source: src("Clinical update placeholder", "Press Release") },
    { id: "gi-tr-3", date: "Recent (placeholder)", type: "Regulatory Approval", headline: "New oncology approvals and indication expansions", whyItMatters: "Approvals trigger labeling and submissions.", freyrOpportunity: "Labeling and submissions support.", confidence: "Inferred", source: src("Regulatory filing placeholder", "Regulatory Filing") },
    { id: "gi-tr-4", date: "Recent (placeholder)", type: "Partnership", headline: "Oncology research and licensing partnerships", whyItMatters: "Partnerships add assets and regulatory coordination needs.", freyrOpportunity: "Regulatory operations and coordination.", confidence: "Inferred", source: src("Press release placeholder", "Press Release") },
    { id: "gi-tr-5", date: "Recent (placeholder)", type: "Geographic Expansion", headline: "Expanding oncology presence internationally", whyItMatters: "New markets need local coverage.", freyrOpportunity: "Local RA and registration.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "gi-tr-6", date: "Recent (placeholder)", type: "Hiring", headline: "Oncology regulatory and PV hiring", whyItMatters: "Capacity pressure in new growth areas.", freyrOpportunity: "Augmentation and PV build-out.", confidence: "Unknown", source: src("Job board placeholder", "Industry Database") },
  ],

  competitors: [
    { name: "IQVIA", possibleServiceArea: "Regulatory and PV services", strength: "Scale and data.", freyrDifferentiation: "Specialist new-modality regulatory depth at strong value.", confidence: "Inferred" },
    { name: "Parexel", possibleServiceArea: "Regulatory strategy and operations", strength: "Strong regulatory consulting.", freyrDifferentiation: "Execution depth plus flexible managed services.", confidence: "Inferred" },
    { name: "ICON", possibleServiceArea: "Clinical and regulatory", strength: "Clinical heritage.", freyrDifferentiation: "Deeper regulatory operations and labeling focus.", confidence: "Inferred" },
    { name: "Veeva", possibleServiceArea: "RIM and quality technology", strength: "Platform leadership.", freyrDifferentiation: "Migration and managed operations atop platforms.", confidence: "Inferred" },
    { name: "PharmaLex", possibleServiceArea: "Regulatory and PV", strength: "Regulatory and PV breadth.", freyrDifferentiation: "Technology-enabled, scalable delivery.", confidence: "Inferred" },
  ],

  strategy: {
    bestEntryPoint: "VP Regulatory Affairs, with Director Regulatory Operations as the operational sponsor.",
    entryRationale: "The oncology pivot is a strategic, VP-level theme; operations feels the resulting volume and RIM pain.",
    firstConversationStrategy: "Frame around supporting the oncology and cell-therapy pivot — strategy plus operational capacity — tied to recent acquisitions.",
    landAndExpand: "Begin with a strategy or RIM-integration engagement, then expand into operations, PV, and labeling as oncology scales.",
    crossSell: ["Regulatory operations capacity", "Pharmacovigilance for new modalities", "Global labeling", "Medical writing"],
    objections: ["Strong virology-era internal team", "New-modality expertise concerns", "Integration distraction"],
    differentiation: "New-modality regulatory depth combined with scalable operations and managed-service flexibility.",
    actionPlan: [
      { horizon: "30 days", action: "Reach Reg Affairs; map oncology pipeline milestones and post-acquisition RIM scope." },
      { horizon: "60 days", action: "Propose a strategy or RIM-integration engagement tied to a near-term oncology filing." },
      { horizon: "90 days", action: "Deliver value; expand into operations, PV, and labeling across the pivot." },
    ],
  },

  sources: [
    src("FY annual report (10-K)", "Annual Report"),
    src("Company website — pipeline", "Company Website"),
    src("Industry analysis — oncology pivot", "Inferred Analysis"),
    src("Press release — acquisition", "Press Release"),
  ],
};
