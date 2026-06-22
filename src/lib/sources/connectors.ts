import type { Company } from "@/lib/types";

/**
 * Future-ready data-source architecture. Phase 1 implements NO live calls —
 * these are clean interfaces and placeholder connectors so Phase 2 can plug in
 * real sources without changing the rest of the app. Each connector maps an
 * external source INTO the app's Company model (or a partial of it).
 */
export type DataSourceId =
  | "company-website"
  | "sec-filings"
  | "fda"
  | "ema"
  | "clinicaltrials"
  | "news"
  | "linkedin"
  | "zoominfo"
  | "crunchbase"
  | "pitchbook"
  | "crm"
  | "msa-database"
  | "freyr-history";

export type ConnectorStatus = "planned" | "beta" | "available";

export interface ConnectorResult {
  /** Partial company data this source can contribute, mapped to our model. */
  partial: Partial<Company>;
  retrievedAt: string;
  notes?: string;
}

export interface DataSourceConnector {
  id: DataSourceId;
  label: string;
  category: "Public/Regulatory" | "News & Web" | "Commercial Intelligence" | "Internal Freyr";
  description: string;
  status: ConnectorStatus;
  /** Phase 1: always rejects with a not-implemented error. */
  fetchCompanyData(query: { name?: string; website?: string }): Promise<ConnectorResult>;
}

/** Shared Phase 1 implementation: declared but not yet wired to a live API. */
function placeholderConnector(
  id: DataSourceId,
  label: string,
  category: DataSourceConnector["category"],
  description: string,
): DataSourceConnector {
  return {
    id,
    label,
    category,
    description,
    status: "planned",
    async fetchCompanyData() {
      throw new Error(`[Phase 2] Connector "${label}" is not implemented yet.`);
    },
  };
}

export const CONNECTORS: DataSourceConnector[] = [
  placeholderConnector("company-website", "Company Website", "News & Web", "Firmographics, pipeline, and locations from the corporate site."),
  placeholderConnector("sec-filings", "SEC Filings", "Public/Regulatory", "10-K/10-Q/8-K financials, risk factors, and segment data."),
  placeholderConnector("fda", "FDA", "Public/Regulatory", "Approvals, submissions, warning letters, and recalls (US)."),
  placeholderConnector("ema", "EMA", "Public/Regulatory", "European approvals, procedures, and product information."),
  placeholderConnector("clinicaltrials", "ClinicalTrials.gov", "Public/Regulatory", "Pipeline and trial activity by sponsor and indication."),
  placeholderConnector("news", "News", "News & Web", "Recent events, M&A, launches, and leadership changes."),
  placeholderConnector("linkedin", "LinkedIn", "Commercial Intelligence", "Headcount, hiring signals, and decision-maker mapping."),
  placeholderConnector("zoominfo", "ZoomInfo", "Commercial Intelligence", "Contacts, org charts, and firmographic enrichment."),
  placeholderConnector("crunchbase", "Crunchbase", "Commercial Intelligence", "Funding, investors, and company milestones."),
  placeholderConnector("pitchbook", "PitchBook", "Commercial Intelligence", "Private-market financials, deals, and ownership."),
  placeholderConnector("crm", "Internal CRM", "Internal Freyr", "Existing relationship, account owner, and opportunity history."),
  placeholderConnector("msa-database", "Contract / MSA Database", "Internal Freyr", "MSA status, preferred-vendor flags, and contract terms."),
  placeholderConnector("freyr-history", "Freyr Project History", "Internal Freyr", "Past engagements, delivered services, and satisfaction."),
];

export const CONNECTOR_BY_ID: Record<DataSourceId, DataSourceConnector> = Object.fromEntries(
  CONNECTORS.map((c) => [c.id, c]),
) as Record<DataSourceId, DataSourceConnector>;

/**
 * Phase 2 entry point (stubbed). Will fan out to enabled connectors, merge their
 * partials into a Company, and return a profile with per-field confidence. For
 * now it signals that live research isn't available yet.
 */
export async function researchCompany(_query: { name?: string; website?: string }): Promise<never> {
  throw new Error("Live company research is planned for Phase 2. Create a placeholder profile for now.");
}
