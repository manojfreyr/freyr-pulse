import type { FreyrService, PersonaId, ServiceCategory, TriggerType } from "@/lib/types";

const SEED_DATE = "2026-01-15";

const DEFAULT_DIFF = [
  "Regulatory-specialist focus rather than generalist consulting",
  "Flexible managed-service commercials that flex with demand",
  "Technology-enabled, audit-ready delivery",
];
const DEFAULT_RULES = [
  "Confidence rises when ≥2 company signals match (Phase 2: weighted scoring).",
  "Direct pain-point match → boost relevance.",
];

function svc(p: {
  id: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  serviceLine: string;
  description: string;
  targetPersonas: PersonaId[];
  painPointsSolved: string[];
  buyingTriggers: TriggerType[];
  keywords: string[];
  relevantCompanySignals: string[];
  exampleOpeningMessage: string;
  relatedServices?: string[];
  differentiationPoints?: string[];
  confidenceRules?: string[];
  activeStatus?: boolean;
}): FreyrService {
  return {
    relatedServices: [],
    differentiationPoints: DEFAULT_DIFF,
    confidenceRules: DEFAULT_RULES,
    activeStatus: true,
    lastUpdated: SEED_DATE,
    ...p,
  };
}

/**
 * Seed catalogue. This is the *default* set; the live, editable catalogue lives
 * in localStorage (see src/lib/store/serviceCatalog.ts) and is initialised from
 * this seed. Structured so it can move to a database later with no shape change.
 */
export const FREYR_SERVICES: FreyrService[] = [
  svc({
    id: "reg-affairs", serviceName: "Global Regulatory Affairs", serviceCategory: "Regulatory Affairs", serviceLine: "Regulatory",
    description: "End-to-end regulatory support across regions and product types.",
    targetPersonas: ["vp-regulatory-affairs", "director-regulatory-operations"],
    painPointsSolved: ["Uneven workload peaks", "Inconsistent regional execution", "Pipeline growth without headcount"],
    buyingTriggers: ["Product Launch", "Geographic Expansion", "M&A"],
    keywords: ["regulatory affairs", "global", "filings", "lifecycle"],
    relevantCompanySignals: ["global", "enterprise", "broad portfolio", "multiple markets"],
    relatedServices: ["reg-strategy", "reg-ops", "local-ra"],
    exampleOpeningMessage: "We add global regulatory execution depth so your team can focus on strategy and the agencies.",
  }),
  svc({
    id: "reg-strategy", serviceName: "Regulatory Strategy & Advisory", serviceCategory: "Regulatory Strategy", serviceLine: "Regulatory",
    description: "Filing strategy, agency interactions, and lifecycle planning.",
    targetPersonas: ["vp-regulatory-affairs", "ceo-business-unit"],
    painPointsSolved: ["Novel-modality pathways", "Complex filing strategy", "New therapeutic areas"],
    buyingTriggers: ["Clinical Update", "Product Launch", "Partnership"],
    keywords: ["strategy", "pathway", "cell therapy", "novel modality", "oncology"],
    relevantCompanySignals: ["oncology", "cell therapy", "pipeline", "new modality", "pivot"],
    relatedServices: ["reg-affairs", "med-writing", "market-access"],
    exampleOpeningMessage: "We bring filing-strategy depth for complex and novel-modality programs.",
  }),
  svc({
    id: "reg-ops", serviceName: "Regulatory Operations", serviceCategory: "Regulatory Operations", serviceLine: "Regulatory",
    description: "Operational execution of submissions, dossiers, and lifecycle activities.",
    targetPersonas: ["director-regulatory-operations", "vp-regulatory-affairs"],
    painPointsSolved: ["Submission backlog at peaks", "Operational capacity strain", "Rework in execution"],
    buyingTriggers: ["M&A", "Product Launch", "Restructuring"],
    keywords: ["operations", "submissions", "capacity", "throughput"],
    relevantCompanySignals: ["high submission volume", "m&a", "integration", "enterprise", "global"],
    relatedServices: ["submissions", "publishing", "rim", "vmo"],
    exampleOpeningMessage: "We provide scalable regulatory operations capacity that absorbs peaks without hiring.",
  }),
  svc({
    id: "submissions", serviceName: "Submission Management & eCTD", serviceCategory: "Submissions", serviceLine: "Regulatory",
    description: "Compilation, validation, and management of global submissions.",
    targetPersonas: ["director-regulatory-operations"],
    painPointsSolved: ["First-time multi-product submission load", "Submission backlog", "Validation errors"],
    buyingTriggers: ["Product Launch", "Regulatory Approval"],
    keywords: ["ectd", "submission", "dossier", "publishing"],
    relevantCompanySignals: ["pipeline", "multi-product", "launches", "scaling"],
    relatedServices: ["publishing", "reg-ops", "rim"],
    exampleOpeningMessage: "We help fast-scaling teams stand up submission capacity without a hiring spree.",
  }),
  svc({
    id: "publishing", serviceName: "Electronic Publishing", serviceCategory: "Publishing", serviceLine: "Regulatory",
    description: "eCTD publishing, validation, and gateway dispatch.",
    targetPersonas: ["director-regulatory-operations"],
    painPointsSolved: ["Manual publishing steps", "Rework in publishing", "Peak-load bottlenecks"],
    buyingTriggers: ["Product Launch"],
    keywords: ["publishing", "ectd", "validation", "gateway"],
    relevantCompanySignals: ["high submission volume", "launches"],
    relatedServices: ["submissions", "reg-ops"],
    exampleOpeningMessage: "A managed pod absorbs publishing surges so your team isn't the bottleneck.",
  }),
  svc({
    id: "labeling", serviceName: "Global Labeling Management", serviceCategory: "Labeling", serviceLine: "Labeling & Artwork",
    description: "CCDS, local label derivation, and labeling lifecycle control.",
    targetPersonas: ["head-of-labeling", "vp-regulatory-affairs"],
    painPointsSolved: ["Slow CCDS-to-local derivation", "Label inconsistency across markets", "Labeling compliance risk"],
    buyingTriggers: ["Regulatory Approval", "Product Launch", "Geographic Expansion"],
    keywords: ["labeling", "ccds", "label", "ifu", "harmonisation"],
    relevantCompanySignals: ["broad portfolio", "global", "many markets", "multiple products"],
    relatedServices: ["artwork", "reg-ops"],
    exampleOpeningMessage: "We cut CCDS-to-local label turnaround and tighten consistency across regions.",
  }),
  svc({
    id: "artwork", serviceName: "Artwork & Packaging Management", serviceCategory: "Artwork", serviceLine: "Labeling & Artwork",
    description: "Artwork change control, proofing, and packaging compliance.",
    targetPersonas: ["head-of-labeling"],
    painPointsSolved: ["Artwork change bottlenecks", "Packaging compliance exposure"],
    buyingTriggers: ["Product Launch", "Regulatory Approval"],
    keywords: ["artwork", "packaging", "proofing", "change control"],
    relevantCompanySignals: ["broad portfolio", "many markets"],
    relatedServices: ["labeling"],
    exampleOpeningMessage: "We tighten artwork change control so updates land faster and cleaner.",
  }),
  svc({
    id: "reg-intel", serviceName: "Regulatory Intelligence", serviceCategory: "Regulatory Intelligence", serviceLine: "Regulatory",
    description: "Tracking of evolving global requirements and impact analysis.",
    targetPersonas: ["vp-regulatory-affairs", "director-regulatory-operations"],
    painPointsSolved: ["Visibility gaps across markets", "Keeping up with changing requirements"],
    buyingTriggers: ["Geographic Expansion", "Regulatory Approval"],
    keywords: ["intelligence", "requirements", "monitoring", "impact"],
    relevantCompanySignals: ["global", "many markets", "expansion"],
    relatedServices: ["reg-strategy"],
    exampleOpeningMessage: "We keep you ahead of changing global requirements with impact analysis.",
  }),
  svc({
    id: "rim", serviceName: "Regulatory Information Management (RIM)", serviceCategory: "RIM", serviceLine: "Technology",
    description: "RIM implementation, data migration, and managed RIM operations.",
    targetPersonas: ["director-regulatory-operations", "cio-digital"],
    painPointsSolved: ["RIM data fragmentation", "Post-acquisition data harmonisation", "Low system adoption"],
    buyingTriggers: ["M&A", "Digital Transformation"],
    keywords: ["rim", "data", "migration", "veeva", "harmonisation"],
    relevantCompanySignals: ["m&a", "integration", "digital transformation", "data silos"],
    relatedServices: ["tech-platforms", "reg-ops", "ai-reg"],
    exampleOpeningMessage: "We migrate and run RIM after acquisitions so your data scales cleanly.",
  }),
  svc({
    id: "med-writing", serviceName: "Medical & Regulatory Writing", serviceCategory: "Medical Writing", serviceLine: "Medical & Safety",
    description: "Clinical, regulatory, and scientific document authoring.",
    targetPersonas: ["vp-regulatory-affairs"],
    painPointsSolved: ["Authoring capacity for complex filings", "Bottlenecks in document production"],
    buyingTriggers: ["Clinical Update", "Product Launch"],
    keywords: ["medical writing", "authoring", "clinical", "dossier"],
    relevantCompanySignals: ["oncology", "complex filings", "pipeline"],
    relatedServices: ["reg-strategy", "submissions"],
    exampleOpeningMessage: "We add regulatory writing capacity for complex submissions.",
  }),
  svc({
    id: "pv", serviceName: "Pharmacovigilance & Drug Safety", serviceCategory: "Pharmacovigilance", serviceLine: "Medical & Safety",
    description: "Case processing, signal management, and aggregate reporting.",
    targetPersonas: ["head-of-pharmacovigilance"],
    painPointsSolved: ["Rising case volume", "PV cost pressure", "Compliance risk on reporting", "Scaling PV for launches"],
    buyingTriggers: ["Product Launch", "Geographic Expansion", "Clinical Update"],
    keywords: ["pharmacovigilance", "pv", "safety", "icsr", "signal"],
    relevantCompanySignals: ["marketed portfolio", "launches", "new modality", "cell therapy"],
    relatedServices: ["med-info"],
    exampleOpeningMessage: "We scale case processing and reporting with strong compliance discipline.",
  }),
  svc({
    id: "med-info", serviceName: "Medical Information Services", serviceCategory: "Medical Information", serviceLine: "Medical & Safety",
    description: "Medical inquiry handling and contact-centre support.",
    targetPersonas: ["head-of-pharmacovigilance"],
    painPointsSolved: ["Medical inquiry response times", "Launch-driven inquiry volume"],
    buyingTriggers: ["Product Launch"],
    keywords: ["medical information", "inquiry", "contact centre"],
    relevantCompanySignals: ["marketed portfolio", "launches"],
    relatedServices: ["pv"],
    exampleOpeningMessage: "We handle medical inquiries at launch scale so your team isn't overwhelmed.",
  }),
  svc({
    id: "market-access", serviceName: "Market Access & HEOR", serviceCategory: "Market Access", serviceLine: "Commercial & Access",
    description: "Value dossiers, HTA support, and reimbursement strategy.",
    targetPersonas: ["ceo-business-unit", "vp-regulatory-affairs"],
    painPointsSolved: ["Reimbursement strategy gaps", "HTA evidence needs"],
    buyingTriggers: ["Product Launch", "Geographic Expansion"],
    keywords: ["market access", "heor", "hta", "reimbursement", "value"],
    relevantCompanySignals: ["launches", "new markets", "specialty"],
    relatedServices: ["reg-strategy"],
    exampleOpeningMessage: "We build value dossiers and HTA evidence to speed reimbursement.",
  }),
  svc({
    id: "quality", serviceName: "Quality & Compliance", serviceCategory: "Quality & Compliance", serviceLine: "Quality & Compliance",
    description: "GxP quality systems, compliance, and inspection readiness.",
    targetPersonas: ["head-of-quality"],
    painPointsSolved: ["Inspection readiness gaps", "Quality integration burden", "Stretched quality teams"],
    buyingTriggers: ["M&A", "Warning Letter", "Regulatory Approval"],
    keywords: ["quality", "gxp", "compliance", "inspection", "capa"],
    relevantCompanySignals: ["manufacturing", "device", "warning letter", "integration", "global sites"],
    relatedServices: ["gxp-audits", "sop", "qms"],
    exampleOpeningMessage: "We boost inspection readiness and quality capacity across sites and suppliers.",
  }),
  svc({
    id: "gxp-audits", serviceName: "GxP Audits & Inspection Readiness", serviceCategory: "GxP Audits", serviceLine: "Quality & Compliance",
    description: "Supplier, internal, and for-cause audits across GxP.",
    targetPersonas: ["head-of-quality"],
    painPointsSolved: ["Audit backlog", "Low supplier-audit coverage"],
    buyingTriggers: ["Warning Letter", "M&A"],
    keywords: ["audit", "gxp", "supplier", "inspection"],
    relevantCompanySignals: ["manufacturing", "global sites", "warning letter"],
    relatedServices: ["quality"],
    exampleOpeningMessage: "We expand audit coverage so inspection readiness keeps pace with your footprint.",
  }),
  svc({
    id: "csv-csa", serviceName: "Computer System Validation (CSV/CSA)", serviceCategory: "CSV / CSA", serviceLine: "Quality & Compliance",
    description: "Validation of GxP systems using risk-based CSA approaches.",
    targetPersonas: ["head-of-quality", "cio-digital"],
    painPointsSolved: ["Validation debt", "Over-validation slowing change", "Connected-product validation scope"],
    buyingTriggers: ["Digital Transformation"],
    keywords: ["csv", "csa", "validation", "gxp", "connected"],
    relevantCompanySignals: ["device", "connected", "digital", "software", "samd"],
    relatedServices: ["quality", "tech-platforms"],
    exampleOpeningMessage: "We clear validation debt with risk-based CSA for connected and digital systems.",
  }),
  svc({
    id: "sop", serviceName: "SOP Writing & Review", serviceCategory: "SOP Writing & Review", serviceLine: "Quality & Compliance",
    description: "Authoring, harmonisation, and periodic review of SOPs.",
    targetPersonas: ["head-of-quality"],
    painPointsSolved: ["Outdated or inconsistent SOPs", "SOP harmonisation after M&A"],
    buyingTriggers: ["M&A", "Restructuring"],
    keywords: ["sop", "procedures", "harmonisation"],
    relevantCompanySignals: ["integration", "global sites"],
    relatedServices: ["quality", "qms"],
    exampleOpeningMessage: "We refresh and harmonise your SOP library so it's current and consistent.",
  }),
  svc({
    id: "qms", serviceName: "QMS Implementation & Support", serviceCategory: "QMS Support", serviceLine: "Quality & Compliance",
    description: "QMS design, deployment, and ongoing quality operations.",
    targetPersonas: ["head-of-quality", "cio-digital"],
    painPointsSolved: ["QMS gaps", "Quality operations capacity"],
    buyingTriggers: ["M&A", "Digital Transformation"],
    keywords: ["qms", "quality system", "deployment"],
    relevantCompanySignals: ["manufacturing", "integration", "digital"],
    relatedServices: ["quality", "csv-csa"],
    exampleOpeningMessage: "We design and run a QMS that scales with your operations.",
  }),
  svc({
    id: "med-devices", serviceName: "Medical Device Regulatory", serviceCategory: "Medical Devices", serviceLine: "Regulatory",
    description: "MDR/IVDR, 510(k)/PMA, and device lifecycle regulatory support.",
    targetPersonas: ["vp-regulatory-affairs", "head-of-quality"],
    painPointsSolved: ["MDR/IVDR sustaining burden", "Device submission complexity"],
    buyingTriggers: ["Regulatory Approval", "Product Launch"],
    keywords: ["mdr", "ivdr", "510k", "pma", "device", "samd"],
    relevantCompanySignals: ["device", "medtech", "mdr/ivdr", "implantable", "diagnostics"],
    relatedServices: ["combination", "quality", "product-reg"],
    exampleOpeningMessage: "We provide device-regulatory capacity for MDR/IVDR and sustaining work at scale.",
  }),
  svc({
    id: "combination", serviceName: "Combination Products Regulatory", serviceCategory: "Combination Products", serviceLine: "Regulatory",
    description: "Drug-device combination strategy and submissions.",
    targetPersonas: ["vp-regulatory-affairs"],
    painPointsSolved: ["Combination-product complexity", "Bridging drug and device pathways"],
    buyingTriggers: ["Product Launch", "Clinical Update"],
    keywords: ["combination", "drug-device", "delivery", "autoinjector"],
    relevantCompanySignals: ["device", "biologic", "delivery", "diabetes", "injectable"],
    relatedServices: ["med-devices", "reg-strategy"],
    exampleOpeningMessage: "We handle combination-product strategy bridging device and drug pathways.",
  }),
  svc({
    id: "local-ra", serviceName: "Local / In-Country Regulatory Affairs", serviceCategory: "Local Regulatory Affairs", serviceLine: "Regulatory",
    description: "In-country representation and local submission management.",
    targetPersonas: ["vp-regulatory-affairs", "director-regulatory-operations"],
    painPointsSolved: ["Local market coverage", "In-country representation"],
    buyingTriggers: ["Geographic Expansion"],
    keywords: ["local", "in-country", "representation", "emerging markets"],
    relevantCompanySignals: ["expansion", "emerging markets", "global"],
    relatedServices: ["product-reg", "reg-affairs"],
    exampleOpeningMessage: "We provide in-country regulatory coverage as you enter new markets.",
  }),
  svc({
    id: "product-reg", serviceName: "Product Registration", serviceCategory: "Product Registration", serviceLine: "Regulatory",
    description: "New and maintenance registrations across emerging and mature markets.",
    targetPersonas: ["director-regulatory-operations"],
    painPointsSolved: ["High registration volume", "Renewal management", "Biosimilar/device registration scale"],
    buyingTriggers: ["Geographic Expansion", "Product Launch", "Regulatory Approval"],
    keywords: ["registration", "renewal", "biosimilar", "device"],
    relevantCompanySignals: ["biosimilar", "device", "many markets", "expansion", "broad portfolio"],
    relatedServices: ["local-ra", "labeling"],
    exampleOpeningMessage: "We run high-volume global registrations so rollouts stay on schedule.",
  }),
  svc({
    id: "tech-platforms", serviceName: "Regulatory Technology Platforms", serviceCategory: "Technology Platforms", serviceLine: "Technology",
    description: "Freyr's regulatory tech stack for RIM, labeling, and submissions.",
    targetPersonas: ["cio-digital", "director-regulatory-operations"],
    painPointsSolved: ["Legacy systems and silos", "Slow platform implementations"],
    buyingTriggers: ["Digital Transformation"],
    keywords: ["platform", "technology", "rim", "automation"],
    relevantCompanySignals: ["digital transformation", "data silos", "automation"],
    relatedServices: ["rim", "ai-reg", "csv-csa"],
    exampleOpeningMessage: "We pair regulatory platforms with the domain expertise to adopt them.",
  }),
  svc({
    id: "ai-reg", serviceName: "AI-enabled Regulatory Solutions", serviceCategory: "AI-enabled Regulatory Solutions", serviceLine: "Technology",
    description: "AI-assisted authoring, data extraction, and intelligence.",
    targetPersonas: ["cio-digital", "vp-regulatory-affairs"],
    painPointsSolved: ["Doing more with a lean team", "Productivity without compliance risk"],
    buyingTriggers: ["Digital Transformation", "Restructuring"],
    keywords: ["ai", "automation", "authoring", "extraction", "intelligence"],
    relevantCompanySignals: ["digital transformation", "innovation", "lean team", "cost discipline"],
    relatedServices: ["tech-platforms", "rim", "med-writing"],
    exampleOpeningMessage: "We bring validated, human-in-the-loop AI to regulatory authoring and intelligence.",
  }),
  svc({
    id: "vmo", serviceName: "VMO Staffing & Managed Services", serviceCategory: "VMO / Managed Services", serviceLine: "Managed Services",
    description: "Flexible managed-service pods and embedded regulatory capacity.",
    targetPersonas: ["procurement-leader", "vp-regulatory-affairs"],
    painPointsSolved: ["Vendor fragmentation", "Variable demand", "Capacity flexibility"],
    buyingTriggers: ["Vendor Consolidation", "Restructuring", "M&A"],
    keywords: ["managed services", "vmo", "staffing", "consolidation", "flexible"],
    relevantCompanySignals: ["enterprise", "cost discipline", "vendor consolidation", "variable demand", "m&a"],
    relatedServices: ["reg-ops", "pv"],
    exampleOpeningMessage: "A managed-service model consolidates fragmented spend and flexes with demand.",
  }),
];

export const SERVICE_BY_ID: Record<string, FreyrService> = Object.fromEntries(
  FREYR_SERVICES.map((s) => [s.id, s]),
);

/** Distinct service lines, in display order. */
export const SERVICE_LINES: string[] = Array.from(new Set(FREYR_SERVICES.map((s) => s.serviceLine)));

/** Distinct categories present in the seed. */
export const SERVICE_CATEGORIES: ServiceCategory[] = Array.from(
  new Set(FREYR_SERVICES.map((s) => s.serviceCategory)),
) as ServiceCategory[];
