"use client";

import { useEffect, useMemo, useState } from "react";
import type { FreyrService, PersonaId, ServiceCategory, TriggerType } from "@/lib/types";
import { SERVICE_CATEGORIES, SERVICE_LINES } from "@/lib/mock/services";
import { PERSONAS } from "@/lib/mock/personas";
import {
  loadCatalog, upsertService, deleteService, toggleActive, resetCatalog, emptyService,
} from "@/lib/store/serviceCatalog";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";

const TRIGGER_TYPES: TriggerType[] = [
  "M&A", "Divestment", "Partnership", "Product Launch", "Regulatory Approval", "Warning Letter",
  "Recall", "Clinical Update", "Geographic Expansion", "Restructuring", "Digital Transformation",
  "Hiring", "Vendor Consolidation",
];

export default function ServicesPage() {
  const [catalog, setCatalog] = useState<FreyrService[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState("");
  const [lineFilter, setLineFilter] = useState<string>("All");
  const [showInactive, setShowInactive] = useState(true);
  const [editing, setEditing] = useState<FreyrService | null>(null);

  useEffect(() => {
    setCatalog(loadCatalog());
    setHydrated(true);
  }, []);

  const lines = useMemo(() => ["All", ...SERVICE_LINES, ...catalog.map((s) => s.serviceLine)].filter((v, i, a) => a.indexOf(v) === i), [catalog]);

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return catalog
      .filter((s) => (lineFilter === "All" ? true : s.serviceLine === lineFilter))
      .filter((s) => (showInactive ? true : s.activeStatus))
      .filter((s) => (!q ? true : (s.serviceName + s.serviceCategory + s.keywords.join(" ")).toLowerCase().includes(q)));
  }, [catalog, filter, lineFilter, showInactive]);

  const grouped = useMemo(() => {
    const map = new Map<string, FreyrService[]>();
    for (const s of visible) {
      if (!map.has(s.serviceLine)) map.set(s.serviceLine, []);
      map.get(s.serviceLine)!.push(s);
    }
    return Array.from(map.entries());
  }, [visible]);

  function handleSave(service: FreyrService) {
    setCatalog((list) => upsertService(list, service));
    setEditing(null);
  }
  function handleDelete(id: string) {
    if (typeof window !== "undefined" && !window.confirm("Delete this service? This cannot be undone.")) return;
    setCatalog((list) => deleteService(list, id));
  }
  function handleToggle(id: string) {
    setCatalog((list) => toggleActive(list, id));
  }
  function handleReset() {
    if (typeof window !== "undefined" && !window.confirm("Reset the catalog to the seed services? Your edits will be lost.")) return;
    setCatalog(resetCatalog());
  }
  function startAdd() {
    setEditing(emptyService(`svc-${Math.random().toString(36).slice(2, 8)}`));
  }

  const activeCount = catalog.filter((s) => s.activeStatus).length;

  return (
    <div>
      <section className="spread" style={{ marginBottom: 22, flexWrap: "wrap", gap: 14 }}>
        <div>
          <span className="eyebrow">Freyr offering</span>
          <h1 className="display" style={{ fontSize: 28, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Service Catalog</h1>
          <p className="soft" style={{ margin: 0, maxWidth: 640 }}>
            The single source of truth for Freyr services. Company recommendations are matched against this catalog.
            Edits are saved in your browser (Phase 1) and structured to move to a database later.
          </p>
        </div>
        <div className="row-wrap" style={{ gap: 10 }}>
          <button className="btn btn-primary" onClick={startAdd}>+ Add service</button>
          <button className="btn" onClick={handleReset}>Reset to seed</button>
        </div>
      </section>

      <div className="row-wrap" style={{ gap: 10, marginBottom: 18, alignItems: "center" }}>
        <DemoDataNotice />
        <span className="chip">{catalog.length} services</span>
        <span className="chip chip-accent">{activeCount} active</span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="grid grid-3" style={{ gap: 14 }}>
          <div>
            <label className="field-label">Search</label>
            <input className="input" placeholder="Name, category, keyword…" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Service line</label>
            <select className="select" value={lineFilter} onChange={(e) => setLineFilter(e.target.value)}>
              {lines.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Status</label>
            <select className="select" value={showInactive ? "all" : "active"} onChange={(e) => setShowInactive(e.target.value === "all")}>
              <option value="all">Show all</option>
              <option value="active">Active only</option>
            </select>
          </div>
        </div>
      </div>

      {!hydrated ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>Loading catalog…</p></div>
      ) : visible.length === 0 ? (
        <div className="card card-pad-lg" style={{ textAlign: "center" }}>
          <p className="soft" style={{ margin: 0 }}>No services match your filters.</p>
        </div>
      ) : (
        <div className="stack" style={{ gap: 24 }}>
          {grouped.map(([line, items]) => (
            <div key={line}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>{line} · {items.length}</div>
              <div className="grid grid-2">
                {items.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    onEdit={() => setEditing(s)}
                    onDelete={() => handleDelete(s.id)}
                    onToggle={() => handleToggle(s.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ServiceEditor
          initial={editing}
          existing={catalog}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ServiceCard({
  service, onEdit, onDelete, onToggle,
}: {
  service: FreyrService; onEdit: () => void; onDelete: () => void; onToggle: () => void;
}) {
  return (
    <div className="card" style={{ boxShadow: "none", opacity: service.activeStatus ? 1 : 0.62 }}>
      <div className="spread" style={{ alignItems: "flex-start", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>{service.serviceCategory}</div>
          <div className="strong" style={{ fontSize: 15.5 }}>{service.serviceName || "(unnamed service)"}</div>
        </div>
        <span className={service.activeStatus ? "chip chip-accent" : "chip"}>{service.activeStatus ? "Active" : "Inactive"}</span>
      </div>
      <p className="small soft" style={{ margin: "10px 0" }}>{service.description || "No description yet."}</p>
      {service.keywords.length > 0 && (
        <div className="row-wrap" style={{ gap: 6, marginBottom: 6 }}>
          {service.keywords.slice(0, 5).map((k) => <span key={k} className="chip chip-mono">{k}</span>)}
        </div>
      )}
      <hr className="hr-dotted" />
      <div className="row-wrap" style={{ gap: 8 }}>
        <button className="btn btn-sm" onClick={onEdit}>Edit</button>
        <button className="btn btn-sm" onClick={onToggle}>{service.activeStatus ? "Deactivate" : "Activate"}</button>
        <button className="btn btn-sm" onClick={onDelete} style={{ color: "var(--danger)", borderColor: "#e6c3c3" }}>Delete</button>
        <span className="tiny muted" style={{ marginLeft: "auto", alignSelf: "center" }}>Updated {service.lastUpdated}</span>
      </div>
    </div>
  );
}

/* --------------------------- Editor (modal) --------------------------- */

function ServiceEditor({
  initial, existing, onCancel, onSave,
}: {
  initial: FreyrService; existing: FreyrService[]; onCancel: () => void; onSave: (s: FreyrService) => void;
}) {
  const [draft, setDraft] = useState<FreyrService>(initial);
  const isNew = !existing.some((s) => s.id === initial.id);

  function set<K extends keyof FreyrService>(key: K, value: FreyrService[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  function togglePersona(id: PersonaId) {
    set("targetPersonas", draft.targetPersonas.includes(id) ? draft.targetPersonas.filter((p) => p !== id) : [...draft.targetPersonas, id]);
  }
  function toggleTrigger(t: TriggerType) {
    set("buyingTriggers", draft.buyingTriggers.includes(t) ? draft.buyingTriggers.filter((x) => x !== t) : [...draft.buyingTriggers, t]);
  }

  const valid = draft.serviceName.trim().length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, background: "rgba(11,31,51,0.55)", display: "grid", placeItems: "start center", padding: "40px 16px", zIndex: 50, overflowY: "auto" }}
      onClick={onCancel}
    >
      <div className="card card-pad-lg fade-in" style={{ width: "min(760px, 100%)", boxShadow: "var(--shadow-md)" }} onClick={(e) => e.stopPropagation()}>
        <div className="spread" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20 }}>{isNew ? "Add service" : "Edit service"}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <div className="stack" style={{ gap: 16 }}>
          <div className="grid grid-2" style={{ gap: 14 }}>
            <Field label="Service name">
              <input className="input" value={draft.serviceName} onChange={(e) => set("serviceName", e.target.value)} placeholder="e.g. Global Labeling Management" />
            </Field>
            <Field label="Service line">
              <input className="input" list="service-lines" value={draft.serviceLine} onChange={(e) => set("serviceLine", e.target.value)} />
              <datalist id="service-lines">{SERVICE_LINES.map((l) => <option key={l} value={l} />)}</datalist>
            </Field>
          </div>

          <div className="grid grid-2" style={{ gap: 14 }}>
            <Field label="Category">
              <select className="select" value={draft.serviceCategory} onChange={(e) => set("serviceCategory", e.target.value as ServiceCategory)}>
                {SERVICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Active status">
              <select className="select" value={draft.activeStatus ? "active" : "inactive"} onChange={(e) => set("activeStatus", e.target.value === "active")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea className="textarea" value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <Field label="Target buyer personas">
            <div className="row-wrap" style={{ gap: 8 }}>
              {PERSONAS.map((p) => {
                const on = draft.targetPersonas.includes(p.id);
                return (
                  <button key={p.id} type="button" className={on ? "chip chip-accent" : "chip"} style={{ cursor: "pointer" }} onClick={() => togglePersona(p.id)}>
                    {on ? "✓ " : ""}{p.title}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Buying triggers">
            <div className="row-wrap" style={{ gap: 8 }}>
              {TRIGGER_TYPES.map((t) => {
                const on = draft.buyingTriggers.includes(t);
                return (
                  <button key={t} type="button" className={on ? "chip chip-accent" : "chip"} style={{ cursor: "pointer" }} onClick={() => toggleTrigger(t)}>
                    {on ? "✓ " : ""}{t}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid grid-2" style={{ gap: 14 }}>
            <ListField label="Pain points solved" hint="One per line" value={draft.painPointsSolved} onChange={(v) => set("painPointsSolved", v)} />
            <ListField label="Relevant company signals" hint="One per line (e.g. global, oncology, MDR)" value={draft.relevantCompanySignals} onChange={(v) => set("relevantCompanySignals", v)} />
          </div>

          <div className="grid grid-2" style={{ gap: 14 }}>
            <CsvField label="Keywords / signals" hint="Comma-separated" value={draft.keywords} onChange={(v) => set("keywords", v)} />
            <CsvField label="Related services" hint="Comma-separated service ids" value={draft.relatedServices} onChange={(v) => set("relatedServices", v)} />
          </div>

          <Field label="Example opening message">
            <textarea className="textarea" value={draft.exampleOpeningMessage} onChange={(e) => set("exampleOpeningMessage", e.target.value)} />
          </Field>

          <div className="grid grid-2" style={{ gap: 14 }}>
            <ListField label="Differentiation points" hint="One per line" value={draft.differentiationPoints} onChange={(v) => set("differentiationPoints", v)} />
            <ListField label="Confidence rules / placeholders" hint="One per line" value={draft.confidenceRules} onChange={(v) => set("confidenceRules", v)} />
          </div>
        </div>

        <hr className="hr" />
        <div className="row" style={{ gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} onClick={() => onSave(draft)}>{isNew ? "Add service" : "Save changes"}</button>
        </div>
      </div>
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

function ListField({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className="field-label">{label} {hint && <span className="tiny muted" style={{ fontWeight: 400 }}>· {hint}</span>}</label>
      <textarea
        className="textarea"
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}
      />
    </div>
  );
}

function CsvField({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className="field-label">{label} {hint && <span className="tiny muted" style={{ fontWeight: 400 }}>· {hint}</span>}</label>
      <input
        className="input"
        value={value.join(", ")}
        onChange={(e) => onChange(e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
      />
    </div>
  );
}
