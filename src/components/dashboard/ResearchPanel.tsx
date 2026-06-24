"use client";

import { useEffect, useRef, useState } from "react";
import type { Company } from "@/lib/types";
import * as api from "@/lib/client/api";
import { formatDate } from "@/lib/utils/format";

type Step = { source: string; status: string; error?: string };

const SOURCE_LABEL: Record<string, string> = { sec: "SEC EDGAR", clinicaltrials: "ClinicalTrials.gov", fda: "openFDA", website: "Company website" };

export function ResearchPanel({ company, onResearched, autoStart = false }: { company: Company; onResearched: (c: Company) => void; autoStart?: boolean }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "error">("idle");
  const [steps, setSteps] = useState<Step[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const enrichment = company.enrichment;

  async function run() {
    setPhase("running");
    setError(null);
    setProgress(0);
    try {
      const started = await api.startEnrichment(company.id);
      setSteps(started.steps as Step[]);
      let guard = 0;
      const maxLoops = (started.steps?.length ?? 2) + 3;
      // Client drives one short step per request (no queue/cron).
      while (guard++ < maxLoops) {
        const job = await api.runNextStep(started.jobId);
        setSteps(job.steps as Step[]);
        setProgress(job.progress);
        if (job.status === "done" || job.status === "error") break;
        if (!job.steps.some((s) => s.status === "pending")) break;
      }
      const fresh = await api.getCompany(company.id);
      if (fresh) onResearched(fresh);
      setPhase("done");
    } catch (e) {
      setError((e as Error).message);
      setPhase("error");
    }
  }

  const running = phase === "running";

  // Auto-start once for freshly onboarded companies (no prior research).
  const autoFired = useRef(false);
  useEffect(() => {
    if (autoStart && !autoFired.current && phase === "idle" && !company.enrichment?.lastResearchedAt) {
      autoFired.current = true;
      void run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className="card fade-in" style={{ marginBottom: 20, boxShadow: "none", borderColor: "var(--accent-line)", background: "var(--accent-soft)" }}>
      <div className="spread" style={{ gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div className="strong" style={{ marginBottom: 4 }}>Live research</div>
          <p className="small soft" style={{ margin: 0, maxWidth: 640 }}>
            Pulls live signals from <span className="strong">SEC EDGAR</span>, <span className="strong">ClinicalTrials.gov</span>, <span className="strong">openFDA</span>, and the
            <span className="strong"> company website</span> (deterministic parsing — no AI). Findings feed the
            recommendations and appear in the Sources tab with citations and confidence.
            {enrichment && (
              <> Last researched {formatDate(enrichment.lastResearchedAt)}.</>
            )}
          </p>
        </div>
        <div className="row-wrap" style={{ gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>
            {running ? "Researching…" : enrichment ? "Research again" : "Run live research"}
          </button>
        </div>
      </div>

      {running && (
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 6, borderRadius: 99, background: "var(--surface-2)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", transition: "width .3s" }} />
          </div>
        </div>
      )}

      {(running || phase === "done") && steps.length > 0 && (
        <div className="row-wrap" style={{ gap: 8, marginTop: 12 }}>
          {steps.map((s) => (
            <span key={s.source} className="chip" style={{ background: "var(--surface)" }}>
              {SOURCE_LABEL[s.source] ?? s.source}: <span className="mono" style={{ marginLeft: 4 }}>{s.status}</span>
            </span>
          ))}
        </div>
      )}

      {error && <p className="small" style={{ color: "var(--danger)", marginTop: 10, marginBottom: 0 }}>Research failed: {error}</p>}

      {enrichment && enrichment.runs.length > 0 && phase !== "running" && (
        <div className="tiny muted" style={{ marginTop: 12 }}>
          {enrichment.runs.map((r) => (
            <span key={r.source} style={{ marginRight: 14 }}>
              {SOURCE_LABEL[r.source] ?? r.source}: {r.ok ? `${r.signalCount} signal(s)` : `failed${r.error ? ` — ${r.error}` : ""}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
