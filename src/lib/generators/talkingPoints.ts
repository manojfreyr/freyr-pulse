import type { Company, PersonaId, TalkingPoint } from "@/lib/types";
import { PERSONA_BY_ID } from "@/lib/mock/personas";

/**
 * Resolves a company-independent Persona against a specific Company to produce
 * company-aware TalkingPoints. In Phase 1 this is deterministic templating; the
 * function signature is the seam where a real LLM call slots in later.
 */
export function generateTalkingPoints(company: Company, personaId: PersonaId): TalkingPoint {
  const persona = PERSONA_BY_ID[personaId];
  const topTrigger = company.triggers[0];
  const triggerPhrase = topTrigger ? topTrigger.headline.toLowerCase() : "recent developments";

  const openingLine = fill(persona.openingLineTemplate, {
    company: company.name,
    trigger: triggerPhrase,
  });

  // Company-flavoured pain points: blend the persona's generic pains with any
  // company pain points whose service this persona tends to own.
  const personaServiceIds = company.serviceRecommendations
    .filter((r) => r.likelyBuyer === personaId)
    .map((r) => r.triggerOrPainPoint);

  const painPoints = dedupe([...personaServiceIds, ...persona.painPoints]).slice(0, 5);

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
