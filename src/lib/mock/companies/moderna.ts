import type { Company } from "@/lib/types";
import { src } from "@/lib/mock/sources";

export const moderna: Company = {
  id: "moderna",
  name: "Moderna, Inc.",
  website: "https://www.modernatx.com",
  logoMonogram: "Mo",
  aliases: ["moderna", "mrna", "moderna inc", "modernatx", "modernatx.com"],

  snapshot: {
    description:
      "mRNA-focused biotechnology company building a broad pipeline across infectious disease, oncology, and rare disease, transitioning from a single-product success to a multi-product commercial organisation.",
    headquarters: { city: "Cambridge", country: "United States", region: "North America", isHeadquarters: true },
    globalLocations: [
      { city: "Cambridge", country: "United States", region: "North America", isHeadquarters: true },
      { city: "Norwood", country: "United States", region: "North America" },
      { city: "London", country: "United Kingdom", region: "Europe" },
      { city: "Tokyo", country: "Japan", region: "Asia Pacific" },
      { city: "Sydney", country: "Australia", region: "Asia Pacific" },
    ],
    contactPlaceholder: { phone: "+1 (xxx) xxx-xxxx — placeholder", email: "contact@placeholder.com" },
    publicStatus: "Public",
    stockTicker: "NASDAQ: MRNA",
    annualRevenueUSD: { value: "~$3–6B (declining from pandemic peak)", confidence: "Likely", sources: [src("FY annual report (10-K)", "Annual Report")] },
    employeeCount: { value: "~5,000–6,000", confidence: "Likely", sources: [src("Company website — careers", "Company Website")] },
    sizeCategory: "Large (5k–50k)",
    industrySegment: "mRNA biotechnology",
    therapeuticFocus: ["Infectious Disease", "Oncology", "Rare Disease", "Latent Viruses"],
    lastUpdated: "Phase 1 — mock data",
  },

  opportunity: {
    score: 84,
    level: "High",
    verdict:
      "A fast-scaling biotech transitioning to a multi-product company — building global regulatory, labeling, and PV infrastructure makes this a high-growth opportunity.",
    reasons: [
      "Rapidly expanding pipeline moving multiple products toward approval",
      "Transition from one product to a multi-product global organisation",
      "Need to build scalable regulatory operations and PV infrastructure fast",
      "Strong fit for submissions, labeling, RIM, and managed services",
      "Innovation culture open to AI-enabled regulatory approaches",
    ],
    nextBestAction:
      "Engage the VP Regulatory Affairs or CIO with a 'scale your regulatory engine for a multi-product future' conversation, tied to pipeline launches.",
    confidence: "Inferred",
    factors: [
      { key: "companySize", label: "Company size", score: 70, weight: 0.15, explanation: "Mid-to-large workforce, growing as commercial scope widens.", confidence: "Likely" },
      { key: "globalFootprint", label: "Global footprint", score: 78, weight: 0.15, explanation: "Expanding international registrations and subsidiaries.", confidence: "Inferred" },
      { key: "portfolioComplexity", label: "Portfolio complexity", score: 80, weight: 0.15, explanation: "Many pipeline assets across modalities create growing submission complexity.", confidence: "Inferred" },
      { key: "regulatoryBurden", label: "Regulatory burden", score: 85, weight: 0.15, explanation: "Moving from one product to many sharply increases submission and label work.", confidence: "Inferred" },
      { key: "businessTriggers", label: "Recent business triggers", score: 88, weight: 0.12, explanation: "Pipeline progression and pivots to oncology/rare disease are active signals.", confidence: "Inferred" },
      { key: "outsourcingLikelihood", label: "Outsourcing likelihood", score: 88, weight: 0.10, explanation: "Scaling biotech often outsources to build capacity fast rather than hire.", confidence: "Inferred" },
      { key: "freyrServiceFit", label: "Fit with Freyr services", score: 86, weight: 0.10, explanation: "Strong fit for submissions, RIM, PV build-out, and labeling.", confidence: "Inferred" },
      { key: "potentialAccountValue", label: "Potential account value", score: 80, weight: 0.08, explanation: "Growing account with multi-year potential as the portfolio commercialises.", confidence: "Inferred" },
    ],
  },

  painPoints: [
    { id: "mo-pp-1", title: "Scaling regulatory operations fast", whyItMayExist: "Moving from one product to many strains a lean regulatory function.", businessImpact: "Risk of delayed filings as volume rises.", relevantServiceId: "submissions", conversationAngle: "Discuss how the team will absorb multi-product submission load.", confidence: "Inferred" },
    { id: "mo-pp-2", title: "Building a RIM backbone", whyItMayExist: "Early-stage data practices may not scale to many products and markets.", businessImpact: "Data integrity and efficiency risk later.", relevantServiceId: "rim", conversationAngle: "Ask how regulatory data will scale with the pipeline.", confidence: "Inferred" },
    { id: "mo-pp-3", title: "Standing up scalable PV", whyItMayExist: "Each new marketed product adds safety obligations.", businessImpact: "Compliance exposure if PV lags launches.", relevantServiceId: "pv", conversationAngle: "Explore PV readiness for upcoming launches.", confidence: "Inferred" },
    { id: "mo-pp-4", title: "First-time global labeling", whyItMayExist: "New markets require disciplined labeling processes not yet mature.", businessImpact: "Inconsistency and delays across regions.", relevantServiceId: "labeling", conversationAngle: "Discuss labeling readiness for global launches.", confidence: "Inferred" },
    { id: "mo-pp-5", title: "Lean team, rising workload", whyItMayExist: "Headcount lags the expanding regulatory remit.", businessImpact: "Burnout and bottlenecks.", relevantServiceId: "vmo", conversationAngle: "Ask where the team is most stretched.", confidence: "Inferred" },
    { id: "mo-pp-6", title: "Novel-modality filing complexity", whyItMayExist: "New therapeutic areas bring unfamiliar regulatory pathways.", businessImpact: "Slower, riskier filings.", relevantServiceId: "reg-strategy", conversationAngle: "Explore confidence in new-area filing strategy.", confidence: "Inferred" },
  ],

  products: [
    { name: "Respiratory vaccine franchise", category: "mRNA vaccine", therapeuticArea: "Infectious Disease", lifecycle: "Mature", approvedMarkets: ["US", "EU", "Global"], regulatoryImplication: "Annual strain updates and broad label maintenance.", confidence: "Likely" },
    { name: "Combination respiratory vaccine", category: "mRNA vaccine", therapeuticArea: "Infectious Disease", lifecycle: "Filed", approvedMarkets: ["US (filed)"], regulatoryImplication: "New filings and first approvals across regions.", confidence: "Inferred" },
    { name: "Latent virus vaccine candidates", category: "mRNA vaccine", therapeuticArea: "Latent Viruses", lifecycle: "Pipeline", approvedMarkets: ["—"], regulatoryImplication: "Future submission and labeling demand.", confidence: "Inferred" },
    { name: "Individualised neoantigen therapy", category: "mRNA therapeutic", therapeuticArea: "Oncology", lifecycle: "Pipeline", approvedMarkets: ["—"], regulatoryImplication: "Complex, novel regulatory pathway.", confidence: "Inferred" },
    { name: "Rare disease mRNA candidates", category: "mRNA therapeutic", therapeuticArea: "Rare Disease", lifecycle: "Pipeline", approvedMarkets: ["—"], regulatoryImplication: "Orphan pathways and specialised strategy.", confidence: "Inferred" },
  ],

  therapeuticAreas: [
    { name: "Infectious Disease", emphasis: "Core", note: "Commercial base with ongoing label maintenance." },
    { name: "Oncology", emphasis: "Growth", note: "Novel individualised therapy approaching key readouts." },
    { name: "Latent Viruses", emphasis: "Growth", note: "Multiple vaccine candidates advancing." },
    { name: "Rare Disease", emphasis: "Emerging", note: "Early pipeline with orphan considerations." },
  ],

  triggers: [
    { id: "mo-tr-1", date: "Recent (placeholder)", type: "Product Launch", headline: "New and combination vaccines advancing toward approval", whyItMatters: "Multiple near-term filings increase submission and labeling load.", freyrOpportunity: "Submissions, publishing, and labeling support.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "mo-tr-2", date: "Recent (placeholder)", type: "Clinical Update", headline: "Oncology and rare-disease pipeline progressing", whyItMatters: "Novel modalities require strategy and infrastructure build-out.", freyrOpportunity: "Reg strategy, RIM, and PV.", confidence: "Inferred", source: src("Clinical update placeholder", "Press Release") },
    { id: "mo-tr-3", date: "Recent (placeholder)", type: "Restructuring", headline: "Cost discipline as pandemic revenue normalises", whyItMatters: "Efficiency focus favours flexible outsourcing over hiring.", freyrOpportunity: "Managed-service pods and AI-enabled efficiency.", confidence: "Inferred", source: src("Analyst note placeholder", "News") },
    { id: "mo-tr-4", date: "Recent (placeholder)", type: "Geographic Expansion", headline: "Expanding international registrations", whyItMatters: "New markets need local regulatory coverage.", freyrOpportunity: "Local RA and product registration.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "mo-tr-5", date: "Recent (placeholder)", type: "Digital Transformation", headline: "Investing in digital and AI capabilities", whyItMatters: "Openness to AI-enabled regulatory work.", freyrOpportunity: "AI-enabled regulatory solutions and tech platforms.", confidence: "Inferred", source: src("Industry news placeholder", "News") },
    { id: "mo-tr-6", date: "Recent (placeholder)", type: "Hiring", headline: "Regulatory and PV hiring as portfolio grows", whyItMatters: "Capacity pressure Freyr can relieve quickly.", freyrOpportunity: "Augmentation and PV build-out.", confidence: "Unknown", source: src("Job board placeholder", "Industry Database") },
  ],

  competitors: [
    { name: "IQVIA", possibleServiceArea: "Regulatory and PV services", strength: "Scale and breadth.", freyrDifferentiation: "More agile, specialist support suited to scaling biotech.", confidence: "Inferred" },
    { name: "ICON", possibleServiceArea: "Clinical and regulatory services", strength: "Strong clinical heritage.", freyrDifferentiation: "Deeper regulatory operations and labeling focus.", confidence: "Inferred" },
    { name: "Veeva", possibleServiceArea: "RIM and quality technology", strength: "Leading platforms.", freyrDifferentiation: "Implementation plus managed operations, not just software.", confidence: "Inferred" },
    { name: "PharmaLex", possibleServiceArea: "Regulatory and PV", strength: "Regulatory and PV breadth.", freyrDifferentiation: "Technology-enabled delivery and scalable pods.", confidence: "Inferred" },
    { name: "Syneos Health", possibleServiceArea: "Clinical-to-commercial services", strength: "Integrated model.", freyrDifferentiation: "Focused regulatory and quality depth.", confidence: "Inferred" },
  ],

  strategy: {
    bestEntryPoint: "VP Regulatory Affairs, with the CIO / Digital leader as a strong secondary.",
    entryRationale: "The strategic challenge is building a scalable regulatory engine for a multi-product future — a VP-level theme, with digital infrastructure owned by the CIO.",
    firstConversationStrategy: "Frame around 'scaling the regulatory engine' rather than discrete tasks; lead with the multi-product transition.",
    landAndExpand: "Begin with submissions or PV build-out for a near-term launch, then expand into RIM and labeling as the foundation.",
    crossSell: ["RIM implementation & operations", "Pharmacovigilance build-out", "Global labeling setup", "AI-enabled authoring"],
    objections: ["We're building internally", "Preference for best-of-breed point vendors", "Cost discipline limits new spend"],
    differentiation: "Agility and specialist depth that suit a fast-scaling biotech, with AI-enabled efficiency and flexible commercials.",
    actionPlan: [
      { horizon: "30 days", action: "Connect with Reg Affairs / Digital; map upcoming launches against current capacity." },
      { horizon: "60 days", action: "Propose a build-out pilot (submissions or PV) tied to a specific launch milestone." },
      { horizon: "90 days", action: "Show pilot results; present a scaling roadmap across RIM, labeling, and AI." },
    ],
  },

  sources: [
    src("FY annual report (10-K)", "Annual Report"),
    src("Company website — pipeline", "Company Website"),
    src("Industry analysis — biotech scaling", "Inferred Analysis"),
    src("Clinical pipeline update", "Press Release"),
  ],
};
