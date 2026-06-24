import type { Company } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";

export function CompanySnapshot({ company }: { company: Company }) {
  const s = company.snapshot;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Headquarters", value: `${s.headquarters.city}, ${s.headquarters.country}` },
    { label: "Status", value: `${s.publicStatus}${s.stockTicker ? ` · ${s.stockTicker}` : ""}` },
    { label: "Revenue", value: <span className="row" style={{ gap: 8 }}>{s.annualRevenueUSD.value}<ConfidenceBadge confidence={s.annualRevenueUSD.confidence} /></span> },
    { label: "Employees", value: <span className="row" style={{ gap: 8 }}>{s.employeeCount.value}<ConfidenceBadge confidence={s.employeeCount.confidence} /></span> },
    { label: "Size", value: s.sizeCategory },
    { label: "Segment", value: s.industrySegment },
  ];

  return (
    <Section eyebrow="Firmographics" title="Company snapshot" sub="Firmographics and footprint at a glance.">
      <p className="soft" style={{ marginTop: 0 }}>{s.description}</p>
      <hr className="hr-dotted" />
      <div className="grid grid-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{r.label}</div>
            <div className="strong">{r.value}</div>
          </div>
        ))}
      </div>
      <hr className="hr-dotted" />
      <div className="grid grid-2">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Therapeutic focus</div>
          <div className="row-wrap" style={{ gap: 7 }}>
            {s.therapeuticFocus.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Global locations</div>
          <div className="row-wrap" style={{ gap: 7 }}>
            {s.globalLocations.map((l, i) => (
              <span key={i} className="chip">{l.city}{l.isHeadquarters ? " ★" : ""}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="tiny muted" style={{ marginTop: 16, marginBottom: 0 }}>
        Contact (placeholder): {s.contactPlaceholder.phone} · {s.contactPlaceholder.email} — populated from live sources in a later phase.
      </p>
    </Section>
  );
}

export function OpportunityBreakdown({ company }: { company: Company }) {
  const factors = company.opportunity.factors;
  return (
    <Section eyebrow="Scoring" title="Opportunity score breakdown" sub="How the composite score is built — each factor weighted and rated for confidence.">
      <div className="stack">
        {factors.map((f) => (
          <div key={f.key}>
            <div className="spread" style={{ marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
              <div className="row-wrap" style={{ gap: 8 }}>
                <span className="strong">{f.label}</span>
                <span className="chip chip-mono">weight {Math.round(f.weight * 100)}%</span>
                <ConfidenceBadge confidence={f.confidence} />
              </div>
              <span className="mono soft">{f.score}/100</span>
            </div>
            <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${f.score}%`, height: "100%", background: "var(--accent)", borderRadius: 999 }} />
            </div>
            <p className="small muted" style={{ margin: "8px 0 0" }}>{f.explanation}</p>
            <hr className="hr-dotted" />
          </div>
        ))}
      </div>
    </Section>
  );
}
