import { useState, useEffect, useCallback } from "react";

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  primary: "#2176C7",
  primaryDark: "#1a5fa0",
  primaryLight: "#E6F1FB",
  primaryMid: "#cde3f7",
  white: "#ffffff",
  bg: "#f4f7fb",
  sidebar: "#0C1F3D",
  sidebarText: "#a8bdd6",
  sidebarActive: "#2176C7",
  border: "#dde4ed",
  text: "#1a2535",
  textSub: "#5a6a7e",
  textMuted: "#8fa0b4",
  success: "#16a34a",
  successBg: "#dcfce7",
  warning: "#d97706",
  warningBg: "#fef3c7",
  danger: "#dc2626",
  dangerBg: "#fee2e2",
  info: "#0369a1",
  infoBg: "#e0f2fe",
  purple: "#7c3aed",
  purpleBg: "#ede9fe",
};

// ─── Utility helpers ──────────────────────────────────────────────────────────
const s = (obj) => ({ ...obj }); // passthrough for IDE hints
const fmt = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
const fmtN = (n) => new Intl.NumberFormat("en-US").format(n);
const pct = (n) => `${n.toFixed(1)}%`;

// ─── Shared primitives ────────────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style }) => {
  const base = {
    border: "none", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, transition: "all 0.15s", opacity: disabled ? 0.5 : 1,
    padding: size === "sm" ? "5px 12px" : size === "lg" ? "10px 22px" : "7px 16px",
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
  };
  const variants = {
    primary: { background: C.primary, color: C.white },
    secondary: { background: C.white, color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost: { background: "transparent", color: C.textSub },
    danger: { background: C.danger, color: C.white },
    success: { background: C.success, color: C.white },
    warning: { background: C.warning, color: C.white },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = "blue", dot }) => {
  const colors = {
    blue: { bg: C.primaryLight, text: C.primary },
    green: { bg: C.successBg, text: C.success },
    amber: { bg: C.warningBg, text: C.warning },
    red: { bg: C.dangerBg, text: C.danger },
    purple: { bg: C.purpleBg, text: C.purple },
    gray: { bg: "#f1f5f9", text: C.textSub },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.text }} />}
      {children}
    </span>
  );
};

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, ...style, cursor: onClick ? "pointer" : undefined }}>
    {children}
  </div>
);

const KpiCard = ({ label, value, sub, accent = C.primary, badge }) => (
  <Card style={{ borderTop: `3px solid ${accent}`, flex: 1, minWidth: 150 }}>
    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "6px 0 4px" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: C.textSub }}>{sub}</div>}
    {badge && <div style={{ marginTop: 6 }}>{badge}</div>}
  </Card>
);

const Input = ({ label, value, onChange, type = "text", placeholder, required, readOnly, style, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textSub }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
    <input
      type={type} value={value} onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder} readOnly={readOnly}
      style={{ border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "7px 11px", fontSize: 13, color: C.text, background: readOnly ? C.bg : C.white, outline: "none", ...style }}
    />
    {hint && <div style={{ fontSize: 11, color: C.textMuted }}>{hint}</div>}
  </div>
);

const Select = ({ label, value, onChange, options, required, style, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textSub }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
    <select value={value} onChange={e => onChange?.(e.target.value)}
      style={{ border: `1.5px solid ${C.border}`, borderRadius: 6, padding: "7px 11px", fontSize: 13, color: value ? C.text : C.textMuted, background: C.white, outline: "none", ...style }}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const Modal = ({ open, onClose, title, children, width = 640 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.white, borderRadius: 12, width: "100%", maxWidth: width, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.textMuted }}>×</button>
        </div>
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

const Table = ({ cols, rows, onRow }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>{cols.map(c => <th key={c.key} style={{ padding: "9px 14px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: c.right ? "right" : "left", fontWeight: 600, color: C.textSub, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} onClick={() => onRow?.(r)} style={{ borderBottom: `1px solid ${C.border}`, cursor: onRow ? "pointer" : undefined, transition: "background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryLight}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {cols.map(c => <td key={c.key} style={{ padding: "10px 14px", color: C.text, textAlign: c.right ? "right" : "left" }}>{c.render ? c.render(r) : r[c.key]}</td>)}
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={cols.length} style={{ padding: "32px 14px", textAlign: "center", color: C.textMuted }}>No records found</td></tr>}
      </tbody>
    </table>
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 2, borderBottom: `1.5px solid ${C.border}`, marginBottom: 20 }}>
    {tabs.map(t => (
      <button key={t.key} onClick={() => onChange(t.key)} style={{
        padding: "9px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: active === t.key ? 700 : 500,
        color: active === t.key ? C.primary : C.textSub, borderBottom: active === t.key ? `2.5px solid ${C.primary}` : "2.5px solid transparent", marginBottom: -1.5, transition: "all 0.15s"
      }}>{t.label}{t.count !== undefined && <span style={{ marginLeft: 6, background: active === t.key ? C.primary : C.border, color: active === t.key ? C.white : C.textSub, borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{t.count}</span>}</button>
    ))}
  </div>
);

const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h2>
      {sub && <p style={{ margin: "4px 0 0", color: C.textSub, fontSize: 13 }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const Alert = ({ type = "info", children }) => {
  const t = { info: { bg: C.infoBg, text: C.info, icon: "ℹ" }, warning: { bg: C.warningBg, text: C.warning, icon: "⚠" }, danger: { bg: C.dangerBg, text: C.danger, icon: "✕" }, success: { bg: C.successBg, text: C.success, icon: "✓" } };
  const cfg = t[type];
  return <div style={{ background: cfg.bg, color: cfg.text, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 500, display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}><span>{cfg.icon}</span><div>{children}</div></div>;
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const CURRENCIES = ["USD", "GBP", "EUR", "CHF", "JPY", "CAD", "AUD", "INR", "SGD", "AED"];
const ROLES = ["Senior Regulatory Affairs Specialist", "Regulatory Affairs Specialist", "Clinical Writer", "Senior Clinical Writer", "Publishing Specialist", "Project Manager", "Principal Consultant", "Associate Consultant"];
const GRADES = ["Associate", "Specialist", "Senior Specialist", "Principal", "Director", "Senior Director"];
const LOCATIONS = ["US", "UK", "EU", "India", "Singapore", "UAE"];
const DIVISIONS = ["Regulatory Affairs", "Clinical Writing", "Publishing", "PV & Safety"];
const DEPARTMENTS = ["Global RA", "CMC", "Labelling", "Clinical Operations", "Medical Writing", "PV Operations"];
const CUSTOMERS_LIST = ["Johnson & Johnson", "AstraZeneca", "GSK", "Pfizer", "Novartis", "Roche", "Merck", "Sanofi", "Bayer", "Abbott"];
const PROJECTS_LIST = [
  { id: "p1", name: "J&J RA Global Support", customer: "Johnson & Johnson", contract: "MSA-JNJ-2024" },
  { id: "p2", name: "AZ Clinical Writing", customer: "AstraZeneca", contract: "MSA-AZ-2024" },
  { id: "p3", name: "GSK Publishing Suite", customer: "GSK", contract: "MSA-GSK-2023" },
  { id: "p4", name: "Pfizer Labelling Hub", customer: "Pfizer", contract: "SOW-PFZ-2025" },
  { id: "p5", name: "Novartis PV Support", customer: "Novartis", contract: "MSA-NOV-2024" },
];
const SERVICE_LINES_LIST = [
  { id: "sl1", name: "HA Query Support", projectId: "p1", project: "J&J RA Global Support", customer: "Johnson & Johnson", commercialType: "T&M Managed", division: "Regulatory Affairs", dept: "Global RA", currency: "USD" },
  { id: "sl2", name: "Regulatory Affairs Fixed", projectId: "p1", project: "J&J RA Global Support", customer: "Johnson & Johnson", commercialType: "Fixed Price", division: "Regulatory Affairs", dept: "CMC", currency: "USD" },
  { id: "sl3", name: "Clinical Writing Support", projectId: "p2", project: "AZ Clinical Writing", customer: "AstraZeneca", commercialType: "T&M Staffing", division: "Clinical Writing", dept: "Medical Writing", currency: "GBP" },
  { id: "sl4", name: "Publishing Unit Work", projectId: "p3", project: "GSK Publishing Suite", customer: "GSK", commercialType: "Unit-Based", division: "Publishing", dept: "Labelling", currency: "GBP" },
  { id: "sl5", name: "PV Safety Review", projectId: "p5", project: "Novartis PV Support", customer: "Novartis", commercialType: "Recurring", division: "PV & Safety", dept: "PV Operations", currency: "EUR" },
];
const COMMERCIAL_TYPES = ["Fixed Price", "T&M Staffing", "T&M Managed", "Unit-Based", "Recurring"];
const MONTHS_2026 = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"];
const CUR_MONTH_IDX = 3; // Apr 2026

// ─── Initial Rate Card data ───────────────────────────────────────────────────
const initRates = [
  { id: "r1", role: "Senior Regulatory Affairs Specialist", grade: "Senior Specialist", location: "US", currency: "USD", unit: "Hour", rate: 185, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r2", role: "Regulatory Affairs Specialist", grade: "Specialist", location: "UK", currency: "GBP", unit: "Hour", rate: 120, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r3", role: "Clinical Writer", grade: "Specialist", location: "US", currency: "USD", unit: "Hour", rate: 145, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r4", role: "Senior Clinical Writer", grade: "Senior Specialist", location: "UK", currency: "GBP", unit: "Hour", rate: 155, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r5", role: "Publishing Specialist", grade: "Specialist", location: "India", currency: "USD", unit: "Page", rate: 45, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r6", role: "Project Manager", grade: "Principal", location: "US", currency: "USD", unit: "Hour", rate: 210, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r7", role: "Principal Consultant", grade: "Director", location: "EU", currency: "EUR", unit: "Day", rate: 1800, effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" },
  { id: "r8", role: "Associate Consultant", grade: "Associate", location: "India", currency: "USD", unit: "Hour", rate: 55, effectiveFrom: "2025-01-01", effectiveTo: "2025-12-31", status: "Retired" },
];

const initOverrides = [
  { id: "o1", serviceLine: "HA Query Support", project: "J&J RA Global Support", customer: "Johnson & Johnson", role: "Senior Regulatory Affairs Specialist", stdRate: 185, overrideRate: 195, currency: "USD", unit: "Hour", deviation: 5.4, reason: "Strategic account premium", effectiveFrom: "2026-01-01" },
  { id: "o2", serviceLine: "Clinical Writing Support", project: "AZ Clinical Writing", customer: "AstraZeneca", role: "Senior Clinical Writer", stdRate: 155, overrideRate: 130, currency: "GBP", unit: "Hour", deviation: -16.1, reason: "Volume discount — 2000+ hrs/yr commitment", effectiveFrom: "2026-01-01" },
  { id: "o3", serviceLine: "PV Safety Review", project: "Novartis PV Support", customer: "Novartis", role: "Principal Consultant", stdRate: 1800, overrideRate: 1950, currency: "EUR", unit: "Day", deviation: 8.3, reason: "Specialist premium — rare expertise", effectiveFrom: "2026-03-01" },
];

const initAlerts = [
  { id: "a1", serviceLine: "HA Query Support", project: "J&J RA Global Support", deliveryOwner: "Jane Smith", role: "Senior Regulatory Affairs Specialist", oldRate: 175, newRate: 185, currency: "USD", effectiveDate: "2026-01-01", status: "Pending", daysOverdue: 94 },
  { id: "a2", serviceLine: "Clinical Writing Support", project: "AZ Clinical Writing", deliveryOwner: "Mike Kumar", role: "Senior Clinical Writer", oldRate: 145, newRate: 155, currency: "GBP", effectiveDate: "2026-01-01", status: "Acknowledged", daysOverdue: 0 },
  { id: "a3", serviceLine: "PV Safety Review", project: "Novartis PV Support", deliveryOwner: "Sara Lee", role: "Principal Consultant", oldRate: 1700, newRate: 1800, currency: "EUR", effectiveDate: "2026-01-01", status: "Pending", daysOverdue: 94 },
  { id: "a4", serviceLine: "Regulatory Affairs Fixed", project: "J&J RA Global Support", deliveryOwner: "Jane Smith", role: "Project Manager", oldRate: 195, newRate: 210, currency: "USD", effectiveDate: "2026-01-01", status: "Pending", daysOverdue: 94 },
];

// ─── FX seed data ─────────────────────────────────────────────────────────────
const FX_PAIRS = ["GBP/USD", "EUR/USD", "CHF/USD", "JPY/USD", "CAD/USD", "AUD/USD", "INR/USD", "SGD/USD", "AED/USD"];
const initFxRates = [
  // GBP
  { id: "fx1", pair: "GBP/USD", from: "GBP", to: "USD", month: "Jan 2026", rate: 1.2720, enteredBy: "Admin", enteredAt: "2026-02-05" },
  { id: "fx2", pair: "GBP/USD", from: "GBP", to: "USD", month: "Feb 2026", rate: 1.2680, enteredBy: "Admin", enteredAt: "2026-03-04" },
  { id: "fx3", pair: "GBP/USD", from: "GBP", to: "USD", month: "Mar 2026", rate: 1.2750, enteredBy: "Admin", enteredAt: "2026-04-03" },
  // EUR
  { id: "fx4", pair: "EUR/USD", from: "EUR", to: "USD", month: "Jan 2026", rate: 1.0840, enteredBy: "Admin", enteredAt: "2026-02-05" },
  { id: "fx5", pair: "EUR/USD", from: "EUR", to: "USD", month: "Feb 2026", rate: 1.0790, enteredBy: "Admin", enteredAt: "2026-03-04" },
  { id: "fx6", pair: "EUR/USD", from: "EUR", to: "USD", month: "Mar 2026", rate: 1.0820, enteredBy: "Admin", enteredAt: "2026-04-03" },
];

// ─── Forecast seed data ───────────────────────────────────────────────────────
const buildForecastEntries = (slId, commercialType) => {
  const entries = {};
  MONTHS_2026.forEach((m, i) => {
    const isPast = i < CUR_MONTH_IDX;
    let qty = null, rate = null, amount = 0, actual = null, note = "";
    if (commercialType === "T&M Managed" || commercialType === "T&M Staffing") {
      qty = 80 + Math.round(Math.random() * 40);
      rate = 185;
      amount = qty * rate;
      actual = isPast ? amount * (0.85 + Math.random() * 0.25) : null;
    } else if (commercialType === "Fixed Price") {
      amount = [45000, 0, 60000, 0, 45000, 0, 60000, 0, 45000, 0, 60000, 30000][i] || 0;
      actual = isPast && amount > 0 ? amount * (0.9 + Math.random() * 0.15) : null;
    } else if (commercialType === "Unit-Based") {
      qty = 200 + Math.round(Math.random() * 100);
      rate = 45;
      amount = qty * rate;
      actual = isPast ? amount * (0.88 + Math.random() * 0.2) : null;
    } else {
      amount = 25000;
      actual = isPast ? 25000 : null;
    }
    entries[m] = { qty, rate, amount: Math.round(amount), actual: actual ? Math.round(actual) : null, note, locked: isPast };
  });
  return entries;
};

const initForecastVersions = {
  sl1: [
    { id: "v1", name: "Baseline", type: "Baseline", createdBy: "Jane Smith", createdAt: "2026-01-10", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v2", name: "Q2 Revision", type: "Working", createdBy: "Jane Smith", createdAt: "2026-04-01", reason: "Scope increase — HA queries volume up 20%", locked: false, isWorking: true },
  ],
  sl2: [
    { id: "v3", name: "Baseline", type: "Baseline", createdBy: "Jane Smith", createdAt: "2026-01-10", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v4", name: "Q1 Revision", type: "Working", createdBy: "Jane Smith", createdAt: "2026-02-15", reason: "Milestone replan post kickoff", locked: false, isWorking: true },
  ],
  sl3: [
    { id: "v5", name: "Baseline", type: "Baseline", createdBy: "Mike Kumar", createdAt: "2026-01-12", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v6", name: "Q2 Revision", type: "Working", createdBy: "Mike Kumar", createdAt: "2026-04-02", reason: "Resource mix change", locked: false, isWorking: true },
  ],
  sl4: [
    { id: "v7", name: "Baseline", type: "Baseline", createdBy: "Sara Lee", createdAt: "2026-01-15", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v8", name: "Q2 Revision", type: "Working", createdBy: "Sara Lee", createdAt: "2026-04-03", reason: "Page volume revised upward", locked: false, isWorking: true },
  ],
  sl5: [
    { id: "v9", name: "Baseline", type: "Baseline", createdBy: "Sara Lee", createdAt: "2026-01-20", reason: "Initial forecast", locked: true, isWorking: false },
    { id: "v10", name: "Q2 Revision", type: "Working", createdBy: "Sara Lee", createdAt: "2026-04-05", reason: "Extended contract period", locked: false, isWorking: true },
  ],
};

const initForecastEntries = {
  sl1: { v1: buildForecastEntries("sl1", "T&M Managed"), v2: buildForecastEntries("sl1", "T&M Managed") },
  sl2: { v3: buildForecastEntries("sl2", "Fixed Price"), v4: buildForecastEntries("sl2", "Fixed Price") },
  sl3: { v5: buildForecastEntries("sl3", "T&M Staffing"), v6: buildForecastEntries("sl3", "T&M Staffing") },
  sl4: { v7: buildForecastEntries("sl4", "Unit-Based"), v8: buildForecastEntries("sl4", "Unit-Based") },
  sl5: { v9: buildForecastEntries("sl5", "Recurring"), v10: buildForecastEntries("sl5", "Recurring") },
};

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "⬛", group: "Overview" },
  { key: "customers", label: "Customers", icon: "🏢", group: "Delivery" },
  { key: "contracts", label: "Contracts", icon: "📋", group: "Delivery" },
  { key: "projects", label: "Projects", icon: "📁", group: "Delivery" },
  { key: "service-lines", label: "Service Lines", icon: "⚙", group: "Delivery" },
  { key: "rate-card", label: "Rate Card", icon: "💰", group: "Finance" },
  { key: "fx-rates", label: "FX Rates", icon: "💱", group: "Finance" },
  { key: "forecast", label: "Forecast", icon: "📊", group: "Finance" },
  { key: "invoices", label: "Invoices", icon: "🧾", group: "Finance" },
  { key: "tags", label: "Tag Master", icon: "🏷", group: "Admin" },
];

// ─── RATE CARD MODULE ─────────────────────────────────────────────────────────
function RateCard() {
  const [tab, setTab] = useState("standard");
  const [rates, setRates] = useState(initRates);
  const [overrides, setOverrides] = useState(initOverrides);
  const [alerts, setAlerts] = useState(initAlerts);
  const [showAddRate, setShowAddRate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRate, setHistoryRate] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Active");
  const [form, setForm] = useState({ role: "", grade: "", location: "", currency: "USD", unit: "Hour", rate: "", effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" });

  const activeRates = rates.filter(r => filterStatus === "All" ? true : r.status === filterStatus);

  const deviationColor = (d) => {
    const abs = Math.abs(d);
    if (abs > 15) return C.danger;
    if (abs > 5) return C.warning;
    return C.textSub;
  };
  const deviationBadge = (d) => {
    const abs = Math.abs(d);
    if (abs > 15) return "red";
    if (abs > 5) return "amber";
    return "gray";
  };

  const handleAddRate = () => {
    if (!form.role || !form.grade || !form.location || !form.rate) return;
    setRates(prev => [...prev, { ...form, id: "r" + Date.now(), rate: parseFloat(form.rate) }]);
    setShowAddRate(false);
    setForm({ role: "", grade: "", location: "", currency: "USD", unit: "Hour", rate: "", effectiveFrom: "2026-01-01", effectiveTo: "", status: "Active" });
  };

  const pendingAlerts = alerts.filter(a => a.status === "Pending").length;

  return (
    <div>
      <SectionHeader
        title="Rate Card Master"
        sub="Standard rates, project overrides, and rate update alerts"
        action={<div style={{ display: "flex", gap: 8 }}><Btn variant="secondary" size="sm" onClick={() => setShowHistory(true)}>📜 Rate History</Btn><Btn size="sm" onClick={() => setShowAddRate(true)}>+ New Rate</Btn></div>}
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="Active Standard Rates" value={rates.filter(r => r.status === "Active").length} sub="Across all roles & locations" accent={C.primary} />
        <KpiCard label="Project Overrides" value={overrides.length} sub="Negotiated deviations" accent={C.warning} />
        <KpiCard label="Pending Rate Alerts" value={pendingAlerts} sub="Awaiting DO acknowledgement" accent={C.danger} badge={pendingAlerts > 0 ? <Badge color="red" dot>Action needed</Badge> : null} />
        <KpiCard label="Rate Revisions (2026)" value={4} sub="Last revision: Jan 2026" accent={C.success} />
      </div>

      <Tabs
        tabs={[
          { key: "standard", label: "Standard Rates" },
          { key: "overrides", label: "Project Overrides" },
          { key: "alerts", label: "Rate Alerts", count: pendingAlerts },
        ]}
        active={tab} onChange={setTab}
      />

      {tab === "standard" && (
        <Card>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <Select value={filterStatus} onChange={setFilterStatus} options={["Active", "Retired", "All"]} style={{ width: 140 }} />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: C.textMuted }}>{activeRates.length} rates shown</span>
          </div>
          <Table
            cols={[
              { key: "role", label: "Role" },
              { key: "grade", label: "Grade" },
              { key: "location", label: "Location" },
              { key: "currency", label: "Currency" },
              { key: "unit", label: "Unit" },
              { key: "rate", label: "Rate", right: true, render: r => <strong>{fmt(r.rate, r.currency).replace(/[A-Z]{3}\s?/, `${r.currency} `)}</strong> },
              { key: "effectiveFrom", label: "Effective From" },
              { key: "effectiveTo", label: "Effective To", render: r => r.effectiveTo || <span style={{ color: C.textMuted }}>Open</span> },
              { key: "status", label: "Status", render: r => <Badge color={r.status === "Active" ? "green" : "gray"}>{r.status}</Badge> },
              { key: "actions", label: "", render: r => (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="ghost" size="sm">Edit</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => { setHistoryRate(r); setShowHistory(true); }}>History</Btn>
                </div>
              )},
            ]}
            rows={activeRates}
          />
        </Card>
      )}

      {tab === "overrides" && (
        <Card>
          {overrides.length > 0 && <Alert type="info">Project overrides represent negotiated deviations from the standard rate card. Deviations &gt;15% are flagged for review.</Alert>}
          <Table
            cols={[
              { key: "serviceLine", label: "Service Line" },
              { key: "customer", label: "Customer" },
              { key: "role", label: "Role" },
              { key: "stdRate", label: "Std Rate", right: true, render: r => <span style={{ color: C.textMuted }}>{r.currency} {fmtN(r.stdRate)}/{r.unit}</span> },
              { key: "overrideRate", label: "Override Rate", right: true, render: r => <strong>{r.currency} {fmtN(r.overrideRate)}/{r.unit}</strong> },
              { key: "deviation", label: "Deviation", right: true, render: r => <Badge color={deviationBadge(r.deviation)}>{r.deviation > 0 ? "+" : ""}{r.deviation.toFixed(1)}%</Badge> },
              { key: "reason", label: "Reason", render: r => <span style={{ color: C.textSub, fontSize: 12 }}>{r.reason}</span> },
              { key: "effectiveFrom", label: "From" },
            ]}
            rows={overrides}
          />
        </Card>
      )}

      {tab === "alerts" && (
        <Card>
          <Alert type="warning">
            {pendingAlerts} service lines have not yet been reviewed after the January 2026 rate revision. Delivery Owners must review and apply or defer the new rate.
          </Alert>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Btn variant="secondary" size="sm">Send All Reminders</Btn>
          </div>
          <Table
            cols={[
              { key: "serviceLine", label: "Service Line" },
              { key: "deliveryOwner", label: "Delivery Owner" },
              { key: "role", label: "Role" },
              { key: "oldRate", label: "Previous Rate", right: true, render: r => <span style={{ color: C.textMuted }}>{r.currency} {fmtN(r.oldRate)}/hr</span> },
              { key: "newRate", label: "New Rate", right: true, render: r => <strong style={{ color: C.primary }}>{r.currency} {fmtN(r.newRate)}/hr</strong> },
              { key: "effectiveDate", label: "Effective" },
              { key: "status", label: "Status", render: r => <Badge color={r.status === "Acknowledged" ? "green" : "red"} dot>{r.status}</Badge> },
              { key: "actions", label: "", render: r => r.status === "Pending" ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" onClick={() => setAlerts(prev => prev.map(a => a.id === r.id ? { ...a, status: "Acknowledged" } : a))}>Apply Rate</Btn>
                  <Btn variant="ghost" size="sm">Nudge</Btn>
                </div>
              ) : <span style={{ fontSize: 12, color: C.success }}>✓ Done</span> },
            ]}
            rows={alerts}
          />
        </Card>
      )}

      {/* Add Rate Modal */}
      <Modal open={showAddRate} onClose={() => setShowAddRate(false)} title="Add Standard Rate">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Select label="Role" required value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} options={ROLES.map(r => ({ value: r, label: r }))} placeholder="Select role" />
          <Select label="Grade" required value={form.grade} onChange={v => setForm(p => ({ ...p, grade: v }))} options={GRADES.map(g => ({ value: g, label: g }))} placeholder="Select grade" />
          <Select label="Location" required value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} options={LOCATIONS.map(l => ({ value: l, label: l }))} placeholder="Select location" />
          <Select label="Currency" required value={form.currency} onChange={v => setForm(p => ({ ...p, currency: v }))} options={CURRENCIES.map(c => ({ value: c, label: c }))} />
          <Select label="Billing Unit" required value={form.unit} onChange={v => setForm(p => ({ ...p, unit: v }))} options={["Hour", "Day", "Page", "Word", "Module", "Unit"].map(u => ({ value: u, label: u }))} />
          <Input label="Rate" required type="number" value={form.rate} onChange={v => setForm(p => ({ ...p, rate: v }))} placeholder="e.g. 185"
            hint={form.rate ? `Preview: ${form.currency} ${fmtN(parseFloat(form.rate) || 0)} / ${form.unit}` : ""} />
          <Input label="Effective From" required type="date" value={form.effectiveFrom} onChange={v => setForm(p => ({ ...p, effectiveFrom: v }))} />
          <Input label="Effective To (optional)" type="date" value={form.effectiveTo} onChange={v => setForm(p => ({ ...p, effectiveTo: v }))} />
        </div>
        {form.rate && form.role && (
          <div style={{ marginTop: 16, background: C.primaryLight, borderRadius: 8, padding: 14, fontSize: 13 }}>
            <strong>Rate preview:</strong> {form.role} · {form.grade} · {form.location} → <strong>{form.currency} {fmtN(parseFloat(form.rate) || 0)} / {form.unit}</strong> from {form.effectiveFrom || "—"}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setShowAddRate(false)}>Cancel</Btn>
          <Btn onClick={handleAddRate}>Save Rate</Btn>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal open={showHistory} onClose={() => { setShowHistory(false); setHistoryRate(null); }} title={historyRate ? `Rate History — ${historyRate.role}` : "Rate Change Audit Log"} width={720}>
        <Alert type="info">Rate history is immutable. Records cannot be edited or deleted to ensure reporting integrity.</Alert>
        <Table
          cols={[
            { key: "role", label: "Role/Grade/Location", render: () => historyRate ? `${historyRate.role} · ${historyRate.grade} · ${historyRate.location}` : "Various" },
            { key: "event", label: "Event", render: (_, i) => i === 0 ? "Rate Updated" : "Rate Created" },
            { key: "old", label: "Previous", render: (r, i) => i === 0 ? `${r.currency ?? "USD"} ${fmtN(historyRate ? historyRate.rate * 0.943 : 175)}` : "—" },
            { key: "new", label: "New Rate", render: r => <strong>{r.currency ?? "USD"} {fmtN(historyRate ? historyRate.rate : 185)}</strong> },
            { key: "by", label: "Changed By", render: () => "Admin" },
            { key: "at", label: "Date", render: (_, i) => i === 0 ? "2026-01-02" : "2025-01-05" },
          ]}
          rows={historyRate ? [historyRate, historyRate] : rates.slice(0, 3)}
        />
      </Modal>
    </div>
  );
}

// ─── FX RATES MODULE ──────────────────────────────────────────────────────────
function FxRates() {
  const [tab, setTab] = useState("current");
  const [fxRates, setFxRates] = useState(initFxRates);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ pair: "GBP/USD", from: "GBP", to: "USD", month: "Apr 2026", rate: "" });

  const currentMonth = "Apr 2026";
  const activePairs = FX_PAIRS;

  const getRateForMonth = (pair, month) => fxRates.find(r => r.pair === pair && r.month === month);
  const isMissing = (pair, month) => !getRateForMonth(pair, month);
  const missingCurrent = activePairs.filter(p => isMissing(p, currentMonth));

  const handleAddRates = () => {
    if (!addForm.rate) return;
    const existing = fxRates.find(r => r.pair === addForm.pair && r.month === addForm.month);
    if (existing) {
      setFxRates(prev => prev.map(r => r.pair === addForm.pair && r.month === addForm.month ? { ...r, rate: parseFloat(addForm.rate), enteredAt: "2026-04-09" } : r));
    } else {
      setFxRates(prev => [...prev, { id: "fx" + Date.now(), ...addForm, rate: parseFloat(addForm.rate), enteredBy: "Admin", enteredAt: "2026-04-09" }]);
    }
    setShowAdd(false);
  };

  const pastMonths = MONTHS_2026.slice(0, CUR_MONTH_IDX);

  return (
    <div>
      <SectionHeader
        title="FX Rate Master"
        sub="Monthly average exchange rates for USD reporting conversion"
        action={<Btn size="sm" onClick={() => setShowAdd(true)}>+ Add Rates</Btn>}
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="Active Currency Pairs" value={activePairs.length} sub="Tracked for conversion" accent={C.primary} />
        <KpiCard label="Missing (Apr 2026)" value={missingCurrent.length} sub="Rates not yet entered" accent={missingCurrent.length > 0 ? C.danger : C.success}
          badge={missingCurrent.length > 0 ? <Badge color="red" dot>Action required</Badge> : <Badge color="green" dot>All current</Badge>} />
        <KpiCard label="Reporting Currency" value="USD" sub="All reports converted to USD" accent={C.success} />
        <KpiCard label="Last Updated" value="Apr 3" sub="Mar 2026 rates locked" accent={C.primary} />
      </div>

      {missingCurrent.length > 0 && (
        <Alert type="warning">
          <strong>Missing rates for {currentMonth}:</strong> {missingCurrent.join(", ")}. Reports for this month will use the previous month's rates until these are entered. <button style={{ background: "none", border: "none", color: C.warning, cursor: "pointer", fontWeight: 700, textDecoration: "underline" }} onClick={() => setShowAdd(true)}>Enter now →</button>
        </Alert>
      )}

      <Tabs tabs={[{ key: "current", label: `${currentMonth} Rates` }, { key: "grid", label: "Rate Grid (2026)" }, { key: "history", label: "Audit History" }]} active={tab} onChange={setTab} />

      {tab === "current" && (
        <Card>
          <Table
            cols={[
              { key: "pair", label: "Currency Pair", render: r => <strong>{r.pair}</strong> },
              { key: "from", label: "From" },
              { key: "to", label: "To" },
              { key: "rate", label: `Rate (${currentMonth})`, right: true, render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return entry ? (
                  <span>1 {r.replace("/USD", "")} = <strong>{entry.rate.toFixed(4)} USD</strong></span>
                ) : <Badge color="red" dot>Missing</Badge>;
              }},
              { key: "status", label: "Status", render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return entry ? <Badge color="green">Entered</Badge> : <Badge color="red">Missing</Badge>;
              }},
              { key: "enteredBy", label: "Entered By", render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return entry ? `${entry.enteredBy} on ${entry.enteredAt}` : "—";
              }},
              { key: "actions", label: "", render: r => {
                const entry = getRateForMonth(r, currentMonth);
                return (
                  <Btn size="sm" variant={entry ? "ghost" : "primary"} onClick={() => { setAddForm({ pair: r, from: r.replace("/USD", ""), to: "USD", month: currentMonth, rate: entry?.rate ?? "" }); setShowAdd(true); }}>
                    {entry ? "Edit" : "Enter Rate"}
                  </Btn>
                );
              }},
            ]}
            rows={activePairs}
          />
        </Card>
      )}

      {tab === "grid" && (
        <Card style={{ padding: 0 }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 14px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left", fontWeight: 700, position: "sticky", left: 0, zIndex: 1 }}>Pair</th>
                  {MONTHS_2026.map((m, i) => (
                    <th key={m} style={{ padding: "10px 10px", background: i === CUR_MONTH_IDX ? C.primaryLight : C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", fontWeight: 600, color: i === CUR_MONTH_IDX ? C.primary : C.textSub, whiteSpace: "nowrap" }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activePairs.map((pair, pi) => (
                  <tr key={pair} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "8px 14px", fontWeight: 700, background: C.white, position: "sticky", left: 0 }}>{pair}</td>
                    {MONTHS_2026.map((m, i) => {
                      const entry = getRateForMonth(pair, m);
                      const isPast = i < CUR_MONTH_IDX;
                      const isCurrent = i === CUR_MONTH_IDX;
                      const isFuture = i > CUR_MONTH_IDX;
                      return (
                        <td key={m} style={{ padding: "8px 10px", textAlign: "right", background: isCurrent ? C.primaryLight : "transparent" }}>
                          {isPast && !entry && <span style={{ color: C.danger, fontSize: 11 }}>✕ Missing</span>}
                          {entry && <span style={{ color: isPast ? C.textSub : C.text }}>{entry.rate.toFixed(4)}</span>}
                          {isFuture && !entry && (
                            <input type="number" step="0.0001" placeholder="—"
                              style={{ width: 70, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 4px", fontSize: 11, textAlign: "right" }} />
                          )}
                          {isCurrent && !entry && (
                            <button onClick={() => { setAddForm({ pair, from: pair.replace("/USD", ""), to: "USD", month: m, rate: "" }); setShowAdd(true); }}
                              style={{ background: C.primary, color: C.white, border: "none", borderRadius: 4, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>Enter</button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "history" && (
        <Card>
          <Alert type="info">FX rate history is permanently locked once the month ends. Past rates cannot be modified to ensure historical report consistency.</Alert>
          <Table
            cols={[
              { key: "pair", label: "Currency Pair", render: r => <strong>{r.pair}</strong> },
              { key: "month", label: "Month" },
              { key: "rate", label: "Rate", right: true, render: r => <strong>{r.rate.toFixed(4)}</strong> },
              { key: "formula", label: "Conversion", render: r => <span style={{ color: C.textSub }}>1 {r.from} = {r.rate.toFixed(4)} {r.to}</span> },
              { key: "enteredBy", label: "Entered By" },
              { key: "enteredAt", label: "Date" },
              { key: "locked", label: "Status", render: () => <Badge color="gray">Locked</Badge> },
            ]}
            rows={fxRates.sort((a, b) => b.enteredAt.localeCompare(a.enteredAt))}
          />
        </Card>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Enter FX Rate" width={520}>
        <Alert type="info">Monthly average rates are locked permanently once the month ends. Ensure accuracy before saving.</Alert>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Select label="Currency Pair" required value={addForm.pair} onChange={v => setAddForm(p => ({ ...p, pair: v, from: v.replace("/USD", "") }))}
            options={activePairs.map(p => ({ value: p, label: p }))} />
          <Select label="Month" required value={addForm.month} onChange={v => setAddForm(p => ({ ...p, month: v }))} options={MONTHS_2026.map(m => ({ value: m, label: m }))} />
          <div style={{ gridColumn: "1/-1" }}>
            <Input label={`Exchange Rate (1 ${addForm.from} → USD)`} required type="number" step="0.0001" value={addForm.rate} onChange={v => setAddForm(p => ({ ...p, rate: v }))} placeholder="e.g. 1.2680" />
            {addForm.rate && <div style={{ marginTop: 8, padding: "10px 12px", background: C.primaryLight, borderRadius: 6, fontSize: 13 }}>
              Preview: 1 {addForm.from} = <strong>{parseFloat(addForm.rate).toFixed(4)} USD</strong> &nbsp;|&nbsp; 100 {addForm.from} = <strong>{(parseFloat(addForm.rate) * 100).toFixed(2)} USD</strong>
            </div>}
          </div>
        </div>
        <div style={{ marginTop: 8, padding: "10px 12px", background: "#fff8e1", borderRadius: 6, fontSize: 12, color: C.warning }}>
          ⚠ Once {addForm.month} has passed, this rate will be permanently locked and cannot be changed.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
          <Btn onClick={handleAddRates}>Save Rate</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── FORECAST MODULE ──────────────────────────────────────────────────────────
function Forecast() {
  const [selectedSl, setSelectedSl] = useState(SERVICE_LINES_LIST[0]);
  const [versions, setVersions] = useState(initForecastVersions);
  const [entries, setEntries] = useState(initForecastEntries);
  const [activeVersionId, setActiveVersionId] = useState("v2");
  const [showVersionMgr, setShowVersionMgr] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showNewVersion, setShowNewVersion] = useState(false);
  const [compareVers, setCompareVers] = useState({ a: "v1", b: "v2" });
  const [showActuals, setShowActuals] = useState(true);
  const [newVerForm, setNewVerForm] = useState({ name: "", type: "Working", reason: "", copyFrom: "" });

  const slVersions = versions[selectedSl.id] || [];
  const workingVersion = slVersions.find(v => v.isWorking) || slVersions[slVersions.length - 1];
  const activeVersion = slVersions.find(v => v.id === activeVersionId) || workingVersion;
  const slEntries = entries[selectedSl.id] || {};
  const activeEntries = slEntries[activeVersionId] || {};

  const totalForecast = Object.values(activeEntries).reduce((s, e) => s + (e.amount || 0), 0);
  const totalActual = Object.values(activeEntries).reduce((s, e) => s + (e.actual || 0), 0);
  const variance = totalActual - totalForecast;
  const realization = totalForecast > 0 ? (totalActual / totalForecast) * 100 : 0;

  const isT_M = ["T&M Managed", "T&M Staffing"].includes(selectedSl.commercialType);
  const isUnit = selectedSl.commercialType === "Unit-Based";
  const isFixed = selectedSl.commercialType === "Fixed Price";
  const isRecurring = selectedSl.commercialType === "Recurring";

  const handleEntryChange = (month, field, val) => {
    setEntries(prev => {
      const slE = { ...(prev[selectedSl.id] || {}) };
      const verE = { ...(slE[activeVersionId] || {}) };
      const cell = { ...(verE[month] || {}) };
      cell[field] = parseFloat(val) || 0;
      if ((isT_M || isUnit) && field !== "amount") {
        cell.amount = Math.round((cell.qty || 0) * (cell.rate || 0));
      }
      verE[month] = cell;
      slE[activeVersionId] = verE;
      return { ...prev, [selectedSl.id]: slE };
    });
  };

  const handleCreateVersion = () => {
    if (!newVerForm.name) return;
    const newId = "v" + Date.now();
    const copyEntries = newVerForm.copyFrom ? slEntries[newVerForm.copyFrom] : {};
    setVersions(prev => ({
      ...prev,
      [selectedSl.id]: [
        ...((prev[selectedSl.id] || []).map(v => ({ ...v, isWorking: false }))),
        { id: newId, name: newVerForm.name, type: newVerForm.type, reason: newVerForm.reason, createdBy: "Jane Smith", createdAt: "2026-04-09", locked: false, isWorking: true },
      ]
    }));
    setEntries(prev => ({
      ...prev,
      [selectedSl.id]: { ...(prev[selectedSl.id] || {}), [newId]: JSON.parse(JSON.stringify(copyEntries)) }
    }));
    setActiveVersionId(newId);
    setShowNewVersion(false);
    setNewVerForm({ name: "", type: "Working", reason: "", copyFrom: "" });
  };

  const monthColColor = (i) => {
    if (i < CUR_MONTH_IDX) return "#f8fafc";
    if (i === CUR_MONTH_IDX) return "#edf4fd";
    return C.white;
  };

  const versionColor = (type) => {
    if (type === "Baseline") return C.text;
    if (type === "Working") return C.primary;
    if (type === "Locked") return C.purple;
    return C.textSub;
  };
  const versionBadge = (type) => {
    if (type === "Baseline") return "gray";
    if (type === "Working") return "blue";
    if (type === "Locked") return "purple";
    return "gray";
  };

  return (
    <div>
      <SectionHeader
        title="Forecast Entry"
        sub="Monthly revenue forecast by service line with version management"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm" onClick={() => setShowCompare(true)}>⇄ Compare Versions</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setShowVersionMgr(true)}>📋 Manage Versions</Btn>
            <Btn size="sm" onClick={() => setShowNewVersion(true)}>+ New Version</Btn>
          </div>
        }
      />

      {/* Service Line Selector */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Select label="Service Line" value={selectedSl.id} onChange={v => {
            const sl = SERVICE_LINES_LIST.find(s => s.id === v);
            setSelectedSl(sl);
            const vers = versions[sl.id] || [];
            const wv = vers.find(v2 => v2.isWorking) || vers[vers.length - 1];
            if (wv) setActiveVersionId(wv.id);
          }} options={SERVICE_LINES_LIST.map(s => ({ value: s.id, label: `${s.name} — ${s.customer}` }))} style={{ minWidth: 320 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {slVersions.map(v => (
              <button key={v.id} onClick={() => setActiveVersionId(v.id)} style={{
                padding: "6px 14px", borderRadius: 20, border: `2px solid ${activeVersionId === v.id ? versionColor(v.type) : C.border}`,
                background: activeVersionId === v.id ? versionColor(v.type) : C.white, color: activeVersionId === v.id ? C.white : C.textSub,
                fontWeight: 600, fontSize: 12, cursor: "pointer",
              }}>{v.name} {v.locked ? "🔒" : ""}</button>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.textSub, marginLeft: "auto" }}>
            <input type="checkbox" checked={showActuals} onChange={e => setShowActuals(e.target.checked)} />
            Show actuals
          </label>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: C.textSub }}>Commercial type: <Badge color="blue">{selectedSl.commercialType}</Badge></div>
          <div style={{ fontSize: 12, color: C.textSub }}>Division: <strong>{selectedSl.division}</strong></div>
          <div style={{ fontSize: 12, color: C.textSub }}>Currency: <strong>{selectedSl.currency}</strong></div>
          <div style={{ fontSize: 12, color: C.textSub }}>Customer: <strong>{selectedSl.customer}</strong></div>
          {activeVersion && <div style={{ fontSize: 12, color: C.textSub }}>Version: <Badge color={versionBadge(activeVersion.type)}>{activeVersion.name}</Badge> {activeVersion.locked && "🔒"}</div>}
        </div>
      </Card>

      {/* KPI Strip */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <KpiCard label="Total Forecast (2026)" value={fmt(totalForecast, selectedSl.currency)} sub={selectedSl.currency !== "USD" ? "Native currency" : ""} accent={C.primary} />
        <KpiCard label="Actuals YTD" value={fmt(totalActual, selectedSl.currency)} sub={`${CUR_MONTH_IDX} months billed`} accent={C.success} />
        <KpiCard label="YTD Variance" value={fmt(Math.abs(variance), selectedSl.currency)} sub={variance >= 0 ? "Ahead of forecast" : "Behind forecast"}
          accent={variance >= 0 ? C.success : C.danger} badge={<Badge color={variance >= 0 ? "green" : "red"} dot>{variance >= 0 ? "+" : "-"}{fmt(Math.abs(variance), selectedSl.currency)}</Badge>} />
        <KpiCard label="Realization" value={pct(realization)} sub="Actuals / Forecast" accent={realization >= 95 ? C.success : realization >= 80 ? C.warning : C.danger}
          badge={<Badge color={realization >= 95 ? "green" : realization >= 80 ? "amber" : "red"} dot>{realization >= 95 ? "On track" : realization >= 80 ? "Watch" : "At risk"}</Badge>} />
      </div>

      {activeVersion?.locked && <Alert type="info">This version is locked and read-only. Switch to the working version to make changes.</Alert>}

      {/* Forecast Grid */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: "14px 16px", display: "flex", gap: 10, alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Monthly Forecast Grid</span>
          <div style={{ flex: 1 }} />
          {!activeVersion?.locked && (
            <>
              <Btn variant="ghost" size="sm">Fill Down</Btn>
              <Btn variant="ghost" size="sm">Repeat Flat</Btn>
            </>
          )}
          <Btn variant="secondary" size="sm">Export CSV</Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left", fontWeight: 700, minWidth: 100, position: "sticky", left: 0 }}>Month</th>
                {isT_M && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 80 }}>Hours</th>}
                {isUnit && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 80 }}>Units</th>}
                {(isT_M || isUnit) && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 90 }}>Rate</th>}
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 110 }}>Forecast ({selectedSl.currency})</th>
                {showActuals && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 110 }}>Actual ({selectedSl.currency})</th>}
                {showActuals && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 90 }}>Variance</th>}
                {showActuals && <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right", minWidth: 70 }}>Real. %</th>}
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left", minWidth: 140 }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS_2026.map((month, i) => {
                const e = activeEntries[month] || { qty: 0, rate: 0, amount: 0, actual: null, note: "" };
                const isPast = i < CUR_MONTH_IDX;
                const isCurrent = i === CUR_MONTH_IDX;
                const locked = e.locked || activeVersion?.locked;
                const var_ = e.actual != null ? e.actual - e.amount : null;
                const real = e.amount > 0 && e.actual != null ? (e.actual / e.amount) * 100 : null;
                const realColor = real == null ? C.textMuted : real >= 95 ? C.success : real >= 80 ? C.warning : C.danger;

                return (
                  <tr key={month} style={{ borderBottom: `1px solid ${C.border}`, background: monthColColor(i) }}>
                    <td style={{ padding: "7px 12px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? C.primary : C.text, position: "sticky", left: 0, background: monthColColor(i) }}>
                      {month} {isCurrent && <span style={{ fontSize: 10, background: C.primary, color: C.white, borderRadius: 4, padding: "1px 5px", marginLeft: 4 }}>NOW</span>}
                      {isPast && <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>🔒</span>}
                    </td>
                    {isT_M && (
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {locked ? <span style={{ color: C.textSub }}>{fmtN(e.qty || 0)}</span> : (
                          <input type="number" value={e.qty || ""} onChange={ev => handleEntryChange(month, "qty", ev.target.value)}
                            style={{ width: 70, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                        )}
                      </td>
                    )}
                    {isUnit && (
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {locked ? <span style={{ color: C.textSub }}>{fmtN(e.qty || 0)}</span> : (
                          <input type="number" value={e.qty || ""} onChange={ev => handleEntryChange(month, "qty", ev.target.value)}
                            style={{ width: 70, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                        )}
                      </td>
                    )}
                    {(isT_M || isUnit) && (
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {locked ? <span style={{ color: C.textSub }}>{fmtN(e.rate || 0)}</span> : (
                          <input type="number" value={e.rate || ""} onChange={ev => handleEntryChange(month, "rate", ev.target.value)}
                            style={{ width: 76, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                        )}
                      </td>
                    )}
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>
                      {locked || (isT_M || isUnit) ? (
                        <strong style={{ color: (isT_M || isUnit) ? C.primary : C.text }}>
                          {e.amount ? fmtN(e.amount) : <span style={{ color: C.textMuted }}>—</span>}
                          {(isT_M || isUnit) && e.qty && e.rate && <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>auto</span>}
                        </strong>
                      ) : (
                        <input type="number" value={e.amount || ""} onChange={ev => handleEntryChange(month, "amount", ev.target.value)}
                          style={{ width: 100, border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", textAlign: "right", fontSize: 12 }} />
                      )}
                    </td>
                    {showActuals && (
                      <td style={{ padding: "7px 12px", textAlign: "right", color: e.actual != null ? C.text : C.textMuted }}>
                        {e.actual != null ? fmtN(Math.round(e.actual)) : "—"}
                      </td>
                    )}
                    {showActuals && (
                      <td style={{ padding: "7px 12px", textAlign: "right" }}>
                        {var_ != null ? <span style={{ color: var_ >= 0 ? C.success : C.danger, fontWeight: 600 }}>{var_ >= 0 ? "+" : ""}{fmtN(Math.round(var_))}</span> : "—"}
                      </td>
                    )}
                    {showActuals && (
                      <td style={{ padding: "7px 12px", textAlign: "right" }}>
                        {real != null ? <span style={{ color: realColor, fontWeight: 600 }}>{pct(real)}</span> : "—"}
                      </td>
                    )}
                    <td style={{ padding: "4px 6px" }}>
                      {locked ? <span style={{ color: C.textMuted, fontSize: 11 }}>{e.note || ""}</span> : (
                        <input value={e.note || ""} onChange={ev => handleEntryChange(month, "note", ev.target.value)} placeholder="Optional note"
                          style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px", fontSize: 11 }} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: C.primaryLight, fontWeight: 700 }}>
                <td style={{ padding: "9px 12px", color: C.primary, position: "sticky", left: 0, background: C.primaryLight }}>TOTAL</td>
                {isT_M && <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Object.values(activeEntries).reduce((s, e) => s + (e.qty || 0), 0))}</td>}
                {isUnit && <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Object.values(activeEntries).reduce((s, e) => s + (e.qty || 0), 0))}</td>}
                {(isT_M || isUnit) && <td />}
                <td style={{ padding: "9px 12px", textAlign: "right", color: C.primary }}>{fmtN(totalForecast)}</td>
                {showActuals && <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Math.round(totalActual))}</td>}
                {showActuals && <td style={{ padding: "9px 12px", textAlign: "right", color: variance >= 0 ? C.success : C.danger }}>{variance >= 0 ? "+" : ""}{fmtN(Math.round(variance))}</td>}
                {showActuals && <td style={{ padding: "9px 12px", textAlign: "right", color: realization >= 95 ? C.success : realization >= 80 ? C.warning : C.danger }}>{pct(realization)}</td>}
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Version Manager Modal */}
      <Modal open={showVersionMgr} onClose={() => setShowVersionMgr(false)} title={`Forecast Versions — ${selectedSl.name}`} width={760}>
        <Table
          cols={[
            { key: "name", label: "Version", render: r => <span style={{ fontWeight: 700, color: versionColor(r.type) }}>{r.name} {r.isWorking && <Badge color="blue">Working</Badge>} {r.locked && "🔒"}</span> },
            { key: "type", label: "Type", render: r => <Badge color={versionBadge(r.type)}>{r.type}</Badge> },
            { key: "createdBy", label: "Created By" },
            { key: "createdAt", label: "Created" },
            { key: "reason", label: "Reason", render: r => <span style={{ fontSize: 12, color: C.textSub }}>{r.reason}</span> },
            { key: "total", label: "Total", right: true, render: r => {
              const e = slEntries[r.id] || {};
              const t = Object.values(e).reduce((s, e2) => s + (e2.amount || 0), 0);
              return <strong>{fmtN(t)}</strong>;
            }},
            { key: "actions", label: "", render: r => (
              <div style={{ display: "flex", gap: 4 }}>
                <Btn size="sm" variant="ghost" onClick={() => { setActiveVersionId(r.id); setShowVersionMgr(false); }}>View</Btn>
                {!r.locked && !r.isWorking && <Btn size="sm" variant="warning">Lock</Btn>}
              </div>
            )},
          ]}
          rows={slVersions}
        />
      </Modal>

      {/* Compare Modal */}
      <Modal open={showCompare} onClose={() => setShowCompare(false)} title="Compare Forecast Versions" width={900}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-end" }}>
          <Select label="Version A" value={compareVers.a} onChange={v => setCompareVers(p => ({ ...p, a: v }))} options={slVersions.map(v => ({ value: v.id, label: v.name }))} style={{ width: 200 }} />
          <Select label="Version B" value={compareVers.b} onChange={v => setCompareVers(p => ({ ...p, b: v }))} options={slVersions.map(v => ({ value: v.id, label: v.name }))} style={{ width: 200 }} />
          <div style={{ flex: 1 }} />
          <Badge color="blue">{slVersions.find(v => v.id === compareVers.a)?.name}</Badge>
          <span style={{ color: C.textMuted }}>vs</span>
          <Badge color="purple">{slVersions.find(v => v.id === compareVers.b)?.name}</Badge>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "left" }}>Month</th>
                <th style={{ padding: "8px 12px", background: "#e8f0fa", borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>{slVersions.find(v => v.id === compareVers.a)?.name}</th>
                <th style={{ padding: "8px 12px", background: "#ede9fe", borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>{slVersions.find(v => v.id === compareVers.b)?.name}</th>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>Actuals</th>
                <th style={{ padding: "8px 12px", background: C.bg, borderBottom: `1.5px solid ${C.border}`, textAlign: "right" }}>A vs B Δ</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS_2026.map((m, i) => {
                const eA = (slEntries[compareVers.a] || {})[m] || {};
                const eB = (slEntries[compareVers.b] || {})[m] || {};
                const diff = (eB.amount || 0) - (eA.amount || 0);
                return (
                  <tr key={m} style={{ borderBottom: `1px solid ${C.border}`, background: i === CUR_MONTH_IDX ? C.primaryLight : "transparent" }}>
                    <td style={{ padding: "7px 12px", fontWeight: i === CUR_MONTH_IDX ? 700 : 400 }}>{m}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", background: "#f0f4fc" }}>{fmtN(eA.amount || 0)}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", background: "#f5f3ff" }}>{fmtN(eB.amount || 0)}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", color: C.textSub }}>{eA.actual != null ? fmtN(Math.round(eA.actual)) : "—"}</td>
                    <td style={{ padding: "7px 12px", textAlign: "right", color: diff > 0 ? C.success : diff < 0 ? C.danger : C.textMuted, fontWeight: 600 }}>
                      {diff !== 0 ? `${diff > 0 ? "+" : ""}${fmtN(diff)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: C.primaryLight, fontWeight: 700 }}>
                <td style={{ padding: "9px 12px" }}>TOTAL</td>
                <td style={{ padding: "9px 12px", textAlign: "right", background: "#e8f0fa" }}>{fmtN(Object.values(slEntries[compareVers.a] || {}).reduce((s, e) => s + (e.amount || 0), 0))}</td>
                <td style={{ padding: "9px 12px", textAlign: "right", background: "#ede9fe" }}>{fmtN(Object.values(slEntries[compareVers.b] || {}).reduce((s, e) => s + (e.amount || 0), 0))}</td>
                <td style={{ padding: "9px 12px", textAlign: "right" }}>{fmtN(Math.round(Object.values(slEntries[compareVers.a] || {}).reduce((s, e) => s + (e.actual || 0), 0)))}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal>

      {/* New Version Modal */}
      <Modal open={showNewVersion} onClose={() => setShowNewVersion(false)} title="Create New Forecast Version" width={520}>
        <Alert type="info">New versions copy entries from an existing version as a starting point. The baseline version is always immutable.</Alert>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Version Name" required value={newVerForm.name} onChange={v => setNewVerForm(p => ({ ...p, name: v }))} placeholder="e.g. Q3 Revision, Post scope change" />
          <Select label="Version Type" required value={newVerForm.type} onChange={v => setNewVerForm(p => ({ ...p, type: v }))} options={["Working", "Locked"].map(t => ({ value: t, label: t }))} />
          <Input label="Reason for revision" value={newVerForm.reason} onChange={v => setNewVerForm(p => ({ ...p, reason: v }))} placeholder="Briefly describe why this version is being created" />
          <Select label="Copy entries from" value={newVerForm.copyFrom} onChange={v => setNewVerForm(p => ({ ...p, copyFrom: v }))} placeholder="Start blank" options={slVersions.map(v => ({ value: v.id, label: v.name }))} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setShowNewVersion(false)}>Cancel</Btn>
          <Btn onClick={handleCreateVersion} disabled={!newVerForm.name}>Create Version</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── PLACEHOLDER for existing modules ────────────────────────────────────────
const Placeholder = ({ name }) => (
  <div>
    <SectionHeader title={name} sub={`${name} module — carried over from Round 1`} />
    <Card>
      <div style={{ padding: 40, textAlign: "center", color: C.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔧</div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{name} module</div>
        <div style={{ fontSize: 13 }}>This module was built in Round 1 and is active in your deployed app. Switch to your Vercel deployment to access the full module.</div>
      </div>
    </Card>
  </div>
);

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("rate-card");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const groups = [...new Set(NAV.map(n => n.group))];

  const renderPage = () => {
    if (page === "rate-card") return <RateCard />;
    if (page === "fx-rates") return <FxRates />;
    if (page === "forecast") return <Forecast />;
    return <Placeholder name={NAV.find(n => n.key === page)?.label || page} />;
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, color: C.text }}>
      {/* Sidebar */}
      <div style={{ width: sidebarCollapsed ? 56 : 220, background: C.sidebar, display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, overflowX: "hidden" }}>
        <div style={{ padding: sidebarCollapsed ? "18px 12px" : "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setSidebarCollapsed(c => !c)}>
          <div style={{ width: 28, height: 28, background: C.primary, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: C.white, fontWeight: 900, fontSize: 13 }}>FP</span>
          </div>
          {!sidebarCollapsed && <span style={{ color: C.white, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>Freyr Pulse</span>}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
          {groups.map(group => (
            <div key={group}>
              {!sidebarCollapsed && <div style={{ padding: "10px 20px 4px", fontSize: 10, fontWeight: 700, color: "rgba(168,189,214,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>{group}</div>}
              {NAV.filter(n => n.group === group).map(n => (
                <div key={n.key} onClick={() => setPage(n.key)} title={sidebarCollapsed ? n.label : ""}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: sidebarCollapsed ? "9px 14px" : "9px 20px", cursor: "pointer", borderLeft: page === n.key ? `3px solid ${C.primary}` : "3px solid transparent", background: page === n.key ? "rgba(33,118,199,0.15)" : "transparent", transition: "all 0.1s" }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
                  {!sidebarCollapsed && <span style={{ color: page === n.key ? C.white : C.sidebarText, fontWeight: page === n.key ? 600 : 400, fontSize: 13, whiteSpace: "nowrap" }}>{n.label}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: sidebarCollapsed ? "14px 12px" : "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: C.primary, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: C.white, fontWeight: 700, fontSize: 12 }}>JS</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>Jane Smith</div>
              <div style={{ color: C.sidebarText, fontSize: 11 }}>Delivery Owner</div>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ height: 54, background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", gap: 6, fontSize: 13, color: C.textMuted }}>
            <span>Freyr Pulse</span><span>/</span><span style={{ color: C.text, fontWeight: 600 }}>{NAV.find(n => n.key === page)?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge color="blue">April 2026</Badge>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{ position: "absolute", top: -4, right: -4, background: C.danger, color: C.white, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>4</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
