import type { Company, ConfidenceRating, FreyrService, PersonaId, SourceCitation } from "@/lib/types";
import { deriveSignals } from "@/lib/signals/companySignals";
import type { CompanySignal } from "@/lib/types";
import { matchServices, type MatchedService } from "@/lib/generators/serviceMatch";
import { CONFIDENCE_RANK } from "@/lib/signals/sourceTrust";
import { confidenceMultiplier, recencyMultiplier, evidenceStrength, type EvidenceStrength } from "@/lib/generators/scoring";
import { PERSONA_BY_ID, PERSONAS } from "@/lib/mock/personas";
import {
  FACTOR_WEIGHTS, FACTOR_LABEL, tierForScore, EVIDENCE_MIN_SIGNALS,
  TRIGGER_IMPACT, signalTriggerImpact, MATURITY_VALUE, type FactorKey, type Tier,
} from "./scoring";
import { triggerWhy, MATURITY_RULES, DIFFERENTIATORS, NBA_BY_MATURITY } from "./tables";

/**
 * Account-level Opportunity Intelligence: a deterministic, evidence-backed
 * projection over the same signals + 2B recommendations the dashboard uses.
 * Every factor, trigger, maturity tag and differentiator records the cited
 * evidence that produced it. Computed model is preferred; curated
 * company.opportunity is the fallback when evidence is thin.
 */

export interface OppEvidence {
  label: string;
  confidence?: ConfidenceRating;
  observedAt?: string;
  citations: SourceCitation[];
  analysis?: boolean;
}
export interface ScoredFactor {
  key: FactorKey;
  label: string;
  factorScore: number; // 0..1
  weight: number;
  contribution: number; // 0..100 portion
  confidence: ConfidenceRating;
  explanation: string;
  evidence: OppEvidence[];
}
export interface TriggerEvent {
  headline: string;
  whyItMatters: string;
  impact: number;
  confidence: ConfidenceRating;
  observedAt?: string;
  weightedImpact: number;
  citations: SourceCitation[];
  analysis?: boolean;
}
export interface MaturityResult { primary: string; secondary: string[]; evidence: OppEvidence[] }
export interface RankedPersona { id: PersonaId; title: string; score: number; rationale: string; topServices: string[] }
export interface NextAction { action: string; rationale: string; primary: boolean; evidence: OppEvidence[] }
export interface Differentiator { title: string; positioning: string; trigger: string; citations: SourceCitation[] }

export interface OpportunityIntelligence {
  computed: boolean;
  score: number;
  tier: Tier;
  evidenceStrength: EvidenceStrength;
  confidence: ConfidenceRating;
  verdict: string;
  whyCare: string[];
  factors: ScoredFactor[];
  whyNow: TriggerEvent[];
  maturity: MaturityResult;
  stakeholders: RankedPersona[];
  nextActions: NextAction[];
  differentiators: Differentiator[];
}

const realCites = (c?: SourceCitation[]) => (c ?? []).filter((x) => x && x.type !== "Placeholder");
function keyMatches(key: string, term: string): boolean {
  const k = key.toLowerCase(); const t = term.toLowerCase();
  return k === t || k.includes(t) || t.includes(k);
}
function strongest(list: { confidence: ConfidenceRating }[]): ConfidenceRating {
  return list.reduce<ConfidenceRating>((m, i) => (CONFIDENCE_RANK[i.confidence] > CONFIDENCE_RANK[m] ? i.confidence : m), "Unknown");
}
/** Weighted-vote confidence across factors (by weight). */
function weightedConfidence(items: { confidence: ConfidenceRating; weight: number }[]): ConfidenceRating {
  const order: ConfidenceRating[] = ["Unknown", "Inferred", "Likely", "Verified"];
  let num = 0, den = 0;
  for (const i of items) { num += CONFIDENCE_RANK[i.confidence] * i.weight; den += i.weight; }
  const avg = den ? num / den : 0;
  return order[Math.max(0, Math.min(order.length - 1, Math.round(avg) - 1))] ?? "Unknown";
}

function buildTriggers(company: Company, signals: CompanySignal[]): TriggerEvent[] {
  const events: TriggerEvent[] = [];
  for (const t of company.triggers) {
    const impact = TRIGGER_IMPACT[t.type] ?? 0.5;
    const observedAt = t.source?.publishedAt ?? t.date;
    const cites = realCites(t.source ? [t.source] : []);
    events.push({
      headline: t.headline, whyItMatters: t.whyItMatters, impact, confidence: t.confidence, observedAt,
      weightedImpact: impact * confidenceMultiplier(t.confidence) * recencyMultiplier(observedAt),
      citations: cites, analysis: cites.length === 0,
    });
  }
  const seen = new Set(events.map((e) => e.headline.toLowerCase()));
  for (const s of signals) {
    if (!["trigger", "regulatory", "pipeline"].includes(s.category)) continue;
    if (s.category === "pipeline" && !s.observedAt) continue; // pipeline summaries aren't "events"
    if (seen.has(s.label.toLowerCase())) continue;
    const impact = signalTriggerImpact(s.key);
    const cites = realCites(s.citations);
    events.push({
      headline: s.label, whyItMatters: triggerWhy(s.key) ?? "Live signal from connector enrichment.",
      impact, confidence: s.confidence, observedAt: s.observedAt,
      weightedImpact: impact * confidenceMultiplier(s.confidence) * recencyMultiplier(s.observedAt),
      citations: cites, analysis: cites.length === 0,
    });
    seen.add(s.label.toLowerCase());
  }
  return events.sort((a, b) => b.weightedImpact - a.weightedImpact).slice(0, 6);
}

function buildMaturity(signals: CompanySignal[]): MaturityResult {
  const matched: { stage: string; evidence: OppEvidence[] }[] = [];
  for (const rule of MATURITY_RULES) {
    const hits = signals.filter((s) => rule.keys.some((k) => keyMatches(s.key, k)));
    if (hits.length) matched.push({ stage: rule.stage, evidence: hits.map((s) => ({ label: s.label, confidence: s.confidence, observedAt: s.observedAt, citations: realCites(s.citations), analysis: realCites(s.citations).length === 0 })) });
  }
  if (!matched.length) return { primary: "Pre-clinical", secondary: [], evidence: [] };
  return { primary: matched[0].stage, secondary: matched.slice(1).map((m) => m.stage), evidence: matched.flatMap((m) => m.evidence).slice(0, 8) };
}

function rankStakeholders(matched: MatchedService[]): RankedPersona[] {
  const acc = new Map<PersonaId, { score: number; services: { name: string; score: number }[] }>();
  for (const m of matched) {
    const owners = new Set<PersonaId>([m.likelyBuyer, ...m.service.targetPersonas]);
    for (const id of owners) {
      if (!PERSONA_BY_ID[id]) continue;
      const cur = acc.get(id) ?? { score: 0, services: [] };
      cur.score += m.relevanceScore;
      cur.services.push({ name: m.service.serviceName, score: m.relevanceScore });
      acc.set(id, cur);
    }
  }
  const ranked: RankedPersona[] = [];
  for (const [id, v] of acc) {
    const top = v.services.sort((a, b) => b.score - a.score).slice(0, 3).map((s) => s.name);
    ranked.push({ id, title: PERSONA_BY_ID[id].title, score: Math.round(v.score), topServices: top, rationale: `${v.services.length} matched service(s) sit with this role (top: ${top.slice(0, 2).join(", ")}).` });
  }
  return ranked.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.title.localeCompare(b.title))).slice(0, 4);
}

function buildDifferentiators(signals: CompanySignal[]): Differentiator[] {
  const out: Differentiator[] = [];
  const used = new Set<string>();
  for (const d of DIFFERENTIATORS) {
    const hit = signals.find((s) => d.keys.some((k) => keyMatches(s.key, k)));
    if (!hit || used.has(d.title)) continue;
    used.add(d.title);
    out.push({ title: d.title, positioning: d.positioning, trigger: hit.label, citations: realCites(hit.citations) });
  }
  return out.slice(0, 5);
}

function buildNextActions(maturity: MaturityResult, triggers: TriggerEvent[], stakeholders: RankedPersona[], curatedNBA: string): NextAction[] {
  const persona = stakeholders[0]?.title ?? "the regulatory lead";
  const trig = triggers[0];
  const trigText = trig ? trig.headline : "recent developments";
  const tmpl = NBA_BY_MATURITY[maturity.primary] ?? NBA_BY_MATURITY["Unknown"];
  const primaryEvidence: OppEvidence[] = trig ? [{ label: trig.headline, confidence: trig.confidence, observedAt: trig.observedAt, citations: trig.citations, analysis: trig.analysis }] : [];
  const actions: NextAction[] = [
    { action: tmpl.replace("{persona}", persona).replace("{trigger}", trigText), rationale: `Maturity: ${maturity.primary}${trig ? ` · strongest trigger: ${trig.headline}` : ""}.`, primary: true, evidence: primaryEvidence },
  ];
  if (trig) actions.push({ action: `Lead outreach with the strongest evidence: ${trig.headline}.`, rationale: "Highest impact × confidence × recency trigger.", primary: false, evidence: primaryEvidence });
  if (stakeholders[0]) actions.push({ action: `Prepare a Meeting Prep brief for ${stakeholders[0].title} (Export → Meeting Prep).`, rationale: "Primary stakeholder by evidence-weighted service ownership.", primary: false, evidence: [] });
  if (stakeholders[1]) actions.push({ action: `Multi-thread to ${stakeholders[1].title}.`, rationale: "Secondary stakeholder for broader coverage.", primary: false, evidence: [] });
  if (!trig && curatedNBA) actions.push({ action: curatedNBA, rationale: "Curated guidance (limited live evidence).", primary: false, evidence: [] });
  return actions;
}

// ---------- factors ----------
function factorFit(matched: MatchedService[]): ScoredFactor {
  const top = matched.slice(0, 5);
  const sum = top.reduce((s, m) => s + m.relevanceScore, 0);
  const factorScore = Math.min(1, sum / 250); // 5 services averaging 50 → 1.0
  const evidence: OppEvidence[] = top.slice(0, 3).map((m) => ({ label: `${m.service.serviceName} (${m.evidenceStrength ?? "—"})`, confidence: m.confidence, citations: realCites(m.evidence?.[0]?.sources) , analysis: realCites(m.evidence?.[0]?.sources).length === 0 }));
  return mkFactor("fit", factorScore, evidence, `${top.length} strongly-matched service(s); top score ${top[0]?.relevanceScore ?? 0}/100.`, top.length ? strongest(top.map((m) => ({ confidence: m.confidence }))) : "Unknown");
}
function factorTiming(triggers: TriggerEvent[]): ScoredFactor {
  const top = triggers.slice(0, 3);
  const factorScore = Math.min(1, top.reduce((s, t) => s + t.weightedImpact, 0) / 1.5);
  const evidence: OppEvidence[] = top.map((t) => ({ label: t.headline, confidence: t.confidence, observedAt: t.observedAt, citations: t.citations, analysis: t.analysis }));
  return mkFactor("timing", factorScore, evidence, top.length ? `Strongest trigger: ${top[0].headline}.` : "No recent triggers detected.", top.length ? strongest(top.map((t) => ({ confidence: t.confidence }))) : "Unknown");
}
function factorRichness(signals: CompanySignal[]): ScoredFactor {
  const solid = signals.filter((s) => CONFIDENCE_RANK[s.confidence] >= CONFIDENCE_RANK.Likely && realCites(s.citations).length > 0);
  const factorScore = Math.min(1, solid.length / 10);
  const evidence: OppEvidence[] = solid.slice(0, 3).map((s) => ({ label: s.label, confidence: s.confidence, observedAt: s.observedAt, citations: realCites(s.citations) }));
  return mkFactor("richness", factorScore, evidence, `${solid.length} corroborated, cited signal(s).`, solid.length ? strongest(solid.map((s) => ({ confidence: s.confidence }))) : "Unknown");
}
function factorMaturity(maturity: MaturityResult): ScoredFactor {
  const factorScore = MATURITY_VALUE[maturity.primary] ?? 0.2;
  return mkFactor("maturity", factorScore, maturity.evidence.slice(0, 3), `Lifecycle stage: ${maturity.primary}${maturity.secondary.length ? ` (+${maturity.secondary.join(", ")})` : ""}.`, maturity.evidence.length ? strongest(maturity.evidence.map((e) => ({ confidence: e.confidence ?? "Unknown" }))) : "Inferred");
}
function factorReach(signals: CompanySignal[]): ScoredFactor {
  const reachKeys = ["global", "multi-region trials", "large clinical pipeline", "enterprise"];
  const hits = signals.filter((s) => reachKeys.some((k) => keyMatches(s.key, k)));
  const factorScore = Math.min(1, hits.length / 3);
  const evidence: OppEvidence[] = hits.slice(0, 3).map((s) => ({ label: s.label, confidence: s.confidence, citations: realCites(s.citations), analysis: realCites(s.citations).length === 0 }));
  return mkFactor("reach", factorScore, evidence, hits.length ? "Global / large-scale footprint signals present." : "Limited scale signals.", hits.length ? strongest(hits.map((s) => ({ confidence: s.confidence }))) : "Unknown");
}
function factorReadiness(stakeholders: RankedPersona[]): ScoredFactor {
  const primary = stakeholders[0];
  const factorScore = primary ? Math.min(1, primary.score / 120) : 0;
  const evidence: OppEvidence[] = primary ? [{ label: `Primary: ${primary.title}`, citations: [], analysis: true }] : [];
  return mkFactor("readiness", factorScore, evidence, primary ? `Clear entry persona: ${primary.title}.` : "No clear entry persona yet.", "Inferred");
}
function mkFactor(key: FactorKey, factorScore: number, evidence: OppEvidence[], explanation: string, confidence: ConfidenceRating): ScoredFactor {
  const weight = FACTOR_WEIGHTS[key];
  return { key, label: FACTOR_LABEL[key], factorScore, weight, contribution: Math.round(weight * factorScore * 100), confidence, explanation, evidence };
}

export function buildOpportunityIntelligence(company: Company, services: FreyrService[]): OpportunityIntelligence {
  const signals = deriveSignals(company);
  const matched = matchServices(company, services, 8);

  const triggers = buildTriggers(company, signals);
  const maturity = buildMaturity(signals);
  const stakeholders = rankStakeholders(matched);
  const differentiators = buildDifferentiators(signals);

  const factors: ScoredFactor[] = [
    factorFit(matched), factorTiming(triggers), factorRichness(signals),
    factorMaturity(maturity), factorReach(signals), factorReadiness(stakeholders),
  ];
  const score = Math.round(factors.reduce((s, f) => s + f.weight * f.factorScore, 0) * 100);

  // evidence sufficiency: enough corroborated, cited signals (or live enrichment)
  const solidSignals = signals.filter((s) => CONFIDENCE_RANK[s.confidence] >= CONFIDENCE_RANK.Likely && realCites(s.citations).length > 0).length;
  const computed = solidSignals >= EVIDENCE_MIN_SIGNALS || Boolean(company.enrichment?.lastResearchedAt);

  const allEvidence = factors.flatMap((f) => f.evidence);
  const distinctSources = new Set<string>();
  for (const e of allEvidence) for (const c of e.citations) if (c.sourceType) distinctSources.add(c.sourceType);
  const strength: EvidenceStrength = computed
    ? evidenceStrength(allEvidence.filter((e) => e.confidence).map((e) => ({ confidence: e.confidence!, recencyFactor: recencyMultiplier(e.observedAt) })), distinctSources.size)
    : "Limited";
  const confidence = weightedConfidence(factors.map((f) => ({ confidence: f.confidence, weight: f.weight })));

  const nextActions = buildNextActions(maturity, triggers, stakeholders, company.opportunity.nextBestAction);

  // verdict + whyCare: computed when evidence sufficient, else curated fallback.
  let finalScore = score, tier = tierForScore(score), verdict: string, whyCare: string[];
  const hasEvidence = matched.length > 0 || triggers.length > 0 || solidSignals > 0;
  if (computed && hasEvidence) {
    const lead = factors.slice().sort((a, b) => b.contribution - a.contribution)[0];
    verdict = `${tier} opportunity · ${strength} evidence (score ${score}/100).${lead ? ` Led by ${lead.label.toLowerCase()}.` : ""}`;
    whyCare = factors.filter((f) => f.factorScore > 0).sort((a, b) => b.contribution - a.contribution).slice(0, 4).map((f) => `${f.label}: ${f.explanation}`);
  } else if (computed) {
    // Researched but little public evidence surfaced — honest, not the bare placeholder.
    verdict = "Researched, but limited public evidence surfaced. Add a website, ticker, or aliases (Improve profile) and re-research to strengthen.";
    whyCare = [`Maturity: ${maturity.primary}.`, "Few corroborated signals available from free sources."];
  } else {
    finalScore = company.opportunity.score;
    tier = company.opportunity.level === "High" ? "Tier A" : company.opportunity.level === "Medium" ? "Tier B" : "Tier C";
    verdict = company.opportunity.verdict;
    whyCare = company.opportunity.reasons;
  }

  return {
    computed, score: finalScore, tier, evidenceStrength: strength, confidence, verdict, whyCare,
    factors, whyNow: triggers, maturity, stakeholders, nextActions, differentiators,
  };
}

/** Convenience: relevant personas ordered for this account (e.g. export default). */
export function primaryPersonaFor(company: Company, services: FreyrService[]): PersonaId {
  const ranked = rankStakeholders(matchServices(company, services, 8));
  return ranked[0]?.id ?? PERSONAS[0].id;
}
