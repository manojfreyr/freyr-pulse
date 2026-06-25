"use client";

import Link from "next/link";
import { useSavedAccounts } from "@/lib/store/useSavedAccounts";
import { relativeFromNow } from "@/lib/utils/format";

export function AccountsList() {
  const { accounts, hydrated, unsave } = useSavedAccounts();

  if (!hydrated) {
    return <div className="card"><p className="muted" style={{ margin: 0 }}>Loading saved accounts…</p></div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="card card-pad-lg" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>No saved accounts yet</div>
        <p className="soft" style={{ maxWidth: 460, margin: "0 auto 18px" }}>
          Open a company profile and choose <span className="strong">Save account</span> to track it here with owner, priority, notes, and relationship status.
        </p>
        <Link href="/" className="btn btn-primary">Search companies</Link>
      </div>
    );
  }

  const sorted = [...accounts].sort((a, b) => b.opportunityScore - a.opportunityScore);

  return (
    <div className="stack">
      {sorted.map((a) => (
        <div key={a.companyId} className="card">
          <div className="spread" style={{ flexWrap: "wrap", gap: 14 }}>
            <div style={{ minWidth: 0 }}>
              <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
                <Link href={`/accounts?c=${a.companyId}`} className="strong" style={{ fontSize: 16, color: "var(--ink)" }}>{a.companyName}</Link>
                <span className={a.priority === "High" ? "chip chip-accent" : "chip"}>{a.priority} priority</span>
                <span className="chip">{a.relationshipStatus}</span>
              </div>
              <div className="row-wrap tiny muted" style={{ gap: 12, marginTop: 8 }}>
                <span>Owner: {a.accountOwner}</span>
                <span>· Score {a.opportunityScore}</span>
                <span>· MSA: {a.msaStatus}</span>
                <span>· Saved {relativeFromNow(a.lastRefreshed)}</span>
              </div>
              {a.tags.length > 0 && (
                <div className="row-wrap" style={{ gap: 6, marginTop: 10 }}>
                  {a.tags.map((t) => <span key={t} className="chip chip-mono">{t}</span>)}
                </div>
              )}
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Link href={`/accounts?c=${a.companyId}`} className="btn btn-sm">Open</Link>
              <button className="btn btn-sm" onClick={() => unsave(a.companyId)}>Remove</button>
            </div>
          </div>
          {a.nextAction && a.nextAction !== "—" && (
            <>
              <hr className="hr-dotted" />
              <p className="small soft" style={{ margin: 0 }}><span className="eyebrow">Next action · </span>{a.nextAction}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
