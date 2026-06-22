import type { Company } from "@/lib/types";
import { ScoreDial, LevelBadge } from "@/components/ui/Score";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { SERVICE_BY_ID } from "@/lib/mock/services";

export function WhyCareCard({ company }: { company: Company }) {
  const o = company.opportunity;
  const topServices = o.topServiceIds.map((id) => SERVICE_BY_ID[id]).filter(Boolean);

  return (
    <section
      className="card card-pad-lg fade-in"
      style={{ borderColor: "var(--accent-line)", background: "linear-gradient(180deg, var(--accent-soft), var(--surface) 120px)" }}
    >
      <div className="row" style={{ gap: 8, marginBottom: 16 }}>
        <span className="eyebrow" style={{ color: "var(--accent-ink)" }}>The verdict</span>
        <span className="eyebrow">· Why should Freyr care?</span>
      </div>

      <div className="why-hero-top">
        <div className="why-hero-verdict" style={{ flex: 1, minWidth: 0 }}>
          <h1 className="display" style={{ fontSize: 26, lineHeight: 1.22, letterSpacing: "-0.02em", marginBottom: 14 }}>
            {o.verdict}
          </h1>
          <div className="row-wrap" style={{ gap: 10, marginBottom: 18 }}>
            <LevelBadge level={o.level} />
            <ConfidenceBadge confidence={o.confidence} title={`Overall confidence: ${o.confidence}`} />
          </div>

          <span className="eyebrow">Reasons to pursue</span>
          <ul className="list-reasons" style={{ marginTop: 8 }}>
            {o.reasons.map((r, i) => (
              <li key={i} className="soft">{r}</li>
            ))}
          </ul>
        </div>

        <div style={{ flex: "0 0 auto", textAlign: "center" }}>
          <ScoreDial score={o.score} />
          <div className="eyebrow" style={{ marginTop: 8 }}>Opportunity score</div>
        </div>
      </div>

      <hr className="hr" />

      <div className="grid grid-2" style={{ gap: 22 }}>
        <div>
          <span className="eyebrow">Top services to lead with</span>
          <div className="row-wrap" style={{ gap: 8, marginTop: 10 }}>
            {topServices.map((s) => (
              <span key={s.id} className="chip chip-accent">{s.name}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="eyebrow">Next best action</span>
          <p className="soft" style={{ marginTop: 8, marginBottom: 0 }}>{o.nextBestAction}</p>
        </div>
      </div>
    </section>
  );
}
