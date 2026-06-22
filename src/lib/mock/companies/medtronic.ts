import type { Company } from "@/lib/types";
import { src } from "@/lib/mock/sources";

export const medtronic: Company = {
  id: "medtronic",
  name: "Medtronic plc",
  website: "https://www.medtronic.com",
  logoMonogram: "Md",
  aliases: ["medtronic", "mdt", "medtronic plc", "medtronic.com"],

  snapshot: {
    description:
      "One of the world's largest medical device companies, spanning cardiovascular, neuroscience, medical-surgical, and diabetes, with a growing set of drug-device combination and digitally connected products.",
    headquarters: { city: "Dublin", country: "Ireland", region: "Europe", isHeadquarters: true },
    globalLocations: [
      { city: "Dublin", country: "Ireland", region: "Europe", isHeadquarters: true },
      { city: "Minneapolis", country: "United States", region: "North America" },
      { city: "Tolochenaz", country: "Switzerland", region: "Europe" },
      { city: "Tokyo", country: "Japan", region: "Asia Pacific" },
      { city: "Shanghai", country: "China", region: "Asia Pacific" },
    ],
    contactPlaceholder: { phone: "+353 (x) xxx-xxxx — placeholder", email: "contact@placeholder.com" },
    publicStatus: "Public",
    stockTicker: "NYSE: MDT",
    annualRevenueUSD: { value: "~$31–33B", confidence: "Likely", sources: [src("FY annual report (10-K)", "Annual Report")] },
    employeeCount: { value: "~95,000", confidence: "Likely", sources: [src("Company website — careers", "Company Website")] },
    sizeCategory: "Enterprise (50k+)",
    industrySegment: "Medical devices & medtech",
    therapeuticFocus: ["Cardiovascular", "Neuroscience", "Medical-Surgical", "Diabetes"],
    lastUpdated: "Phase 1 — mock data",
  },

  opportunity: {
    score: 82,
    level: "High",
    verdict:
      "A medtech giant navigating MDR/IVDR, global device registrations, and connected/combination products — a strong fit for device regulatory, quality, and registration services.",
    reasons: [
      "Enormous device portfolio under MDR/IVDR and global registration pressure",
      "Growing combination and digitally connected products adding regulatory complexity",
      "Heavy quality, CSV/CSA, and audit demands across global manufacturing",
      "Strong fit for medical-device regulatory, registration, and quality services",
      "Continuous product iteration driving recurring submission and labeling work",
    ],
    topServiceIds: ["med-devices", "product-reg", "quality", "csv-csa", "labeling"],
    nextBestAction:
      "Engage the VP Regulatory Affairs or Head of Quality on MDR/IVDR sustaining work and global device registration scale.",
    confidence: "Inferred",
    factors: [
      { key: "companySize", label: "Company size", score: 96, weight: 0.15, explanation: "Very large global workforce across many sites.", confidence: "Likely" },
      { key: "globalFootprint", label: "Global footprint", score: 92, weight: 0.15, explanation: "Devices registered in markets worldwide.", confidence: "Likely" },
      { key: "portfolioComplexity", label: "Portfolio complexity", score: 90, weight: 0.15, explanation: "Thousands of device SKUs plus combination and connected products.", confidence: "Inferred" },
      { key: "regulatoryBurden", label: "Regulatory burden", score: 88, weight: 0.15, explanation: "MDR/IVDR transition and global registrations are heavy and ongoing.", confidence: "Inferred" },
      { key: "businessTriggers", label: "Recent business triggers", score: 78, weight: 0.12, explanation: "Portfolio reshaping, divestitures, and connected-product launches.", confidence: "Inferred" },
      { key: "outsourcingLikelihood", label: "Outsourcing likelihood", score: 80, weight: 0.10, explanation: "Device makers outsource registrations, CSV, and quality at the margins.", confidence: "Inferred" },
      { key: "freyrServiceFit", label: "Fit with Freyr services", score: 84, weight: 0.10, explanation: "Strong device-regulatory, registration, and quality fit.", confidence: "Inferred" },
      { key: "potentialAccountValue", label: "Potential account value", score: 86, weight: 0.08, explanation: "Large, durable account with recurring sustaining work.", confidence: "Inferred" },
    ],
  },

  serviceRecommendations: [
    { serviceId: "med-devices", relevanceScore: 92, whyRelevant: "MDR/IVDR transition and sustaining work create heavy, ongoing device-regulatory demand.", likelyBuyer: "vp-regulatory-affairs", triggerOrPainPoint: "MDR/IVDR sustaining workload", suggestedOpeningMessage: "We provide device-regulatory capacity for MDR/IVDR and sustaining activities at scale.", confidence: "Inferred" },
    { serviceId: "product-reg", relevanceScore: 90, whyRelevant: "A vast SKU base must be registered and maintained across many markets.", likelyBuyer: "director-regulatory-operations", triggerOrPainPoint: "Global device registration volume", suggestedOpeningMessage: "We manage high-volume global device registrations and renewals efficiently.", confidence: "Inferred" },
    { serviceId: "quality", relevanceScore: 86, whyRelevant: "Global manufacturing drives quality, audit, and inspection demand.", likelyBuyer: "head-of-quality", triggerOrPainPoint: "Quality and inspection readiness", suggestedOpeningMessage: "We boost audit coverage and inspection readiness across sites and suppliers.", confidence: "Inferred" },
    { serviceId: "csv-csa", relevanceScore: 84, whyRelevant: "Connected and digital products multiply validated-system obligations.", likelyBuyer: "head-of-quality", triggerOrPainPoint: "Validation debt on connected products", suggestedOpeningMessage: "We clear validation debt with risk-based CSA for connected and digital systems.", confidence: "Inferred" },
    { serviceId: "labeling", relevanceScore: 80, whyRelevant: "Device labeling and IFUs must stay compliant across markets and revisions.", likelyBuyer: "head-of-labeling", triggerOrPainPoint: "Device labeling / IFU control", suggestedOpeningMessage: "We manage device labeling and IFU change control across regions.", confidence: "Inferred" },
    { serviceId: "combination", relevanceScore: 78, whyRelevant: "Drug-device combinations need specialised regulatory handling.", likelyBuyer: "vp-regulatory-affairs", triggerOrPainPoint: "Combination-product complexity", suggestedOpeningMessage: "We handle combination-product strategy bridging device and drug pathways.", confidence: "Inferred" },
    { serviceId: "vmo", relevanceScore: 74, whyRelevant: "Scale and variable sustaining demand suit managed pods.", likelyBuyer: "procurement-leader", triggerOrPainPoint: "Sustaining-capacity flexibility", suggestedOpeningMessage: "Managed pods absorb sustaining and registration peaks across the portfolio.", confidence: "Inferred" },
  ],

  painPoints: [
    { id: "md-pp-1", title: "MDR/IVDR sustaining burden", whyItMayExist: "Transition and ongoing compliance for a huge device base is resource-heavy.", businessImpact: "Risk of certificate gaps and market disruption.", relevantServiceId: "med-devices", conversationAngle: "Discuss MDR/IVDR sustaining capacity.", confidence: "Inferred" },
    { id: "md-pp-2", title: "Global registration volume", whyItMayExist: "Thousands of SKUs require registration and renewal across markets.", businessImpact: "Delays restrict market availability.", relevantServiceId: "product-reg", conversationAngle: "Explore registration and renewal throughput.", confidence: "Inferred" },
    { id: "md-pp-3", title: "Quality and audit coverage", whyItMayExist: "Global manufacturing footprint stretches quality teams.", businessImpact: "Inspection findings and compliance risk.", relevantServiceId: "quality", conversationAngle: "Ask about supplier-audit coverage versus plan.", confidence: "Inferred" },
    { id: "md-pp-4", title: "Validation debt on connected products", whyItMayExist: "Digital and connected products add validated-system scope.", businessImpact: "Compliance and release-cycle risk.", relevantServiceId: "csv-csa", conversationAngle: "Discuss validation backlog on digital systems.", confidence: "Inferred" },
    { id: "md-pp-5", title: "Device labeling / IFU control", whyItMayExist: "Frequent design changes drive IFU and label revisions.", businessImpact: "Compliance risk from outdated labeling.", relevantServiceId: "labeling", conversationAngle: "Explore IFU change-control throughput.", confidence: "Inferred" },
    { id: "md-pp-6", title: "Combination-product complexity", whyItMayExist: "Drug-device products bridge two regulatory regimes.", businessImpact: "Delays on complex filings.", relevantServiceId: "combination", conversationAngle: "Ask about combination-product pipeline.", confidence: "Inferred" },
  ],

  products: [
    { name: "Cardiovascular devices (pacemakers, stents)", category: "Implantable device", therapeuticArea: "Cardiovascular", lifecycle: "Mature", approvedMarkets: ["Global"], regulatoryImplication: "MDR sustaining and global registration maintenance.", confidence: "Inferred" },
    { name: "Neuromodulation systems", category: "Active implantable", therapeuticArea: "Neuroscience", lifecycle: "Growth", approvedMarkets: ["US", "EU", "Japan"], regulatoryImplication: "Complex device submissions and labeling.", confidence: "Inferred" },
    { name: "Surgical & robotics platforms", category: "Surgical device", therapeuticArea: "Medical-Surgical", lifecycle: "Growth", approvedMarkets: ["US", "EU"], regulatoryImplication: "Software/connectivity adds CSV and regulatory scope.", confidence: "Inferred" },
    { name: "Insulin pumps & CGM (diabetes)", category: "Combination / connected device", therapeuticArea: "Diabetes", lifecycle: "Growth", approvedMarkets: ["US", "EU", "Global"], regulatoryImplication: "Combination-product and connected-device complexity.", confidence: "Inferred" },
    { name: "Connected / digital health offerings", category: "SaMD / digital", therapeuticArea: "Multiple", lifecycle: "Launched", approvedMarkets: ["US", "EU"], regulatoryImplication: "Software-as-a-medical-device pathways and validation.", confidence: "Inferred" },
  ],

  therapeuticAreas: [
    { name: "Cardiovascular", emphasis: "Core", note: "Large installed base under MDR sustaining." },
    { name: "Neuroscience", emphasis: "Growth", note: "Complex active implantables." },
    { name: "Medical-Surgical", emphasis: "Growth", note: "Robotics and connectivity expanding scope." },
    { name: "Diabetes", emphasis: "Growth", note: "Combination and connected devices." },
  ],

  triggers: [
    { id: "md-tr-1", date: "Recent (placeholder)", type: "Regulatory Approval", headline: "New device and connected-product approvals", whyItMatters: "Approvals trigger registrations and labeling across markets.", freyrOpportunity: "Registration and labeling support.", confidence: "Inferred", source: src("Regulatory filing placeholder", "Regulatory Filing") },
    { id: "md-tr-2", date: "Recent (placeholder)", type: "Divestment", headline: "Portfolio reshaping and divestitures", whyItMatters: "Divestitures and carve-outs create transition regulatory work.", freyrOpportunity: "Registration transfer and RIM support.", confidence: "Inferred", source: src("Press release placeholder", "Press Release") },
    { id: "md-tr-3", date: "Recent (placeholder)", type: "Digital Transformation", headline: "Expanding connected and digital health portfolio", whyItMatters: "Software products add CSV and SaMD regulatory scope.", freyrOpportunity: "CSV/CSA and device regulatory.", confidence: "Inferred", source: src("Industry news placeholder", "News") },
    { id: "md-tr-4", date: "Recent (placeholder)", type: "Geographic Expansion", headline: "Continued emerging-market device registrations", whyItMatters: "Expansion needs local registration capacity.", freyrOpportunity: "Local RA and product registration.", confidence: "Inferred", source: src("Company website placeholder", "Company Website") },
    { id: "md-tr-5", date: "Recent (placeholder)", type: "Warning Letter", headline: "Historic quality observations at select sites", whyItMatters: "Quality scrutiny raises audit and remediation needs.", freyrOpportunity: "Quality, audits, and CSV/CSA.", confidence: "Unknown", source: src("Regulatory database placeholder", "Industry Database") },
    { id: "md-tr-6", date: "Recent (placeholder)", type: "Hiring", headline: "Regulatory and quality hiring across regions", whyItMatters: "Capacity pressure Freyr can relieve.", freyrOpportunity: "Augmentation and managed pods.", confidence: "Unknown", source: src("Job board placeholder", "Industry Database") },
  ],

  competitors: [
    { name: "IQVIA MedTech", possibleServiceArea: "Device regulatory and registrations", strength: "Scale and medtech reach.", freyrDifferentiation: "Cost-effective registration execution and quality depth.", confidence: "Inferred" },
    { name: "Labcorp / NAMSA-type providers", possibleServiceArea: "Device testing and regulatory", strength: "Testing and notified-body experience.", freyrDifferentiation: "Broader regulatory operations and registration management.", confidence: "Inferred" },
    { name: "Accenture", possibleServiceArea: "Digital and quality transformation", strength: "Digital transformation breadth.", freyrDifferentiation: "Regulatory and CSV specialism over generalist consulting.", confidence: "Inferred" },
    { name: "Veeva (MedTech)", possibleServiceArea: "Quality and regulatory technology", strength: "Platform leadership.", freyrDifferentiation: "Implementation and managed operations on top of platforms.", confidence: "Inferred" },
    { name: "Cognizant", possibleServiceArea: "Life-sciences IT and operations", strength: "IT and BPO scale.", freyrDifferentiation: "Embedded device-regulatory expertise.", confidence: "Inferred" },
  ],

  strategy: {
    bestEntryPoint: "VP Regulatory Affairs or Head of Quality, anchored on MDR/IVDR sustaining and registration scale.",
    entryRationale: "MDR/IVDR sustaining and global registration volume are concrete, ongoing pains a device leader feels directly.",
    firstConversationStrategy: "Lead with MDR/IVDR sustaining capacity and registration throughput, then connect to quality and validation.",
    landAndExpand: "Start with a registration or device-regulatory scope, prove throughput, then expand into quality, CSV/CSA, and labeling.",
    crossSell: ["Quality & audit support", "CSV/CSA for connected products", "Device labeling / IFU", "Managed-service pods"],
    objections: ["Strong internal RA/QA", "Notified-body relationships", "Device-specific expertise concerns"],
    differentiation: "Device-regulatory and registration execution at scale, with quality and CSV depth versus generalist providers.",
    actionPlan: [
      { horizon: "30 days", action: "Reach RA/QA leadership; size MDR/IVDR sustaining and registration backlog." },
      { horizon: "60 days", action: "Propose a registration or sustaining pilot with throughput and compliance metrics." },
      { horizon: "90 days", action: "Deliver pilot; expand into quality, CSV/CSA, and labeling." },
    ],
  },

  sources: [
    src("FY annual report (10-K)", "Annual Report"),
    src("Company website — products & locations", "Company Website"),
    src("Industry analysis — MDR/IVDR impact", "Inferred Analysis"),
    src("Regulatory database — device approvals", "Regulatory Filing"),
  ],
};
