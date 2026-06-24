import type { SourceCitation } from "@/lib/types";

/**
 * Deterministic citation numbering: walk citation arrays in the exact order the
 * brief assembled them, dedupe by url+label, and number by first appearance.
 * Reproducible — never relies on Set/Map iteration order for the numbering.
 */

export interface NumberedCitation {
  n: number;
  citation: SourceCitation;
}

export function citationKey(c: SourceCitation): string {
  return `${c.url ?? ""}|||${c.label ?? ""}`;
}

export function collectCitations(arrays: SourceCitation[][]): NumberedCitation[] {
  const out: NumberedCitation[] = [];
  const seen = new Set<string>();
  for (const arr of arrays) {
    for (const c of arr) {
      if (!c || c.type === "Placeholder") continue;
      const key = citationKey(c);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ n: out.length + 1, citation: c });
    }
  }
  return out;
}

/** Inline reference like "[3]" for a citation, or "" if untracked. */
export function refMarker(index: Record<string, number>, c: SourceCitation): string {
  const n = index[citationKey(c)];
  return n ? `[${n}]` : "";
}

/** Compact inline source tag for slides, e.g. "(FDA, 2026-05)". */
export function inlineTag(c: SourceCitation): string {
  const pub = c.publisher || c.sourceType || c.type;
  const date = c.publishedAt?.slice(0, 7) || c.retrievedAt?.slice(0, 10);
  return pub ? `(${pub}${date ? `, ${date}` : ""})` : "";
}
