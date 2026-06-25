import { FREYR_SERVICES } from "@/lib/mock/services";
import { PERSONAS } from "@/lib/mock/personas";
import { COMPANIES } from "@/lib/mock/companies";
import { CONNECTORS } from "@/lib/sources/connectors";

const CATS = ["Public/Regulatory", "News & Web", "Commercial Intelligence", "Internal Freyr"] as const;

export default function SettingsPage() {
  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <span className="eyebrow">Configuration</span>
        <h1 className="display" style={{ fontSize: 28, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Settings</h1>
        <p className="soft" style={{ margin: 0 }}>Phase 1 runs on a mock dataset. These settings preview what becomes configurable in later phases.</p>
      </section>

      <div className="stack" style={{ gap: 20 }}>
        <section className="card card-pad-lg">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Data source</div>
          <div className="row-wrap" style={{ gap: 10 }}>
            <span className="chip chip-accent">Mock data (Phase 1)</span>
            <span className="chip" style={{ opacity: 0.7 }}>Live sources <span className="mono tiny">Phase 2</span></span>
            <span className="chip" style={{ opacity: 0.7 }}>CRM sync <span className="mono tiny">Phase 2</span></span>
            <span className="chip" style={{ opacity: 0.7 }}>AI generation <span className="mono tiny">soon</span></span>
          </div>
          <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>
            The app reads through a swappable service layer and the connector interfaces below, so connecting live data later requires no UI changes.
          </p>
        </section>

        <div className="grid grid-4">
          <StatCard label="Companies" value={COMPANIES.length} sub="demo profiles" />
          <StatCard label="Personas" value={PERSONAS.length} sub="buyer profiles" />
          <StatCard label="Services" value={FREYR_SERVICES.length} sub="seed catalog" />
          <StatCard label="Connectors" value={CONNECTORS.length} sub="planned (Phase 2)" />
        </div>

        <section className="card card-pad-lg">
          <div className="eyebrow" style={{ marginBottom: 6 }}>Data source connectors · planned for Phase 2</div>
          <p className="small muted" style={{ margin: "0 0 16px" }}>
            Clean interfaces are defined now; no live calls are made in Phase 1. Phase 2 plugs real sources into these
            connectors to discover and enrich any company.
          </p>
          <div className="grid grid-2" style={{ gap: 16 }}>
            {CATS.map((cat) => (
              <div key={cat} className="card" style={{ boxShadow: "none", padding: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{cat}</div>
                <div className="stack" style={{ gap: 10 }}>
                  {CONNECTORS.filter((c) => c.category === cat).map((c) => (
                    <div key={c.id} className="spread" style={{ gap: 10, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 0 }}>
                        <div className="strong small">{c.label}</div>
                        <div className="tiny muted">{c.description}</div>
                      </div>
                      <span className="conf conf-unknown" style={{ flex: "0 0 auto" }}>Planned</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card card-pad-lg">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Confidence model</div>
          <p className="small soft" style={{ marginTop: 0 }}>
            Every claim is rated Verified, Likely, Inferred, or Unknown. Phase 1 data is largely Inferred or Likely because sources are placeholders; live sourcing raises confidence in later phases.
          </p>
        </section>

        <section className="card card-pad-lg">
          <div className="eyebrow" style={{ marginBottom: 12 }}>About this build</div>
          <p className="small soft" style={{ margin: 0 }}>
            Freyr Pulse — Phase 1 (MVP). A static, deployable web app with a clean, swappable data layer and connector
            architecture designed to extend through later phases (live market intelligence, AI recommendations,
            executive planning, and agentic discovery).
          </p>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="card">
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      <div className="display" style={{ fontSize: 32, fontWeight: 600 }}>{value}</div>
      <div className="tiny muted">{sub}</div>
    </div>
  );
}
