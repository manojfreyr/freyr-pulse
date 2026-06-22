import type { FreyrService } from "@/lib/types";

/**
 * Freyr service catalogue (company-independent).
 * Company profiles reference these by `id` in their serviceRecommendations
 * and painPoints, so a service's wording lives in exactly one place.
 */
export const FREYR_SERVICES: FreyrService[] = [
  {
    id: "reg-affairs",
    category: "Regulatory Affairs",
    name: "Global Regulatory Affairs",
    shortDescription: "End-to-end regulatory support across regions and product types.",
    typicalBuyers: ["vp-regulatory-affairs", "director-regulatory-operations"],
  },
  {
    id: "reg-strategy",
    category: "Regulatory Strategy",
    name: "Regulatory Strategy & Advisory",
    shortDescription: "Filing strategy, agency interactions, and lifecycle planning.",
    typicalBuyers: ["vp-regulatory-affairs", "ceo-business-unit"],
  },
  {
    id: "reg-ops",
    category: "Regulatory Operations",
    name: "Regulatory Operations",
    shortDescription: "Operational execution of submissions, dossiers, and lifecycle activities.",
    typicalBuyers: ["director-regulatory-operations", "vp-regulatory-affairs"],
  },
  {
    id: "submissions",
    category: "Submissions",
    name: "Submission Management & eCTD",
    shortDescription: "Compilation, validation, and management of global submissions.",
    typicalBuyers: ["director-regulatory-operations"],
  },
  {
    id: "publishing",
    category: "Publishing",
    name: "Electronic Publishing",
    shortDescription: "eCTD publishing, validation, and gateway dispatch.",
    typicalBuyers: ["director-regulatory-operations"],
  },
  {
    id: "labeling",
    category: "Labeling",
    name: "Global Labeling Management",
    shortDescription: "CCDS, local label derivation, and labeling lifecycle control.",
    typicalBuyers: ["head-of-labeling", "vp-regulatory-affairs"],
  },
  {
    id: "artwork",
    category: "Artwork",
    name: "Artwork & Packaging Management",
    shortDescription: "Artwork change control, proofing, and packaging compliance.",
    typicalBuyers: ["head-of-labeling"],
  },
  {
    id: "reg-intel",
    category: "Regulatory Intelligence",
    name: "Regulatory Intelligence",
    shortDescription: "Tracking of evolving global requirements and impact analysis.",
    typicalBuyers: ["vp-regulatory-affairs", "director-regulatory-operations"],
  },
  {
    id: "rim",
    category: "RIM",
    name: "Regulatory Information Management (RIM)",
    shortDescription: "RIM implementation, data migration, and managed RIM operations.",
    typicalBuyers: ["director-regulatory-operations", "cio-digital"],
  },
  {
    id: "med-writing",
    category: "Medical Writing",
    name: "Medical & Regulatory Writing",
    shortDescription: "Clinical, regulatory, and scientific document authoring.",
    typicalBuyers: ["vp-regulatory-affairs"],
  },
  {
    id: "pv",
    category: "Pharmacovigilance",
    name: "Pharmacovigilance & Drug Safety",
    shortDescription: "Case processing, signal management, and aggregate reporting.",
    typicalBuyers: ["head-of-pharmacovigilance"],
  },
  {
    id: "med-info",
    category: "Medical Information",
    name: "Medical Information Services",
    shortDescription: "Medical inquiry handling and contact-centre support.",
    typicalBuyers: ["head-of-pharmacovigilance"],
  },
  {
    id: "market-access",
    category: "Market Access",
    name: "Market Access & HEOR",
    shortDescription: "Value dossiers, HTA support, and reimbursement strategy.",
    typicalBuyers: ["ceo-business-unit", "vp-regulatory-affairs"],
  },
  {
    id: "quality",
    category: "Quality & Compliance",
    name: "Quality & Compliance",
    shortDescription: "GxP quality systems, compliance, and inspection readiness.",
    typicalBuyers: ["head-of-quality"],
  },
  {
    id: "gxp-audits",
    category: "GxP Audits",
    name: "GxP Audits & Inspection Readiness",
    shortDescription: "Supplier, internal, and for-cause audits across GxP.",
    typicalBuyers: ["head-of-quality"],
  },
  {
    id: "csv-csa",
    category: "CSV / CSA",
    name: "Computer System Validation (CSV/CSA)",
    shortDescription: "Validation of GxP systems using risk-based CSA approaches.",
    typicalBuyers: ["head-of-quality", "cio-digital"],
  },
  {
    id: "sop",
    category: "SOP Writing & Review",
    name: "SOP Writing & Review",
    shortDescription: "Authoring, harmonisation, and periodic review of SOPs.",
    typicalBuyers: ["head-of-quality"],
  },
  {
    id: "qms",
    category: "QMS Support",
    name: "QMS Implementation & Support",
    shortDescription: "QMS design, deployment, and ongoing quality operations.",
    typicalBuyers: ["head-of-quality", "cio-digital"],
  },
  {
    id: "med-devices",
    category: "Medical Devices",
    name: "Medical Device Regulatory",
    shortDescription: "MDR/IVDR, 510(k)/PMA, and device lifecycle regulatory support.",
    typicalBuyers: ["vp-regulatory-affairs", "head-of-quality"],
  },
  {
    id: "combination",
    category: "Combination Products",
    name: "Combination Products Regulatory",
    shortDescription: "Drug-device combination strategy and submissions.",
    typicalBuyers: ["vp-regulatory-affairs"],
  },
  {
    id: "local-ra",
    category: "Local Regulatory Affairs",
    name: "Local / In-Country Regulatory Affairs",
    shortDescription: "In-country representation and local submission management.",
    typicalBuyers: ["vp-regulatory-affairs", "director-regulatory-operations"],
  },
  {
    id: "product-reg",
    category: "Product Registration",
    name: "Product Registration",
    shortDescription: "New and maintenance registrations across emerging and mature markets.",
    typicalBuyers: ["director-regulatory-operations"],
  },
  {
    id: "tech-platforms",
    category: "Technology Platforms",
    name: "Regulatory Technology Platforms",
    shortDescription: "Freyr's regulatory tech stack for RIM, labeling, and submissions.",
    typicalBuyers: ["cio-digital", "director-regulatory-operations"],
  },
  {
    id: "ai-reg",
    category: "AI-enabled Regulatory Solutions",
    name: "AI-enabled Regulatory Solutions",
    shortDescription: "AI-assisted authoring, data extraction, and intelligence.",
    typicalBuyers: ["cio-digital", "vp-regulatory-affairs"],
  },
  {
    id: "vmo",
    category: "VMO / Managed Services",
    name: "VMO Staffing & Managed Services",
    shortDescription: "Flexible managed-service pods and embedded regulatory capacity.",
    typicalBuyers: ["procurement-leader", "vp-regulatory-affairs"],
  },
];

export const SERVICE_BY_ID: Record<string, FreyrService> = Object.fromEntries(
  FREYR_SERVICES.map((s) => [s.id, s]),
);
