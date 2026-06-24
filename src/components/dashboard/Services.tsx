import type { Company, FreyrService } from "@/lib/types";
import type { MatchedService } from "@/lib/generators/serviceMatch";
import { Section } from "@/components/ui/Section";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { EvidenceStrengthChip, WhyThisService } from "@/components/dashboard/EvidencePanel";
import { PERSONA_BY_ID } from "@/lib/mock/personas";

/**
 * Recommendations are computed live from the Service Catalog (see
 * matchServices). Nothing here is hardcoded per-company text — each card is a
 * catalog service scored against the company's signals.
 */
export function ServicesGrid({ recommendations }: { recommendations: MatchedService[] }) {
  return (
    <Section
      eyebrow="Where Freyr fits"
      title="Recommended Freyr services"
      sub="Pulled from the Service Catalog and ranked by fit against this company's signals — each with a likely buyer and a way in."
    >
      {recommendations.length === 0 ? (
        <div className="card" style={{ boxShadow: "none", textAlign: "center", padding: "32px 24px" }}>
          <p className="soft" style={{ margin: 0 }}>
            No catalog matches yet. This is a partial profile — enrich it with live sources (Phase 2) to generate
            service recommendations, or add company signals to the catalog matcher.
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {recommendations.map((r) => {
            const svc = r.service;
            const buyer = PERSONA_BY_ID[r.likelyBuyer];
            return (
              <div key={svc.id} className="card" style={{ boxShadow: "none", borderLeft: "3px solid var(--accent)" }}>
                <div className="spread" style={{ alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="eyebrow" style={{ marginBottom: 4 }}>{svc.serviceLine} · {svc.serviceCategory}</div>
                    <div className="strong" style={{ fontSize: 15.5 }}>{svc.serviceName}</div>
                  </div>
                  <EvidenceStrengthChip strength={r.evidenceStrength} />
                </div>
                <p className="small soft" style={{ margin: "10px 0" }}>{r.whyRelevant}</p>
                {r.matchedSignals.length > 0 && (
                  <div className="row-wrap" style={{ gap: 6, marginBottom: 4 }}>
                    {r.matchedSignals.map((s, i) => (
                      <span key={i} className="chip chip-mono">{s}</span>
                    ))}
                  </div>
                )}
                <WhyThisService r={r} />
                <hr className="hr-dotted" />
                <div className="small">
                  <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                    <span className="muted">Likely buyer:</span> <span className="strong">{buyer?.title ?? r.likelyBuyer}</span>
                  </div>
                  <div className="muted" style={{ marginBottom: 8 }}>Hook: {r.triggerOrPainPoint}</div>
                  <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-md)", padding: "10px 12px" }}>
                    <span className="eyebrow">Suggested opener</span>
                    <p className="small soft" style={{ margin: "6px 0 0" }}>&ldquo;{r.suggestedOpeningMessage}&rdquo;</p>
                  </div>
                  <div className="row" style={{ marginTop: 10 }}>
                    <ConfidenceBadge confidence={r.confidence} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

export function PainPoints({
  company,
  serviceById,
}: {
  company: Company;
  serviceById: Record<string, FreyrService>;
}) {
  if (company.painPoints.length === 0) {
    return (
      <Section eyebrow="Hypotheses" title="Pain point intelligence" sub="Likely challenges and how to open the conversation.">
        <div className="card" style={{ boxShadow: "none", textAlign: "center", padding: "32px 24px" }}>
          <p className="soft" style={{ margin: 0 }}>No pain-point hypotheses yet — available after enrichment (Phase 2).</p>
        </div>
      </Section>
    );
  }
  return (
    <Section eyebrow="Hypotheses" title="Pain point intelligence" sub="Likely challenges and how to open the conversation. These are hypotheses to validate, not confirmed facts.">
      <div className="stack">
        {company.painPoints.map((p) => {
          const svc = p.relevantServiceId ? serviceById[p.relevantServiceId] : undefined;
          return (
            <div key={p.id} className="card" style={{ boxShadow: "none" }}>
              <div className="spread" style={{ flexWrap: "wrap", gap: 8 }}>
                <span className="strong" style={{ fontSize: 15 }}>{p.title}</span>
                <ConfidenceBadge confidence={p.confidence} />
              </div>
              <div className="grid grid-2" style={{ marginTop: 12, gap: 16 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 4 }}>Why it may exist</div>
                  <p className="small soft" style={{ margin: 0 }}>{p.whyItMayExist}</p>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 4 }}>Business impact</div>
                  <p className="small soft" style={{ margin: 0 }}>{p.businessImpact}</p>
                </div>
              </div>
              <hr className="hr-dotted" />
              <div className="row-wrap" style={{ gap: 10 }}>
                {svc && <span className="chip chip-accent">Freyr fit: {svc.serviceName}</span>}
                <span className="small muted">Angle: {p.conversationAngle}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
