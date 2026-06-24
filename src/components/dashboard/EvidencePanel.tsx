import type { MatchedService, EvidenceItem } from "@/lib/generators/serviceMatch";
import type { EvidenceStrength } from "@/lib/generators/scoring";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { formatDate } from "@/lib/utils/format";

const PLACEHOLDER_URL = "https://example.com/placeholder";
function realUrl(url?: string): string | null {
  if (!url || url === PLACEHOLDER_URL) return null;
  return /^https?:\/\//i.test(url) ? url : null;
}

const STRENGTH_STYLE: Record<EvidenceStrength, { bg: string; fg: string }> = {
  Strong: { bg: "var(--accent-soft)", fg: "var(--accent-strong, var(--accent))" },
  Moderate: { bg: "var(--surface-2)", fg: "var(--ink)" },
  Limited: { bg: "var(--surface-2)", fg: "var(--muted)" },
};

export function EvidenceStrengthChip({ strength }: { strength?: EvidenceStrength }) {
  if (!strength) return null;
  const s = STRENGTH_STYLE[strength];
  return (
    <span className="chip" style={{ background: s.bg, color: s.fg, fontWeight: 600 }} title="Evidence strength behind this recommendation">
      {strength} evidence
    </span>
  );
}

function EvidenceRow({ e }: { e: EvidenceItem }) {
  const linked = e.sources.filter((c) => realUrl(c.url));
  const retrievedAt = e.sources.find((c) => c.retrievedAt)?.retrievedAt;
  return (
    <div className="small" style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "5px 0", borderBottom: "1px dotted var(--line)" }}>
      <div style={{ minWidth: 0 }}>
        <span className="strong" style={{ textTransform: "capitalize" }}>{e.signalLabel}</span>
        <span className="tiny muted"> · {e.matchType}</span>
        <div className="tiny muted">
          {linked.length > 0 ? (
            <>
              {linked.map((c, i) => (
                <span key={`${c.url}-${i}`}>
                  {i > 0 && ", "}
                  <a href={realUrl(c.url)!} target="_blank" rel="noopener noreferrer">{c.publisher || c.label}</a>
                </span>
              ))}
              {e.observedAt && <span> · as of {formatDate(e.observedAt)}</span>}
              {!e.observedAt && retrievedAt && <span> · as of {formatDate(retrievedAt)}</span>}
            </>
          ) : (
            <span>{e.sources[0]?.publisher || e.sources[0]?.sourceType || "internal"}{e.observedAt ? ` · as of ${formatDate(e.observedAt)}` : ""}</span>
          )}
        </div>
      </div>
      <div className="row" style={{ gap: 8, flex: "0 0 auto", alignItems: "center" }}>
        <ConfidenceBadge confidence={e.confidence} />
        <span className="tiny mono muted" title="Points contributed">+{Math.round(e.contribution)}</span>
      </div>
    </div>
  );
}

export function WhyThisService({ r }: { r: MatchedService }) {
  if (!r.evidence?.length) return null;
  return (
    <details style={{ marginTop: 8 }}>
      <summary className="small strong" style={{ cursor: "pointer", color: "var(--accent)" }}>Why this service?</summary>
      <div style={{ marginTop: 8 }}>
        {r.evidence.map((e, i) => (
          <EvidenceRow key={`${e.signalKey}-${i}`} e={e} />
        ))}
        {r.breakdown && (
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Score {r.relevanceScore} = base {r.breakdown.base} · confidence/recency {r.breakdown.confidenceRecencyAdj >= 0 ? "+" : ""}{r.breakdown.confidenceRecencyAdj}
            {r.breakdown.corroborationBonus ? ` · corroboration +${r.breakdown.corroborationBonus}` : ""}.
          </div>
        )}
      </div>
    </details>
  );
}
