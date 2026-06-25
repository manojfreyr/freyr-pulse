/** Client-safe export deliverable/format definitions (no server deps). */

export type Deliverable = "account-brief" | "exec-summary" | "meeting-prep" | "outreach-pack";
export type ExportFormat = "pdf" | "pptx" | "docx";

/** Which formats each deliverable supports (server-enforced + UI-driven). */
export const FORMAT_MATRIX: Record<Deliverable, ExportFormat[]> = {
  "account-brief": ["pdf", "pptx", "docx"],
  "exec-summary": ["pdf", "pptx"],
  "meeting-prep": ["pdf", "docx"],
  "outreach-pack": ["docx", "pdf"],
};

export const DELIVERABLE_LABEL: Record<Deliverable, string> = {
  "account-brief": "Account Brief",
  "exec-summary": "Executive Summary",
  "meeting-prep": "Meeting Prep",
  "outreach-pack": "Outreach Pack",
};

export const FORMAT_LABEL: Record<ExportFormat, string> = {
  pdf: "PDF",
  pptx: "PowerPoint",
  docx: "Word",
};

/** Meeting Prep is persona-specific. */
export function deliverableUsesPersona(d: Deliverable): boolean {
  return d === "meeting-prep";
}
