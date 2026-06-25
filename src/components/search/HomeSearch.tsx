"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/lib/types";
import * as api from "@/lib/client/api";
import { COMPANIES } from "@/lib/mock/companies";
import { LevelBadge } from "@/components/ui/Score";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState<SearchResult[]>([]);
  const [directory, setDirectory] = useState<api.DirectoryHit[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setAccounts([]); setDirectory([]); setSearched(false); return; }
    let active = true;
    const t = setTimeout(() => {
      api.discover(q)
        .then((r) => { if (active) { setAccounts(r.accounts); setDirectory(r.directory); setSearched(true); } })
        .catch(() => { if (active) { setAccounts([]); setDirectory([]); setSearched(true); } });
    }, 250);
    return () => { active = false; clearTimeout(t); };
  }, [query]);

  function open(id: string, onboard = false) {
    router.push(`/company?c=${encodeURIComponent(id)}${onboard ? "&onboard=1" : ""}`);
  }

  async function onboard(input: string, hints?: { name?: string; website?: string; ticker?: string; cik?: string }) {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const res = await api.onboardCompany(input, hints);
      open(res.company.id, res.created);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="card card-pad-lg" style={{ borderColor: "var(--accent-line)" }}>
        <label className="field-label" htmlFor="universal-search">Search or research any life-sciences company</label>
        <div className="row" style={{ gap: 10 }}>
          <input
            id="universal-search"
            className="input"
            placeholder="e.g. Pfizer, modernatx.com, a private biotech, CRO, CDMO, or device maker…"
            value={query}
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (accounts[0]) open(accounts[0].company.id);
              else if (query.trim()) onboard(query.trim());
            }}
          />
          <button className="btn btn-primary nowrap" disabled={busy || !query.trim()} onClick={() => (accounts[0] ? open(accounts[0].company.id) : onboard(query.trim()))}>
            {busy ? "Working…" : accounts[0] ? "Open" : "Research"}
          </button>
        </div>
        <p className="tiny muted" style={{ margin: "12px 0 0" }}>
          Public companies are matched against the SEC directory. Private, foreign, CRO/CDMO, biotech, and device makers can be onboarded by name or website URL — partial profiles are clearly labelled until live sources run.
        </p>
        {error && <p className="tiny" style={{ marginTop: 8, color: "var(--danger, #b91c1c)" }}>{error}</p>}
      </div>

      {searched && (
        <div style={{ marginTop: 18 }} className="stack">
          {accounts.length > 0 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Your accounts</div>
              <div className="stack">
                {accounts.map((r) => <ResultRow key={r.company.id} result={r} onOpen={() => open(r.company.id)} />)}
              </div>
            </div>
          )}

          {directory.length > 0 && (
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Public companies (SEC directory)</div>
              <div className="stack">
                {directory.map((d) => (
                  <button key={d.cik} type="button" className="card card-link" style={{ textAlign: "left" }} disabled={busy}
                    onClick={() => onboard(d.name, { name: d.name, ticker: d.ticker, cik: d.cik })}>
                    <div className="spread" style={{ flexWrap: "wrap", gap: 12 }}>
                      <span className="strong">{d.name}</span>
                      <span className="row" style={{ gap: 8 }}><span className="chip chip-mono">{d.ticker}</span><span className="tiny muted">research →</span></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && (
            <div className="card" style={{ background: "var(--accent-soft)", borderColor: "var(--accent-line)" }}>
              <div className="spread" style={{ flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <div>
                  <div className="strong">Research &ldquo;{query.trim()}&rdquo; as a new company</div>
                  <div className="tiny muted">Resolves identity, checks for duplicates, creates the profile, and runs live research.</div>
                </div>
                <button className="btn btn-primary" disabled={busy} onClick={() => onboard(query.trim())}>{busy ? "Working…" : "Research new"}</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Or jump into a demo profile</div>
        <div className="grid grid-3">
          {COMPANIES.map((c) => (
            <button key={c.id} type="button" className="card card-link" style={{ textAlign: "left" }} onClick={() => open(c.id)}>
              <div className="row" style={{ gap: 12 }}>
                <span aria-hidden style={{ width: 40, height: 40, borderRadius: 9, background: "linear-gradient(150deg, var(--navy), var(--navy-2))", color: "var(--ink-on-dark)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, flex: "0 0 auto" }}>{c.logoMonogram}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="strong nowrap" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div className="tiny muted">{c.snapshot.industrySegment}</div>
                </div>
              </div>
              <div className="spread" style={{ marginTop: 14 }}>
                <span className="mono small">Score {c.opportunity.score}</span>
                <LevelBadge level={c.opportunity.level} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ result, onOpen }: { result: SearchResult; onOpen: () => void }) {
  const c = result.company;
  return (
    <button type="button" className="card card-link" style={{ textAlign: "left" }} onClick={onOpen}>
      <div className="spread" style={{ flexWrap: "wrap", gap: 12 }}>
        <div className="row" style={{ gap: 12 }}>
          <span aria-hidden style={{ width: 40, height: 40, borderRadius: 9, background: "linear-gradient(150deg, var(--navy), var(--navy-2))", color: "var(--ink-on-dark)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, flex: "0 0 auto" }}>{c.logoMonogram}</span>
          <div>
            <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
              <span className="strong">{c.name}</span>
              {c.isPlaceholder && <span className="chip" style={{ background: "var(--surface-2)" }}>Placeholder</span>}
            </div>
            <div className="tiny muted">Matched on {result.matchedOn === "website" ? "website" : "company name"}: {result.matchedText}</div>
          </div>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <span className="mono small">Score {c.opportunity.score}</span>
          <LevelBadge level={c.opportunity.level} />
        </div>
      </div>
    </button>
  );
}
