import type { SourceCitation } from "@/lib/types";

/**
 * Phase 1 source placeholders. Every claim carries a source, but in Phase 1 the
 * URLs/dates are placeholders. In later phases the API layer replaces these with
 * real citations from news, filings, and databases.
 */
export function src(
  label: string,
  type: SourceCitation["type"] = "Placeholder",
): SourceCitation {
  return {
    label,
    url: "https://example.com/placeholder",
    dateRetrieved: "Phase 1 — placeholder",
    type,
  };
}
