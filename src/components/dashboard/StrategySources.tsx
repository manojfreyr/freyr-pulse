import type { Company } from "@/lib/types";
import { Section, SourceList } from "@/components/ui/Section";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { CONNECTORS } from "@/lib/sources/connectors";
import { deriveSignals, groupSignalsByCategory, type SignalCategory, type CompanySignal } from "@/lib/signals/companySignals";
import { formatDate } from "@/lib/utils/format";

const CONNECTOR_CATEGORIES = ["Public/Regulatory", "News & Web", "Commercial Intelligence", "Internal Freyr"] as const;

/** Display names + order for the signal categories. */
const SIGNAL_CATEGORY_META: { key: SignalCategory; label: string }[] = [
  { key: "therapeutic-area", label: "Therapeutic areas" },
  { key: "segment", label: "Industry segment" },
  { key: "size", label: "Size & scale" },
  { key: "footprint", label: "Global footprint" },
  { key: "product", label: "Products" },
  { key: "market", label: "Markets" },
  { key: "pipeline", label: "Clinical pipeline" },
  { key: "regulatory", label: "Regulatory activity" },
  { key: "trigger", label: "Business triggers" },
  { key: "pain-point", label: "Pain points" },
  { key: "derived", label: "Derived signals" },
];

export function AccountStrategyView({ company }: { company: Company }) {
  const s = company.strategy;
  return (
    <Section eyebrow="Plan" title="Account strategy" sub="How to enter, land, and expand this account.">
      <div className="grid grid-2" style={{ gap: 20 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Best entry point</div>
          <p className="strong" style={{ margin: "0 0 4px" }}>{s.bestEntryPoint}</p>
          <p className="small muted" style={{ margin: 0 }}>{s.entryRationale}</p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>First conversation</div>
          <p className="small soft" style={{ margin: 0 }}>{s.firstConversationStrategy}</p>
        </div>
      </div>

      <hr className="hr" />

      <div className="grid grid-2" style={{ gap: 20 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Land &amp; expand</div>
          <p className="small soft" style={{ margin: "0 0 14px" }}>{s.landAndExpand}</p>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Cross-sell paths</div>
          <ul className="list-check small">{s.crossSell.map((c, i) => <li key={i} className="soft">{c}</li>)}</ul>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Differentiation</div>
          <p className="small soft" style={{ margin: "0 0 14px" }}>{s.differentiation}</p>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Likely objections</div>
          <ul className="list-reasons small">{s.objections.map((o, i) => <li key={i} className="soft">{o}</li>)}</ul>
        </div>
      </div>

      <hr className="hr" />

      <div className="eyebrow" style={{ marginBottom: 12 }}>30 / 60 / 90-day plan</div>
      <div className="grid grid-3">
        {s.actionPlan.map((a, i) => (
          <div key={i} className="card" style={{ boxShadow: "none", padding: 16 }}>
            <span className="chip chip-accent mono">{a.horizon}</span>
            <p className="small soft" style={{ margin: "10px 0 0" }}>{a.action}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const PLACEHOLDER_URL = "https://example.com/placeholder";

/** A usable external link only — placeholder/relative URLs return null. */
function realUrl(url?: string): string | null {
  if (!url || url === PLACEHOLDER_URL) return null;
  return /^https?:\/\//i.test(url) ? url : null;
}

/** Renders a signal's provenance: clickable citations when live links exist,
 *  with an "as of" retrieval date; otherwise the plain source string (seed). */
function SignalSource({ sig }: { sig: CompanySignal }) {
  const linked = (sig.citations ?? []).filter((c) => realUrl(c.url));
  const retrievedAt = sig.citations?.find((c) => c.retrievedAt)?.retrievedAt;

  if (linked.length === 0) {
    return <div className="tiny muted">Source: {sig.source}</div>;
  }
  return (
    <div className="tiny muted">
      Source:{" "}
      {linked.map((c, i) => (
        <span key={`${c.url}-${i}`}>
          {i > 0 && ", "}
          <a href={realUrl(c.url)!} target="_blank" rel="noopener noreferrer">{c.publisher || c.label}</a>
        </span>
      ))}
      {retrievedAt && <span> · as of {formatDate(retrievedAt)}</span>}
    </div>
  );
}

export function CompanySignalsPanel({ company }: { company: Company }) {
  // Uses the Company Signal layer directly — no duplicate extraction logic.
  const signals = deriveSignals(company);
  const grouped = groupSignalsByCategory(signals);
  const sections = SIGNAL_CATEGORY_META.map((m) => ({ ...m, items: grouped[m.key] ?? [] })).filter(
    (s) => s.items.length > 0,
  );

  return (
    <Section
      eyebrow="Evidence"
      title="Company signals"
      sub="These signals are used to match the company against the Freyr Service Catalog and generate recommendations."
    >
      {signals.length === 0 ? (
        <div className="card" style={{ boxShadow: "none", textAlign: "center", padding: "28px 24px" }}>
          <p className="soft" style={{ margin: 0 }}>
            No signals yet — this is a partial profile. Live connectors will populate signals in Phase 2.
          </p>
        </div>
      ) : (
        <>
          <div className="row-wrap" style={{ gap: 8, marginBottom: 16 }}>
            <span className="chip chip-accent">{signals.length} signals</span>
            <span className="chip">{sections.length} categories</span>
          </div>
          <div className="grid grid-2" style={{ gap: 16 }}>
            {sections.map((sec) => (
              <div key={sec.key} className="card" style={{ boxShadow: "none", padding: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{sec.label} · {sec.items.length}</div>
                <div className="stack" style={{ gap: 10 }}>
                  {sec.items.map((sig) => (
                    <div key={sig.key} className="spread" style={{ gap: 10, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 0 }}>
                        <div className="strong small" style={{ textTransform: "capitalize" }}>{sig.label}</div>
                        <SignalSource sig={sig} />
                      </div>
                      <ConfidenceBadge confidence={sig.confidence} style={{ flex: "0 0 auto" }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

export function SourcesCenter({ company }: { company: Company }) {
  const grouped = CONNECTOR_CATEGORIES.map((cat) => ({
    cat,
    items: CONNECTORS.filter((c) => c.category === cat),
  }));
  return (
    <Section
      eyebrow="Trust"
      title="Source & confidence center"
      sub="Every claim in this profile carries a confidence rating. In Phase 1 sources are placeholders; live citations arrive in a later phase."
    >
      <div style={{ marginBottom: 18 }}>
        <DemoDataNotice />
      </div>
      <div className="grid grid-4" style={{ marginBottom: 18 }}>
        {([
          ["Verified", "Confirmed against a primary source.", "conf-verified"],
          ["Likely", "Strongly supported, not confirmed.", "conf-likely"],
          ["Inferred", "Reasoned from signals — a hypothesis.", "conf-inferred"],
          ["Unknown", "Insufficient evidence — validate first.", "conf-unknown"],
        ] as const).map(([label, blurb, cls]) => (
          <div key={label} className="card" style={{ boxShadow: "none", padding: 14 }}>
            <span className={`conf ${cls}`}>{label}</span>
            <p className="tiny muted" style={{ margin: "8px 0 0" }}>{blurb}</p>
          </div>
        ))}
      </div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Sources referenced</div>
      <SourceList sources={company.sources} />

      <hr className="hr" />

      <div className="eyebrow" style={{ marginBottom: 6 }}>Live data sources · planned for Phase 2</div>
      <p className="small muted" style={{ margin: "0 0 14px" }}>
        These connectors are defined now (clean interfaces, no live calls yet) so Phase 2 can plug in real sources
        and enrich any company profile automatically.
      </p>
      <div className="grid grid-2" style={{ gap: 16 }}>
        {grouped.map(({ cat, items }) => (
          <div key={cat} className="card" style={{ boxShadow: "none", padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>{cat}</div>
            <div className="stack" style={{ gap: 10 }}>
              {items.map((c) => (
                <div key={c.id} className="spread" style={{ gap: 10, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="strong small">{c.label}</div>
                    <div className="tiny muted">{c.description}</div>
                  </div>
                  <span className="conf conf-unknown" style={{ flex: "0 0 auto" }}>Planned</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
