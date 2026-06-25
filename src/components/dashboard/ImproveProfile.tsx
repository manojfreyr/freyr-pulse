"use client";

import { useState } from "react";
import type { Company } from "@/lib/types";
import * as api from "@/lib/client/api";

/**
 * Lets a user strengthen a sparse, self-onboarded company by supplying a
 * website, ticker, or aliases — which materially improve connector match rates
 * (website parsing, SEC ticker resolution, ClinicalTrials/openFDA name matching).
 * Only shown for user-created accounts; never for demo companies.
 */
export function ImproveProfile({ company, onSaved }: { company: Company; onSaved: (c: Company) => void }) {
  const signalCount = company.enrichment?.signals.length ?? 0;
  const [open, setOpen] = useState(false);
  const [website, setWebsite] = useState(company.website === "Unknown" ? "" : company.website);
  const [ticker, setTicker] = useState(company.snapshot.stockTicker ?? "");
  const [aliases, setAliases] = useState((company.aliases ?? []).join(", "));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (company.origin !== "user") return null;

  const noWebsite = !company.website || company.website === "Unknown";

  async function save() {
    setBusy(true); setMsg(null);
    try {
      const cleanWebsite = website.trim();
      const cleanTicker = ticker.trim().toUpperCase();
      const aliasList = Array.from(new Set(aliases.split(",").map((a) => a.trim().toLowerCase()).filter(Boolean)));
      const updated: Company = {
        ...company,
        website: cleanWebsite || company.website,
        aliases: aliasList.length ? aliasList : company.aliases,
        snapshot: {
          ...company.snapshot,
          ...(cleanTicker ? { stockTicker: cleanTicker, publicStatus: "Public" } : {}),
        },
      };
      const saved = await api.saveCompany(updated);
      onSaved(saved);
      setMsg("Saved. Click “Research again” above to re-run with the new details.");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const sparse = signalCount < 4;

  return (
    <div className="card" style={{ marginBottom: 20, boxShadow: "none", borderColor: "var(--line)" }}>
      <div className="spread" style={{ alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span className="eyebrow">Improve this profile</span>
          <p className="small soft" style={{ margin: "4px 0 0" }}>
            {noWebsite
              ? "No company website on file — the website is the highest-value source for private companies. Add it below, then re-research."
              : sparse
                ? "This account has limited evidence. Add a ticker or aliases to improve matching, then re-research."
                : "Add a website, ticker, or aliases to sharpen matching, then re-research."}
          </p>
        </div>
        <button className="btn btn-sm" onClick={() => setOpen((v) => !v)}>{open ? "Hide" : "Edit details"}</button>
      </div>

      {open && (
        <div style={{ marginTop: 14 }} className="stack">
          <div className="row-wrap" style={{ gap: 12 }}>
            <label className="stack" style={{ gap: 4, flex: "1 1 220px" }}>
              <span className="tiny muted">Website{noWebsite ? " (recommended)" : ""}</span>
              <input className="input input-sm" placeholder="https://example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
            <label className="stack" style={{ gap: 4, flex: "0 1 140px" }}>
              <span className="tiny muted">Ticker (if public)</span>
              <input className="input input-sm" placeholder="e.g. PFE" value={ticker} onChange={(e) => setTicker(e.target.value)} />
            </label>
          </div>
          <label className="stack" style={{ gap: 4 }}>
            <span className="tiny muted">Aliases (comma-separated — legal name, brand, abbreviations)</span>
            <input className="input input-sm" style={{ width: "100%" }} placeholder="acme bio, acme biosciences, abc" value={aliases} onChange={(e) => setAliases(e.target.value)} />
          </label>
          <div className="row" style={{ gap: 10, alignItems: "center" }}>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save details"}</button>
            {msg && <span className="tiny muted">{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
