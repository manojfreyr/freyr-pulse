/**
 * Curated, deterministic lookup tables for Opportunity Intelligence.
 * Editable like the Service Catalog; no LLM, no external data.
 */

/** "Why it matters" text for connector-signal triggers (substring key match). */
export const TRIGGER_WHY: { pat: string; why: string }[] = [
  { pat: "upcoming submission", why: "A trial nearing primary completion signals an upcoming NDA/BLA/MAA — prime time for dossier, publishing and RIM support." },
  { pat: "post-approval", why: "A recent approval triggers post-market obligations: labeling maintenance, pharmacovigilance and lifecycle management." },
  { pat: "product launch", why: "A new product launch creates immediate regulatory and lifecycle workload." },
  { pat: "device launch", why: "A recent device clearance brings MDR/IVDR, technical documentation and post-market surveillance needs." },
  { pat: "recall", why: "A recall indicates compliance pressure — an urgent opening for remediation and quality support." },
  { pat: "compliance pressure", why: "Recent enforcement activity signals quality/compliance gaps Freyr can help remediate." },
  { pat: "late-stage program", why: "A late-stage program implies near-term submission planning and regulatory strategy needs." },
  { pat: "trial start", why: "A new trial start points to early regulatory strategy and IND/CTA support." },
];

export function triggerWhy(key: string): string | undefined {
  const k = key.toLowerCase();
  for (const r of TRIGGER_WHY) if (k.includes(r.pat)) return r.why;
  return undefined;
}

/**
 * Maturity rules, evaluated against the company's signal keys. Highest-priority
 * matched stage becomes primary; others become secondary tags. Order = priority.
 */
export const MATURITY_RULES: { stage: string; keys: string[] }[] = [
  { stage: "Remediation", keys: ["recall", "compliance pressure", "warning letter"] },
  { stage: "Pre-submission", keys: ["upcoming submission"] },
  { stage: "Commercial", keys: ["post-approval", "product launch", "approved products"] },
  { stage: "Post-market", keys: ["device launch", "device", "medtech", "mdr/ivdr"] },
  { stage: "Late clinical", keys: ["late-stage program", "phase 3 program"] },
  { stage: "Early clinical", keys: ["phase 1 program", "phase 2 program", "active clinical pipeline", "large clinical pipeline"] },
];

/** Freyr capability differentiators keyed to signal/maturity patterns. Capability
 *  positioning only — never named-competitor claims. */
export const DIFFERENTIATORS: { keys: string[]; title: string; positioning: string }[] = [
  { keys: ["multi-region trials", "global"], title: "Global regulatory coverage", positioning: "Freyr operates across 100+ countries — well suited to multi-region submissions and global labeling." },
  { keys: ["recall", "compliance pressure", "warning letter"], title: "Remediation & compliance", positioning: "Freyr's quality and remediation teams help resolve enforcement actions and close compliance gaps." },
  { keys: ["cell therapy", "gene therapy"], title: "Advanced-therapy (ATMP) expertise", positioning: "Specialist regulatory experience for cell and gene therapy programs." },
  { keys: ["large clinical pipeline", "active clinical pipeline"], title: "Managed regulatory operations at scale", positioning: "VMO and managed services to run high-volume regulatory operations." },
  { keys: ["upcoming submission", "late-stage program", "phase 3 program"], title: "Submission & dossier excellence", positioning: "End-to-end dossier authoring, publishing and RIM for filings." },
  { keys: ["device", "medtech", "mdr/ivdr", "device launch"], title: "Device regulatory (MDR/IVDR)", positioning: "Full medical-device and IVD regulatory support across regions." },
  { keys: ["post-approval", "product launch", "approved products"], title: "Lifecycle & pharmacovigilance", positioning: "Post-approval labeling maintenance, pharmacovigilance and lifecycle management." },
];

/** Primary next-best-action template by maturity stage. {persona}/{trigger} filled at runtime. */
export const NBA_BY_MATURITY: Record<string, string> = {
  "Remediation": "Engage {persona} immediately on remediation and quality/compliance support — reference {trigger}.",
  "Pre-submission": "Engage {persona} with a submission-readiness point of view — lead with {trigger} and propose a dossier-prep discovery call.",
  "Commercial": "Engage {persona} on post-approval lifecycle (labeling, pharmacovigilance) — reference {trigger}.",
  "Post-market": "Engage {persona} on device post-market and MDR/IVDR obligations — reference {trigger}.",
  "Late clinical": "Open with {persona} on late-stage regulatory strategy and submission planning — reference {trigger}.",
  "Early clinical": "Engage {persona} on early regulatory strategy and IND/CTA support.",
  "Pre-clinical": "Run live research to qualify the account, then engage {persona} on regulatory strategy.",
  "Unknown": "Run live research to qualify the account, then engage {persona}.",
};
