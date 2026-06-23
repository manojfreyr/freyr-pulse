import type { Company, PersonaId, TalkingPoint } from "@/lib/types";
import type { MatchedService } from "@/lib/generators/serviceMatch";
import { PERSONA_BY_ID } from "@/lib/mock/personas";

/**
 * Produces company-aware TalkingPoints for a persona. The service angle is now
 * fully catalog-driven: it reads the persona-owned services from the ranked
 * `matched` output (which the caller computes via matchServices against the
 * ACTIVE catalog), then blends the catalog's `painPointsSolved` and any linked
 * company pain points with the persona's generic pains. There is no dependency
 * on a stored per-company recommendation list.
 *
 * Inputs that shape the output: active service catalog (via `matched`), each
 * service's targetPersonas / painPointsSolved / keywords / relevantCompanySignals
 * / buyingTriggers (already folded into the match), plus the company's own pain
 * points and triggers. Works fine when nothing matches (falls back to the
 * persona's generic guidance) and when pain points have no relevantServiceId.
 *
 * The function signature is the seam where a real LLM call slots in later.
 */
export function generateTalkingPoints(
  company: Company,
  personaId: PersonaId,
  matched: MatchedService[],
): TalkingPoint {
  const persona = PERSONA_BY_ID[personaId];
  const topTrigger = company.triggers[0];
  const triggerPhrase = topTrigger ? topTrigger.headline.toLowerCase() : "recent developments";

  const openingLine = fill(persona.openingLineTemplate, {
    company: company.name,
    trigger: triggerPhrase,
  });

  // Services THIS persona owns (per the catalog), surfaced for THIS company by
  // the matcher.
  const personaServiceIds = new Set(
    matched.filter((m) => m.service.targetPersonas.includes(personaId)).map((m) => m.service.id),
  );

  // Optional company pain points linked to those services (relevantServiceId is
  // a signal, not required).
  const linkedCompanyPains = company.painPoints
    .filter((pp) => pp.relevantServiceId && personaServiceIds.has(pp.relevantServiceId))
    .map((pp) => pp.title);

  // Pain points the catalog says those services solve.
  const catalogPains = matched
    .filter((m) => personaServiceIds.has(m.service.id))
    .flatMap((m) => m.service.painPointsSolved);

  const painPoints = dedupe([...linkedCompanyPains, ...catalogPains, ...persona.painPoints]).slice(0, 5);

  return {
    personaId,
    companyId: company.id,
    caresAbout: persona.caresAbout,
    kpis: persona.kpis,
    painPoints,
    freyrPositioning: persona.freyrPositioning,
    discoveryQuestions: persona.discoveryQuestions,
    openingLine,
    objections: persona.objections,
    recommendedNextStep: persona.recommendedNextStep,
  };
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}
