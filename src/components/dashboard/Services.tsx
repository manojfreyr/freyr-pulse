import type { Company } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { SERVICE_BY_ID } from "@/lib/mock/services";
import { PERSONA_BY_ID } from "@/lib/mock/personas";

export function ServicesGrid({ company }: { company: Company }) {
  const recs = [...company.serviceRecommendations].sort((a, b) => b.relevanceScore - a.relevanceScore);
  return (
    <Section eyebrow="Where Freyr fits" title="Recommended Freyr services" sub="Services mapped to this account, ranked by relevance, each with a way in.">
      <div className="grid grid-2">
        {recs.map((r) => {
          const svc = SERVICE_BY_ID[r.serviceId];
          const buyer = PERSONA_BY_ID[r.likelyBuyer];
          if (!svc) return null;
          return (
            <div key={r.serviceId} className="card" style={{ boxShadow: "none" }}>
              <div className="spread" style={{ alignItems: "flex-start" }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 4 }}>{svc.category}</div>
                  <div className="strong" style={{ fontSize: 15 }}>{svc.name}</div>
                </div>
                <span className="chip chip-accent mono">{r.relevanceScore}</span>
              </div>
              <p className="small soft" style={{ margin: "10px 0" }}>{r.whyRelevant}</p>
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
    </Section>
  );
}

export function PainPoints({ company }: { company: Company }) {
  return (
    <Section eyebrow="Hypotheses" title="Pain point intelligence" sub="Likely challenges and how to open the conversation. These are hypotheses to validate, not confirmed facts.">
      <div className="stack">
        {company.painPoints.map((p) => {
          const svc = SERVICE_BY_ID[p.relevantServiceId];
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
                {svc && <span className="chip chip-accent">Freyr fit: {svc.name}</span>}
                <span className="small muted">Angle: {p.conversationAngle}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
