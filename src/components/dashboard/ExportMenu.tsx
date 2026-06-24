"use client";

import { useState } from "react";
import type { Company, PersonaId } from "@/lib/types";
import { PERSONAS } from "@/lib/mock/personas";
import {
  FORMAT_MATRIX,
  DELIVERABLE_LABEL,
  FORMAT_LABEL,
  deliverableUsesPersona,
  type Deliverable,
  type ExportFormat,
} from "@/lib/export/formats";
import { exportBrief } from "@/lib/client/api";

const DELIVERABLES = Object.keys(FORMAT_MATRIX) as Deliverable[];

export function ExportMenu({ company, primaryPersona }: { company: Company; primaryPersona?: PersonaId }) {
  const [deliverable, setDeliverable] = useState<Deliverable>("account-brief");
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [persona, setPersona] = useState<PersonaId>(primaryPersona ?? "vp-regulatory-affairs");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formats = FORMAT_MATRIX[deliverable];
  const usesPersona = deliverableUsesPersona(deliverable);
  const researched = Boolean(company.enrichment?.lastResearchedAt);

  function pickDeliverable(d: Deliverable) {
    setDeliverable(d);
    if (!FORMAT_MATRIX[d].includes(format)) setFormat(FORMAT_MATRIX[d][0]);
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const { blob, filename } = await exportBrief(company.id, deliverable, format, usesPersona ? persona : undefined);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span className="eyebrow">Export</span>
          <p className="small soft" style={{ margin: "4px 0 0" }}>
            Download a deliverable — a faithful, citation-backed snapshot of this account.
          </p>
        </div>
        <div className="row-wrap" style={{ gap: 8, alignItems: "center" }}>
          <select className="input input-sm" value={deliverable} onChange={(e) => pickDeliverable(e.target.value as Deliverable)} aria-label="Deliverable">
            {DELIVERABLES.map((d) => (
              <option key={d} value={d}>{DELIVERABLE_LABEL[d]}</option>
            ))}
          </select>
          {usesPersona && (
            <select className="input input-sm" value={persona} onChange={(e) => setPersona(e.target.value as PersonaId)} aria-label="Persona">
              {PERSONAS.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}
          <select className="input input-sm" value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)} aria-label="Format">
            {formats.map((f) => (
              <option key={f} value={f}>{FORMAT_LABEL[f]}</option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm" onClick={run} disabled={busy}>
            {busy ? "Generating…" : "Export"}
          </button>
        </div>
      </div>
      {!researched && (
        <p className="tiny" style={{ marginTop: 10, color: "var(--muted)" }}>
          This account hasn’t been researched yet — the export will use seed data and show limited evidence. Run research above to strengthen it.
        </p>
      )}
      {error && (
        <p className="tiny" style={{ marginTop: 10, color: "var(--danger, #b91c1c)" }}>{error}</p>
      )}
    </div>
  );
}
