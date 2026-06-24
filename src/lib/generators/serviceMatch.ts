import type { Company, ConfidenceRating, FreyrService, PersonaId } from "@/lib/types";
import { deriveSignals, signalKeys, signalMatches } from "@/lib/signals/companySignals";

/**
 * ──────────────────────────────────────────────────────────────────────────
 * THE single source of truth for service recommendations.
 *
 *   Company signals + pain points + triggers
 *     → matchServices(company, activeCatalog)
 *       → Ranked MatchedService[]
 *         → Recommended services grid  (Services.tsx)
 *         → Hero "Top services to lead with"  (WhyCareCard.tsx)
 *         → Persona talking points  (talkingPoints.ts)
 *         → Outreach content  (outreach.ts)
 *         → Account strategy
 *
 * No recommendations are stored on the company. Edit/deactivate a service or
 * change its keywords/signals in the Service Catalog and every surface above
 * updates, because they all consume this one function's output.
 * ──────────────────────────────────────────────────────────────────────────
 */
export interface MatchedService {
  service: FreyrService;
  relevanceScore: number; // 0–100
  matchedSignals: string[];
  whyRelevant: string;
  likelyBuyer: PersonaId;
  triggerOrPainPoint: string;
  suggestedOpeningMessage: string;
  confidence: ConfidenceRating;
}

/**
 * Scores each active service against the company and returns ranked matches.
 * Company signals come from the Company Signal layer (deriveSignals), so the
 * matcher no longer owns signal extraction — it just consumes normalized keys.
 * @param limit max number of recommendations to return.
 */
export function matchServices(company: Company, services: FreyrService[], limit = 8): MatchedService[] {
  const keys = signalKeys(deriveSignals(company));
  // relevantServiceId is OPTIONAL — only an extra signal. Undefined values are
  // filtered out, so matching works fine for companies without these links.
  const directPainServiceIds = new Set(
    company.painPoints.map((p) => p.relevantServiceId).filter((id): id is string => Boolean(id)),
  );
  const companyTriggerTypes = new Set(company.triggers.map((t) => t.type));

  const matched: MatchedService[] = [];

  for (const service of services) {
    if (!service.activeStatus) continue;

    let score = 0;
    const reasons: string[] = [];

    for (const sig of service.relevantCompanySignals) {
      if (signalMatches(keys, sig)) { score += 12; reasons.push(sig); }
    }
    for (const kw of service.keywords) {
      if (signalMatches(keys, kw)) { score += 5; reasons.push(kw); }
    }
    const matchedTriggers: string[] = [];
    for (const trg of service.buyingTriggers) {
      if (companyTriggerTypes.has(trg)) { score += 10; matchedTriggers.push(trg); }
    }

    // Optional company→service pain-point link is a bonus signal, not a driver.
    let directPain: string | undefined;
    if (directPainServiceIds.has(service.id)) {
      score += 30;
      directPain = company.painPoints.find((p) => p.relevantServiceId === service.id)?.title;
    }

    if (score <= 0) continue;
    score = Math.min(100, score);

    const uniqueReasons = Array.from(new Set(reasons));
    const triggerOrPainPoint =
      directPain ??
      (matchedTriggers[0] ? `Trigger: ${matchedTriggers[0]}` : undefined) ??
      (uniqueReasons[0] ? `Signal: ${uniqueReasons[0]}` : "Portfolio fit");

    const why = buildWhy(service, uniqueReasons, matchedTriggers, directPain);
    const signalStrength = uniqueReasons.length + matchedTriggers.length;
    const confidence: ConfidenceRating =
      directPain || signalStrength >= 3 ? "Likely" : "Inferred";

    matched.push({
      service,
      relevanceScore: score,
      matchedSignals: uniqueReasons.slice(0, 5),
      whyRelevant: why,
      likelyBuyer: service.targetPersonas[0] ?? "vp-regulatory-affairs",
      triggerOrPainPoint,
      suggestedOpeningMessage: service.exampleOpeningMessage,
      confidence,
    });
  }

  return matched.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit);
}

function buildWhy(service: FreyrService, signals: string[], triggers: string[], directPain?: string): string {
  const bits: string[] = [];
  if (directPain) bits.push(`addresses the noted challenge "${directPain}"`);
  if (triggers.length) bits.push(`fits recent ${triggers.slice(0, 2).join(" / ")} activity`);
  if (signals.length) bits.push(`matches signals: ${signals.slice(0, 3).join(", ")}`);
  const tail = bits.length ? ` — ${bits.join("; ")}.` : ".";
  return `${service.description}${tail}`;
}
