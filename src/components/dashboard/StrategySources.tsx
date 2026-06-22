import type { Company } from "@/lib/types";
import { Section, SourceList } from "@/components/ui/Section";

export function AccountStrategyView({ company }: { company: Company }) {
  const s = company.strategy;
  return (
    <Section eyebrow="Plan" title="Account strategy" sub="How to enter, land, and expand this account.">
      <div className="grid grid-2" style={{ gap: 20 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Best entry point</div>
          <p className="strong" style={{ margin: "0 0 4px" }}>{s.bestEntryPoint}</p>
          <p className="small muted" style={{ margin: 0 }}>{s.entryRationale}</p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>First conversation</div>
          <p className="small soft" style={{ margin: 0 }}>{s.firstConversationStrategy}</p>
        </div>
      </div>

      <hr className="hr" />

      <div className="grid grid-2" style={{ gap: 20 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Land &amp; expand</div>
          <p className="small soft" style={{ margin: "0 0 14px" }}>{s.landAndExpand}</p>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Cross-sell paths</div>
          <ul className="list-check small">{s.crossSell.map((c, i) => <li key={i} className="soft">{c}</li>)}</ul>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Differentiation</div>
          <p className="small soft" style={{ margin: "0 0 14px" }}>{s.differentiation}</p>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Likely objections</div>
          <ul className="list-reasons small">{s.objections.map((o, i) => <li key={i} className="soft">{o}</li>)}</ul>
        </div>
      </div>

      <hr className="hr" />

      <div className="eyebrow" style={{ marginBottom: 12 }}>30 / 60 / 90-day plan</div>
      <div className="grid grid-3">
        {s.actionPlan.map((a, i) => (
          <div key={i} className="card" style={{ boxShadow: "none", padding: 16 }}>
            <span className="chip chip-accent mono">{a.horizon}</span>
            <p className="small soft" style={{ margin: "10px 0 0" }}>{a.action}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function SourcesCenter({ company }: { company: Company }) {
  return (
    <Section
     
      eyebrow="Trust"
      title="Source & confidence center"
      sub="Every claim in this profile carries a confidence rating. In Phase 1 sources are placeholders; live citations arrive in a later phase."
    >
      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        {([
          ["Verified", "Confirmed against a primary source.", "conf-verified"],
          ["Likely", "Strongly supported, not confirmed.", "conf-likely"],
          ["Inferred", "Reasoned from signals — a hypothesis.", "conf-inferred"],
          ["Unknown", "Insufficient evidence — validate first.", "conf-unknown"],
        ] as const).map(([label, blurb, cls]) => (
          <div key={label} className="card" style={{ boxShadow: "none", padding: 14 }}>
            <span className={`conf ${cls}`}>{label}</span>
            <p className="tiny muted" style={{ margin: "8px 0 0" }}>{blurb}</p>
          </div>
        ))}
      </div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Sources referenced</div>
      <SourceList sources={company.sources} />
    </Section>
  );
}
