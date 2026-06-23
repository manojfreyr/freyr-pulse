import type { SourceCitation } from "@/lib/types";

/** Consistent dashboard section wrapper: a numbered, eyebrowed card. */
export function Section({
  index,
  eyebrow,
  title,
  sub,
  right,
  children,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="card card-pad-lg">
      <div className="card-head" style={{ marginBottom: 14 }}>
        <div>
          {(index || eyebrow) && (
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              {index && <span className="section-num">{index}</span>}
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            </div>
          )}
          <h2 className="card-title" style={{ fontSize: 19 }}>{title}</h2>
          {sub && <p className="card-sub" style={{ marginTop: 4 }}>{sub}</p>}
        </div>
        {right && <div style={{ flex: "0 0 auto" }}>{right}</div>}
      </div>
      {children}
    </section>
  );
}

export function SourceList({ sources }: { sources: SourceCitation[] }) {
  if (!sources.length) return null;
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {sources.map((s, i) => (
        <li key={i} className="row" style={{ gap: 10, padding: "8px 0", borderBottom: i < sources.length - 1 ? "1px dashed var(--line)" : "none" }}>
          <span className="chip chip-mono">{s.type}</span>
          <span className="small soft">{s.label}</span>
          <span className="tiny muted" style={{ marginLeft: "auto" }}>{s.dateRetrieved}</span>
        </li>
      ))}
    </ul>
  );
}
