import type { CompanySignal, SourceCitation } from "@/lib/types";

/** Input a connector needs to research a company. */
export interface EnrichInput {
  id: string;
  name: string;
  website?: string;
  aliases?: string[];
}

/** A connector's contribution: signals (each carrying its own citations) plus
 *  a flat citation list and human-readable notes (e.g. "no SEC match"). */
export interface ConnectorIdentity {
  name?: string;
  aliases?: string[];
  website?: string;
  ticker?: string;
  cik?: string;
}

export interface ConnectorOutput {
  signals: CompanySignal[];
  citations: SourceCitation[];
  notes: string[];
  /** Optional canonical-identity backfill (SEC official name/ticker, website legal name). */
  identity?: ConnectorIdentity;
}

export interface LiveConnector {
  id: string; // "sec" | "website"
  label: string;
  /** Whether this connector can run for the given input. */
  appliesTo(input: EnrichInput): boolean;
  /** Fetch + deterministically parse. Must never throw — on failure it returns
   *  an empty output with an explanatory note (graceful degradation). */
  enrich(input: EnrichInput, opts: { bypassCache: boolean }): Promise<ConnectorOutput>;
}

export const emptyOutput = (note: string): ConnectorOutput => ({ signals: [], citations: [], notes: [note] });
