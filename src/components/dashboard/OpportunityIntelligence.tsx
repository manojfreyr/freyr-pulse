"use client";

import type { OpportunityIntelligence, OppEvidence } from "@/lib/opportunity/engine";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { EvidenceStrengthChip } from "@/components/dashboard/EvidencePanel";
import type { SourceCitation } from "@/lib/types";

const PLACEHOLDER_URL = "https://example.com/placeholder";
function realUrl(url?: string): string | null {
  if (!url || url === PLACEHOLDER_URL) return null;
  return /^https?:\/\//i.test(url) ? url : null;
}
function Cites({ cites, analysis }: { cites: SourceCitation[]; analysis?: boolean }) {
  const linked = cites.filter((c) => realUrl(c.url));
  if (!linked.length) return <span className="tiny muted"> · {analysis ? "Freyr analysis" : cites[0]?.publisher || cites[0]?.sourceType || "internal"}</span>;
  return (
    <span className="tiny muted">
      {" · "}
      {linked.map((c, i) => (
        <span key={`${c.url}-${i}`}>
          {i > 0 && ", "}
          <a href={realUrl(c.url)!} target="_blank" rel="noopener noreferrer">{c.publisher || c.label}</a>
        </span>
      ))}
    </span>
  );
}
function EvidenceList({ items }: { items: OppEvidence[] }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 4 }}>
      {items.map((e, i) => (
        <div key={i} className="tiny" style={{ color: "var(--muted)" }}>
          – {e.label}
          {e.confidence && ` (${e.confidence}${e.observedAt ? `, as of ${e.observedAt.slice(0, 10)}` : ""})`}
          <Cites cites={e.citations} analysis={e.analysis} />
        </div>
      ))}
    </div>
  );
}

export function OpportunityIntelligencePanel({ oi }: { oi: OpportunityIntelligence }) {
  return (
    <section className="card fade-in">
      <div className="spread" style={{ alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          <span className="eyebrow">Opportunity Intelligence</span>
          <span className="chip" style={{ background: "var(--accent-soft)", color: "var(--accent-ink)", fontWeight: 700 }}>{oi.tier}</span>
          <EvidenceStrengthChip strength={oi.evidenceStrength} />
          <ConfidenceBadge confidence={oi.confidence} />
        </div>
        <div className="row" style={{ gap: 6, alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)" }}>{oi.score}</span>
          <span className="tiny muted">/100</span>
        </div>
      </div>

      {!oi.computed && (
        <p className="tiny" style={{ marginTop: 8, color: "var(--muted)" }}>
          Limited live evidence — showing the curated baseline. Run research above to compute this from signals. (Factor preview below.)
        </p>
      )}

      <p className="small soft" style={{ margin: "10px 0 0" }}>{oi.verdict}</p>

      {/* Why care */}
      <div style={{ marginTop: 14 }}>
        <span className="eyebrow">Why Freyr should care</span>
        <ul className="list-reasons small" style={{ marginTop: 8 }}>
          {oi.whyCare.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      {/* Factor breakdown */}
      <details style={{ marginTop: 10 }}>
        <summary className="small strong" style={{ cursor: "pointer", color: "var(--accent)" }}>How this score was computed</summary>
        <div style={{ marginTop: 8 }}>
          {oi.factors.map((f) => (
            <div key={f.key} style={{ padding: "6px 0", borderBottom: "1px dotted var(--line)" }}>
              <div className="small">
                <span className="strong">{f.label}</span>
                <span className="muted"> · weight {Math.round(f.weight * 100)}% · contributes +{f.contribution}</span>
                <ConfidenceBadge confidence={f.confidence} />
              </div>
              <div className="tiny muted">{f.explanation}</div>
              <EvidenceList items={f.evidence} />
            </div>
          ))}
        </div>
      </details>

      <hr className="hr" />

      <div className="grid grid-2" style={{ gap: 20 }}>
        {/* Why now */}
        <div>
          <span className="eyebrow">Why now</span>
          <div style={{ marginTop: 8 }}>
            {oi.whyNow.length ? oi.whyNow.map((t, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="small strong">{t.headline}<span className="tiny muted">{t.observedAt ? ` · as of ${t.observedAt.slice(0, 10)}` : ""}</span><Cites cites={t.citations} analysis={t.analysis} /></div>
                <div className="tiny muted">{t.whyItMatters}</div>
              </div>
            )) : <p className="tiny muted">No recent triggers detected.</p>}
          </div>
        </div>

        {/* Maturity */}
        <div>
          <span className="eyebrow">Account maturity</span>
          <div className="small" style={{ marginTop: 8 }}>
            <span className="chip chip-mono">{oi.maturity.primary}</span>
            {oi.maturity.secondary.map((s) => <span key={s} className="chip chip-mono" style={{ opacity: 0.7 }}>{s}</span>)}
          </div>
          <EvidenceList items={oi.maturity.evidence.slice(0, 4)} />
        </div>

        {/* Stakeholders */}
        <div>
          <span className="eyebrow">Stakeholders to engage</span>
          <div style={{ marginTop: 8 }}>
            {oi.stakeholders.map((s, i) => (
              <div key={s.id} className="small" style={{ marginBottom: 6 }}>
                <span className="strong">{i === 0 ? "★ " : ""}{s.title}</span>
                <div className="tiny muted">{s.rationale}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next best actions */}
        <div>
          <span className="eyebrow">Next best actions</span>
          <div style={{ marginTop: 8 }}>
            {oi.nextActions.map((a, i) => (
              <div key={i} className="small" style={{ marginBottom: 6 }}>
                <span className={a.primary ? "strong" : ""}>{a.primary ? "→ " : "· "}{a.action}</span>
                <div className="tiny muted">{a.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Differentiators */}
      {oi.differentiators.length > 0 && (
        <>
          <hr className="hr" />
          <span className="eyebrow">How we win</span>
          <div style={{ marginTop: 8 }}>
            {oi.differentiators.map((d, i) => (
              <div key={i} className="small" style={{ marginBottom: 6 }}>
                <span className="strong">{d.title}</span> — {d.positioning}
                <span className="tiny muted"> (matched: {d.trigger}</span><Cites cites={d.citations} />
                <span className="tiny muted">)</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
