import type { Company, FreyrService } from "@/lib/types";
import { ScoreDial, LevelBadge } from "@/components/ui/Score";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";

/**
 * The headline verdict, rendered on a deep-navy panel so the Opportunity Score
 * and "Why Should Freyr Care?" read as the boldest moment on the page.
 * Top-service names resolve from the live catalogue (passed in via serviceById).
 */
export function WhyCareCard({
  company,
  serviceById,
}: {
  company: Company;
  serviceById: Record<string, FreyrService>;
}) {
  const o = company.opportunity;
  const topServices = o.topServiceIds.map((id) => serviceById[id]).filter(Boolean);

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
            {o.verdict}
          </h1>
          <div className="row-wrap" style={{ gap: 10, marginBottom: 20 }}>
            <LevelBadge level={o.level} />
            <ConfidenceBadge confidence={o.confidence} title={`Overall confidence: ${o.confidence}`} />
          </div>

          <span className="eyebrow">Reasons to pursue</span>
          <ul className="list-reasons" style={{ marginTop: 10, color: "var(--ink-on-dark)" }}>
            {o.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <div style={{ flex: "0 0 auto", textAlign: "center" }}>
          <ScoreDial score={o.score} tone="dark" />
          <div className="eyebrow" style={{ marginTop: 10 }}>Opportunity score</div>
        </div>
      </div>

      <hr style={{ height: 1, border: 0, background: "var(--navy-line)", margin: "22px 0" }} />

      <div className="grid grid-2" style={{ gap: 24 }}>
        <div>
          <span className="eyebrow">Top services to lead with</span>
          <div className="row-wrap" style={{ gap: 8, marginTop: 12 }}>
            {topServices.length ? (
              topServices.map((s) => (
                <span
                  key={s.id}
                  className="chip"
                  style={{ background: "rgba(45,212,191,0.12)", color: "var(--accent-bright)", borderColor: "rgba(45,212,191,0.4)" }}
                >
                  {s.serviceName}
                </span>
              ))
            ) : (
              <span className="small" style={{ color: "var(--muted-on-dark)" }}>To be determined after enrichment.</span>
            )}
          </div>
        </div>
        <div>
          <span className="eyebrow">Next best action</span>
          <p style={{ marginTop: 12, marginBottom: 0, color: "var(--ink-on-dark)" }}>{o.nextBestAction}</p>
        </div>
      </div>
    </section>
  );
}
