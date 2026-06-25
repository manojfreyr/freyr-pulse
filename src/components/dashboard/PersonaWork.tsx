"use client";

import type { Company, PersonaId } from "@/lib/types";
import type { MatchedService } from "@/lib/generators/serviceMatch";
import { PERSONAS, PERSONA_BY_ID } from "@/lib/mock/personas";
import { generateTalkingPoints } from "@/lib/generators/talkingPoints";
import { generateOutreach } from "@/lib/generators/outreach";
import { Section } from "@/components/ui/Section";
import { CopyButton } from "@/components/ui/CopyButton";

export function PersonaSelector({
  value,
  onChange,
}: {
  value: PersonaId;
  onChange: (id: PersonaId) => void;
}) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Who are you speaking with?</div>
      <div className="row-wrap" style={{ gap: 8 }}>
        {PERSONAS.map((p) => {
          const active = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              className={active ? "btn btn-primary btn-sm" : "btn btn-sm"}
              onClick={() => onChange(p.id)}
              aria-pressed={active}
            >
              {p.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PersonasPanel({
  company,
  personaId,
  onPersonaChange,
  matched,
}: {
  company: Company;
  personaId: PersonaId;
  onPersonaChange: (id: PersonaId) => void;
  matched: MatchedService[];
}) {
  const persona = PERSONA_BY_ID[personaId];
  const tp = generateTalkingPoints(company, personaId, matched);

  return (
    <Section
     
      eyebrow="Persona"
      title="Personas & talking points"
      sub="Select a persona to tailor the angle, talking points, and objections for this account."
      right={undefined}
    >
      <PersonaSelector value={personaId} onChange={onPersonaChange} />
      <hr className="hr" />

      <div className="card" style={{ boxShadow: "none", background: "var(--accent-soft)", borderColor: "var(--accent-line)" }}>
        <span className="eyebrow" style={{ color: "var(--accent-ink)" }}>Suggested opening line · {persona.title}</span>
        <p style={{ margin: "8px 0 0", color: "var(--accent-ink)", fontSize: 15 }}>&ldquo;{tp.openingLine}&rdquo;</p>
      </div>

      <div className="grid grid-2" style={{ marginTop: 18, gap: 20 }}>
        <Block title="What they likely care about" items={tp.caresAbout} />
        <Block title="Likely KPIs" items={tp.kpis} />
        <Block title="Likely pain points" items={tp.painPoints} />
        <Block title="Discovery questions" items={tp.discoveryQuestions} variant="check" />
      </div>

      <hr className="hr" />
      <div className="eyebrow" style={{ marginBottom: 6 }}>Best Freyr positioning</div>
      <p className="soft" style={{ marginTop: 0 }}>{persona.freyrPositioning}</p>

      <div className="eyebrow" style={{ margin: "18px 0 10px" }}>Objections &amp; responses</div>
      <div className="stack">
        {persona.objections.map((o, i) => (
          <div key={i} className="card" style={{ boxShadow: "none", padding: 16 }}>
            <p className="strong" style={{ margin: "0 0 6px" }}>&ldquo;{o.objection}&rdquo;</p>
            <p className="small soft" style={{ margin: 0 }}><span className="mono" style={{ color: "var(--accent-ink)" }}>→ </span>{o.response}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ boxShadow: "none", marginTop: 16, padding: 16 }}>
        <span className="eyebrow">Recommended next step</span>
        <p className="soft" style={{ margin: "6px 0 0" }}>{persona.recommendedNextStep}</p>
      </div>
    </Section>
  );
}

export function OutreachPanel({
  company,
  personaId,
  onPersonaChange,
  matched,
}: {
  company: Company;
  personaId: PersonaId;
  onPersonaChange: (id: PersonaId) => void;
  matched: MatchedService[];
}) {
  const persona = PERSONA_BY_ID[personaId];
  const messages = generateOutreach(company, personaId, matched);

  return (
    <Section
     
      eyebrow="Generate"
      title="Outreach generator"
      sub="Ready-to-use drafts tailored to the selected persona. Phase 1 uses templated generation; later phases swap in live AI."
    >
      <PersonaSelector value={personaId} onChange={onPersonaChange} />
      <p className="small muted" style={{ marginTop: 10 }}>Drafts for <span className="strong">{persona.title}</span> at {company.name}. Review and personalise the bracketed fields before sending.</p>
      <hr className="hr" />

      <div className="stack">
        {messages.map((m) => (
          <div key={m.kind} className="card" style={{ boxShadow: "none", padding: 0, overflow: "hidden" }}>
            <div className="spread" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", background: "var(--surface-2)", gap: 12 }}>
              <div className="row" style={{ gap: 10, minWidth: 0, flex: 1 }}>
                <span className="eyebrow nowrap">{m.label}</span>
                {m.subject && <span className="small soft nowrap" style={{ overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>Subject: {m.subject}</span>}
              </div>
              <CopyButton text={m.subject ? `Subject: ${m.subject}\n\n${m.body}` : m.body} />
            </div>
            <pre
              style={{
                margin: 0,
                padding: "16px",
                whiteSpace: "pre-wrap",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-soft)",
                lineHeight: 1.55,
              }}
            >
              {m.body}
            </pre>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Block({ title, items, variant }: { title: string; items: string[]; variant?: "check" }) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{title}</div>
      <ul className={variant === "check" ? "list-check small" : "list-reasons small"}>
        {items.map((it, i) => <li key={i} className="soft">{it}</li>)}
      </ul>
    </div>
  );
}
