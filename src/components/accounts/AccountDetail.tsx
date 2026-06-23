"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Company, PriorityLevel, RelationshipStatus, MsaStatus, SatisfactionLevel, SavedAccount } from "@/lib/types";
import { useSavedAccounts } from "@/lib/store/useSavedAccounts";
import { newAccountFromCompany } from "@/lib/accounts/helpers";
import * as api from "@/lib/client/api";
import { uid, nowIso, formatDate } from "@/lib/utils/format";

const PRIORITIES: PriorityLevel[] = ["High", "Medium", "Low"];
const STATUSES: RelationshipStatus[] = ["Prospect", "Existing Client", "Former Client", "Dormant", "Unknown"];
const MSA: MsaStatus[] = ["Active", "In negotiation", "None", "Unknown"];
const SAT: SatisfactionLevel[] = ["High", "Medium", "Low", "Unknown"];

export function AccountDetail({ companyId }: { companyId: string }) {
  const { accounts, hydrated, save, update, unsave } = useSavedAccounts();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyLoaded, setCompanyLoaded] = useState(false);
  const saved = accounts.find((a) => a.companyId === companyId);
  const [noteDraft, setNoteDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");

  useEffect(() => {
    let active = true;
    api
      .getCompany(companyId)
      .then((c) => active && setCompany(c))
      .catch(() => active && setCompany(null))
      .finally(() => active && setCompanyLoaded(true));
    return () => {
      active = false;
    };
  }, [companyId]);

  if (!hydrated || !companyLoaded) {
    return <div className="card"><p className="muted" style={{ margin: 0 }}>Loading…</p></div>;
  }

  if (!saved && !company) {
    return (
      <div className="card card-pad-lg" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Account not found</div>
        <p className="soft" style={{ maxWidth: 460, margin: "0 auto 18px" }}>
          We couldn&rsquo;t find this account. It may have been removed.
        </p>
        <Link href="/accounts" className="btn btn-primary">All saved accounts</Link>
      </div>
    );
  }

  if (!saved && company) {
    const preview = newAccountFromCompany(company);
    return (
      <div className="card card-pad-lg" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Not saved yet</div>
        <p className="soft" style={{ maxWidth: 460, margin: "0 auto 18px" }}>
          {company.name} isn&rsquo;t in your saved accounts. Save it to track owner, priority, relationship status, MSA details, and notes — shared across your team.
        </p>
        <div className="row" style={{ gap: 10, justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => save(company)}>Save account (score {preview.opportunityScore})</button>
          <Link href={`/company?c=${companyId}`} className="btn">View intelligence</Link>
        </div>
      </div>
    );
  }

  if (!saved) return null;

  const set = (patch: Partial<SavedAccount>) => update(companyId, patch);

  function addNote() {
    if (!noteDraft.trim()) return;
    set({ notes: [{ id: uid("note"), body: noteDraft.trim(), createdAt: nowIso() }, ...saved!.notes] });
    setNoteDraft("");
  }
  function removeNote(id: string) {
    set({ notes: saved!.notes.filter((n) => n.id !== id) });
  }
  function addTag() {
    const t = tagDraft.trim();
    if (!t || saved!.tags.includes(t)) return;
    set({ tags: [...saved!.tags, t] });
    setTagDraft("");
  }

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="spread" style={{ flexWrap: "wrap", gap: 12 }}>
        <Link href="/accounts" className="small muted">← All saved accounts</Link>
        <div className="row" style={{ gap: 8 }}>
          <Link href={`/company?c=${companyId}`} className="btn btn-sm">View intelligence</Link>
          <button className="btn btn-sm" onClick={() => unsave(companyId)}>Remove account</button>
        </div>
      </div>

      <section className="card card-pad-lg">
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>{saved.companyName}</h1>
        <div className="tiny muted" style={{ marginBottom: 18 }}>Opportunity score {saved.opportunityScore} · saved record (editable, shared across your team)</div>

        <div className="grid grid-3" style={{ gap: 16 }}>
          <Field label="Account owner">
            <input className="input" value={saved.accountOwner} onChange={(e) => set({ accountOwner: e.target.value })} />
          </Field>
          <Field label="Priority">
            <select className="select" value={saved.priority} onChange={(e) => set({ priority: e.target.value as PriorityLevel })}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Relationship status">
            <select className="select" value={saved.relationshipStatus} onChange={(e) => set({ relationshipStatus: e.target.value as RelationshipStatus })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </section>

      <section className="card card-pad-lg">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Relationship & commercial</div>
        <div className="grid grid-3" style={{ gap: 16 }}>
          <Field label="MSA status">
            <select className="select" value={saved.msaStatus} onChange={(e) => set({ msaStatus: e.target.value as MsaStatus })}>
              {MSA.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Preferred vendor">
            <select className="select" value={saved.preferredVendor ? "Yes" : "No"} onChange={(e) => set({ preferredVendor: e.target.value === "Yes" })}>
              <option>No</option><option>Yes</option>
            </select>
          </Field>
          <Field label="Satisfaction">
            <select className="select" value={saved.satisfaction} onChange={(e) => set({ satisfaction: e.target.value as SatisfactionLevel })}>
              {SAT.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Last interaction">
            <input className="input" value={saved.lastInteraction} onChange={(e) => set({ lastInteraction: e.target.value })} placeholder="e.g. Intro call, May" />
          </Field>
          <Field label="Next action">
            <input className="input" value={saved.nextAction} onChange={(e) => set({ nextAction: e.target.value })} />
          </Field>
        </div>
        <p className="tiny muted" style={{ marginTop: 12, marginBottom: 0 }}>MSA / preferred-vendor and current-services fields are manual placeholders in Phase 1; later phases can sync them from CRM.</p>
      </section>

      <section className="card card-pad-lg">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Tags</div>
        <div className="row-wrap" style={{ gap: 8, marginBottom: 12 }}>
          {saved.tags.length === 0 && <span className="small muted">No tags yet.</span>}
          {saved.tags.map((t) => (
            <span key={t} className="chip">{t}
              <button onClick={() => set({ tags: saved.tags.filter((x) => x !== t) })} className="btn-ghost" style={{ border: 0, background: "none", cursor: "pointer", padding: 0, marginLeft: 4, color: "var(--muted)" }} aria-label={`Remove ${t}`}>×</button>
            </span>
          ))}
        </div>
        <div className="row" style={{ gap: 10, maxWidth: 380 }}>
          <input className="input" value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} placeholder="Add a tag" onKeyDown={(e) => e.key === "Enter" && addTag()} />
          <button className="btn nowrap" onClick={addTag}>Add tag</button>
        </div>
      </section>

      <section className="card card-pad-lg">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Notes</div>
        <div className="stack" style={{ marginBottom: 14 }}>
          <textarea className="textarea" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Log a call, meeting, or insight…" />
          <div><button className="btn btn-primary" onClick={addNote} disabled={!noteDraft.trim()}>Add note</button></div>
        </div>
        {saved.notes.length === 0 ? (
          <p className="small muted" style={{ margin: 0 }}>No notes yet.</p>
        ) : (
          <div className="stack">
            {saved.notes.map((n) => (
              <div key={n.id} className="card" style={{ boxShadow: "none", padding: 14 }}>
                <div className="spread">
                  <span className="tiny muted">{formatDate(n.createdAt)}</span>
                  <button className="btn-ghost tiny" style={{ border: 0, background: "none", cursor: "pointer", color: "var(--muted)" }} onClick={() => removeNote(n.id)}>Delete</button>
                </div>
                <p className="small soft" style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
