import { FREYR_SERVICES } from "@/lib/mock/services";
import { PERSONAS } from "@/lib/mock/personas";
import { COMPANIES } from "@/lib/mock/companies";

export default function SettingsPage() {
  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <span className="eyebrow">Configuration</span>
        <h1 className="display" style={{ fontSize: 28, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Settings</h1>
        <p className="soft" style={{ margin: 0 }}>Phase 1 runs on a fixed mock dataset. These settings are read-only previews of what becomes configurable in later phases.</p>
      </section>

      <div className="stack" style={{ gap: 20 }}>
        <section className="card card-pad-lg">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Data source</div>
          <div className="row-wrap" style={{ gap: 10 }}>
            <span className="chip chip-accent">Mock data (Phase 1)</span>
            <span className="chip" style={{ opacity: 0.7 }}>Live news &amp; filings <span className="mono tiny">soon</span></span>
            <span className="chip" style={{ opacity: 0.7 }}>CRM sync <span className="mono tiny">soon</span></span>
            <span className="chip" style={{ opacity: 0.7 }}>AI generation <span className="mono tiny">soon</span></span>
          </div>
          <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>
            The app reads through a swappable service layer, so connecting live data later requires no UI changes.
          </p>
        </section>

        <div className="grid grid-3">
          <StatCard label="Companies" value={COMPANIES.length} sub="in the mock universe" />
          <StatCard label="Personas" value={PERSONAS.length} sub="buyer profiles" />
          <StatCard label="Freyr services" value={FREYR_SERVICES.length} sub="in the catalogue" />
        </div>

        <section className="card card-pad-lg">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Confidence model</div>
          <p className="small soft" style={{ marginTop: 0 }}>
            Every claim is rated Verified, Likely, Inferred, or Unknown. Phase 1 data is largely Inferred or Likely because sources are placeholders; live sourcing raises confidence in later phases.
          </p>
        </section>

        <section className="card card-pad-lg">
          <div className="eyebrow" style={{ marginBottom: 12 }}>About this build</div>
          <p className="small soft" style={{ margin: 0 }}>
            Freyr Sales Intelligence Platform — Phase 1 (MVP). Built as a static, deployable web app with a clean, swappable data layer designed to extend through Phases 2–6 (account management, market intelligence, AI recommendations, executive planning, and agentic discovery).
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
