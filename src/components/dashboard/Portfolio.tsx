import type { Company } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";

export function ProductsTA({ company }: { company: Company }) {
  return (
    <Section eyebrow="Portfolio" title="Product & therapeutic-area intelligence" sub="What they sell and where they're investing — and the regulatory work it implies.">
      <div className="eyebrow" style={{ marginBottom: 10 }}>Therapeutic areas</div>
      <div className="row-wrap" style={{ gap: 8, marginBottom: 18 }}>
        {company.therapeuticAreas.map((ta) => (
          <span key={ta.name} className={ta.emphasis === "Core" ? "chip chip-accent" : "chip"} title={ta.note}>
            {ta.name} · {ta.emphasis}
          </span>
        ))}
      </div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Products & pipeline</div>
      <div className="stack">
        {company.products.map((p, i) => (
          <div key={i} className="card" style={{ boxShadow: "none", padding: 16 }}>
            <div className="spread">
              <span className="strong">{p.name}</span>
              <span className="chip chip-mono">{p.lifecycle}</span>
            </div>
            <div className="row-wrap small muted" style={{ gap: 14, margin: "8px 0" }}>
              <span>{p.category}</span>
              <span>· {p.therapeuticArea}</span>
              <span>· Markets: {p.approvedMarkets.join(", ")}</span>
            </div>
            <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
              <span className="small soft" style={{ flex: 1 }}>Regulatory implication: {p.regulatoryImplication}</span>
              <ConfidenceBadge confidence={p.confidence} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function TriggersTimeline({ company }: { company: Company }) {
  return (
    <Section eyebrow="Signals" title="Business events & triggers" sub="Recent events that create timing and openings — each tied to a Freyr opportunity.">
      <div style={{ position: "relative", paddingLeft: 22 }}>
        <div style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 2, background: "var(--line)" }} aria-hidden />
        <div className="stack">
          {company.triggers.map((t) => (
            <div key={t.id} style={{ position: "relative" }}>
              <span aria-hidden style={{ position: "absolute", left: -21, top: 5, width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--surface)" }} />
              <div className="card" style={{ boxShadow: "none", padding: 16 }}>
                <div className="spread" style={{ flexWrap: "wrap", gap: 8 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span className="chip chip-mono">{t.type}</span>
                    <span className="tiny muted">{t.date}</span>
                  </div>
                  <ConfidenceBadge confidence={t.confidence} />
                </div>
                <p className="strong" style={{ margin: "10px 0 6px" }}>{t.headline}</p>
                <p className="small soft" style={{ margin: "0 0 8px" }}>{t.whyItMatters}</p>
                <div style={{ background: "var(--accent-soft)", borderRadius: "var(--r-md)", padding: "8px 12px" }}>
                  <span className="eyebrow" style={{ color: "var(--accent-ink)" }}>Freyr opportunity</span>
                  <p className="small" style={{ margin: "4px 0 0", color: "var(--accent-ink)" }}>{t.freyrOpportunity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function CompetitiveLandscape({ company }: { company: Company }) {
  return (
    <Section eyebrow="Field" title="Competitive landscape" sub="Who else may serve this account — and how Freyr differentiates.">
      <div className="stack">
        {company.competitors.map((c, i) => (
          <div key={i} className="card" style={{ boxShadow: "none", padding: 16 }}>
            <div className="spread">
              <span className="strong">{c.name}</span>
              <ConfidenceBadge confidence={c.confidence} />
            </div>
            <div className="grid grid-3" style={{ marginTop: 10, gap: 14 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Possible area</div>
                <p className="small soft" style={{ margin: 0 }}>{c.possibleServiceArea}</p>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Their strength</div>
                <p className="small soft" style={{ margin: 0 }}>{c.strength}</p>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, color: "var(--accent-ink)" }}>Freyr edge</div>
                <p className="small" style={{ margin: 0, color: "var(--accent-ink)" }}>{c.freyrDifferentiation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
