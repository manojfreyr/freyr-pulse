"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Company, SearchResult, SearchFieldKind } from "@/lib/types";
import { searchService } from "@/lib/api/searchService";
import { COMPANIES } from "@/lib/mock/companies";
import { LevelBadge } from "@/components/ui/Score";

const FUTURE_FIELDS: { kind: SearchFieldKind; label: string }[] = [
  { kind: "linkedin-url", label: "LinkedIn URL" },
  { kind: "stock-ticker", label: "Stock ticker" },
  { kind: "contact-name", label: "Contact name" },
  { kind: "product-name", label: "Product" },
  { kind: "therapeutic-area", label: "Therapeutic area" },
  { kind: "competitor", label: "Competitor" },
];

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    searchService.search(query).then((r) => {
      if (active) {
        setResults(r);
        setSearched(true);
      }
    });
    return () => {
      active = false;
    };
  }, [query]);

  const enabled = useMemo(() => searchService.enabledFields(), []);

  function open(company: Company) {
    router.push(`/company/${company.id}/`);
  }

  return (
    <div>
      <div className="card card-pad-lg" style={{ borderColor: "var(--accent-line)" }}>
        <label className="field-label" htmlFor="universal-search">Search by company name or website</label>
        <div className="row" style={{ gap: 10 }}>
          <input
            id="universal-search"
            className="input"
            placeholder="e.g. Pfizer, modernatx.com, Amgen…"
            value={query}
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) open(results[0].company);
            }}
          />
          <button className="btn btn-primary nowrap" disabled={!results[0]} onClick={() => results[0] && open(results[0].company)}>
            Open profile
          </button>
        </div>

        <div className="row-wrap" style={{ gap: 8, marginTop: 14 }}>
          {enabled.map((f) => (
            <span key={f} className="chip chip-accent mono">{f === "company-name" ? "Company name" : "Website"}</span>
          ))}
          {FUTURE_FIELDS.map((f) => (
            <span key={f.kind} className="chip" title="Coming in a later phase" style={{ opacity: 0.7 }}>
              {f.label} <span className="mono tiny" style={{ marginLeft: 4 }}>soon</span>
            </span>
          ))}
        </div>
      </div>

      {searched && (
        <div style={{ marginTop: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            {results.length ? `${results.length} match${results.length === 1 ? "" : "es"}` : "No matches"}
          </div>
          {results.length === 0 ? (
            <div className="card">
              <p className="soft" style={{ margin: 0 }}>
                No company matched &ldquo;{query}&rdquo;. Phase 1 covers a fixed set of five mock companies — try one below.
              </p>
            </div>
          ) : (
            <div className="stack">
              {results.map((r) => (
                <ResultRow key={r.company.id} result={r} onOpen={() => open(r.company)} />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Or jump into a profile</div>
        <div className="grid grid-3">
          {COMPANIES.map((c) => (
            <button key={c.id} type="button" className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => open(c)}>
              <div className="row" style={{ gap: 12 }}>
                <span aria-hidden style={{ width: 38, height: 38, borderRadius: 9, background: "var(--ink)", color: "var(--paper)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, flex: "0 0 auto" }}>{c.logoMonogram}</span>
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
    <button type="button" className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={onOpen}>
      <div className="spread" style={{ flexWrap: "wrap", gap: 12 }}>
        <div className="row" style={{ gap: 12 }}>
          <span aria-hidden style={{ width: 40, height: 40, borderRadius: 9, background: "var(--ink)", color: "var(--paper)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, flex: "0 0 auto" }}>{c.logoMonogram}</span>
          <div>
            <div className="strong">{c.name}</div>
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
