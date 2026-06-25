import type { Company } from "@/lib/types";
import type { MatchedService } from "@/lib/generators/serviceMatch";
import type { OpportunityIntelligence } from "@/lib/opportunity/engine";
import { ScoreDial } from "@/components/ui/Score";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";

/**
 * The headline verdict, rendered on a deep-navy panel. Driven by the computed
 * Opportunity Intelligence (tier/score/why-care/next-action), falling back to
 * curated values inside the engine when live evidence is thin.
 */
export function WhyCareCard({
  company,
  recommendations,
  oi,
}: {
  company: Company;
  recommendations: MatchedService[];
  oi: OpportunityIntelligence;
}) {
  const top = recommendations.slice(0, 5);
  const nextAction = oi.nextActions[0]?.action ?? company.opportunity.nextBestAction;

  return (
    <section className="panel-dark card-pad-lg fade-in">
      <div className="spread" style={{ marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="eyebrow">The verdict</span>
          <span className="eyebrow" style={{ color: "var(--muted-on-dark)" }}>· Why should Freyr care?</span>
        </div>
        <DemoDataNotice
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "var(--muted-on-dark)",
            borderColor: "var(--navy-line)",
          }}
        />
      </div>

      <div className="why-hero-top">
        <div className="why-hero-verdict" style={{ flex: 1, minWidth: 0 }}>
          <h1 className="display" style={{ fontSize: 28, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16, color: "var(--ink-on-dark)" }}>
            {oi.verdict}
          </h1>
          <div className="row-wrap" style={{ gap: 10, marginBottom: 20 }}>
            <span className="chip" style={{ background: "rgba(45,212,191,0.16)", color: "var(--accent-bright)", borderColor: "rgba(45,212,191,0.4)", fontWeight: 700 }}>{oi.tier}</span>
            <span className="chip" style={{ background: "rgba(255,255,255,0.08)", color: "var(--ink-on-dark)", borderColor: "var(--navy-line)" }}>{oi.evidenceStrength} evidence</span>
            <ConfidenceBadge confidence={oi.confidence} title={`Overall confidence: ${oi.confidence}`} />
          </div>

          <span className="eyebrow">Reasons to pursue</span>
          <ul className="list-reasons" style={{ marginTop: 10, color: "var(--ink-on-dark)" }}>
            {oi.whyCare.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <div style={{ flex: "0 0 auto", textAlign: "center" }}>
          <ScoreDial score={oi.score} tone="dark" />
          <div className="eyebrow" style={{ marginTop: 10 }}>Opportunity score</div>
        </div>
      </div>

      <hr style={{ height: 1, border: 0, background: "var(--navy-line)", margin: "22px 0" }} />

      <div className="grid grid-2" style={{ gap: 24 }}>
        <div>
          <span className="eyebrow">Top services to lead with</span>
          <div className="row-wrap" style={{ gap: 8, marginTop: 12 }}>
            {top.length ? (
              top.map((m) => (
                <span
                  key={m.service.id}
                  className="chip"
                  style={{ background: "rgba(45,212,191,0.12)", color: "var(--accent-bright)", borderColor: "rgba(45,212,191,0.4)" }}
                  title={m.evidenceStrength ? `${m.evidenceStrength} evidence` : undefined}
                >
                  {m.service.serviceName}
                  {m.evidenceStrength && <span style={{ opacity: 0.7, marginLeft: 6, fontSize: 11 }}>· {m.evidenceStrength}</span>}
                </span>
              ))
            ) : (
              <span className="small" style={{ color: "var(--muted-on-dark)" }}>To be determined after enrichment.</span>
            )}
          </div>
          {top[0] && (
            <p className="small" style={{ marginTop: 10, marginBottom: 0, color: "var(--muted-on-dark)" }}>{top[0].whyRelevant}</p>
          )}
        </div>
        <div>
          <span className="eyebrow">Next best action</span>
          <p style={{ marginTop: 12, marginBottom: 0, color: "var(--ink-on-dark)" }}>{nextAction}</p>
        </div>
      </div>
    </section>
  );
}
