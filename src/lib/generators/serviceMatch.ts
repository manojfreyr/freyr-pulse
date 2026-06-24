import type { Company, ConfidenceRating, FreyrService, PersonaId, SignalCategory, SourceCitation } from "@/lib/types";
import { deriveSignals } from "@/lib/signals/companySignals";
import type { CompanySignal } from "@/lib/types";
import { CONFIDENCE_RANK } from "@/lib/signals/sourceTrust";
import {
  BASE_WEIGHTS,
  confidenceMultiplier,
  corroborationBonus,
  evidenceStrength,
  recencyMultiplier,
  type EvidenceStrength,
  type MatchType,
} from "./scoring";

/**
 * ──────────────────────────────────────────────────────────────────────────
 * THE single source of truth for service recommendations.
 *
 *   Company signals (deriveSignals, incl. live enrichment) + triggers + pains
 *     → matchServices(company, activeCatalog)
 *       → Ranked MatchedService[]  (evidence-weighted, explainable)
 *         → Services grid · Hero "Top services" · Personas · Outreach · Strategy
 *
 * Phase 2B: each match is weighted by the matching signal's confidence and
 * recency, plus a small capped corroboration bonus when independent sources
 * agree. Every result carries structured `evidence` (citation-backed) and a
 * deterministic `whyRelevant` summary. Backward compatible: existing fields are
 * preserved; new fields are optional.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** One piece of citation-backed evidence behind a recommendation. */
export interface EvidenceItem {
  signalKey: string;
  signalLabel: string;
  matchType: MatchType;
  category: SignalCategory | "trigger";
  confidence: ConfidenceRating;
  observedAt?: string;
  recencyFactor: number;
  contribution: number; // points added after weighting
  sources: SourceCitation[];
}

export interface MatchedService {
  service: FreyrService;
  relevanceScore: number; // 0–100 (evidence-weighted)
  matchedSignals: string[];
  whyRelevant: string;
  likelyBuyer: PersonaId;
  triggerOrPainPoint: string;
  suggestedOpeningMessage: string;
  confidence: ConfidenceRating;
  // ── Phase 2B (optional, additive) ──
  evidence?: EvidenceItem[];
  evidenceStrength?: EvidenceStrength;
  breakdown?: { base: number; confidenceRecencyAdj: number; corroborationBonus: number };
}

/** Substring-tolerant single-key match (mirrors signalMatches semantics). */
function keyMatches(key: string, term: string): boolean {
  const t = term.toLowerCase();
  const k = key.toLowerCase();
  return k === t || k.includes(t) || t.includes(k);
}

/** Strongest-confidence signal whose key matches a catalog term (or null). */
function bestMatchingSignal(signals: CompanySignal[], term: string): CompanySignal | null {
  let best: CompanySignal | null = null;
  for (const s of signals) {
    if (!keyMatches(s.key, term)) continue;
    if (!best || CONFIDENCE_RANK[s.confidence] > CONFIDENCE_RANK[best.confidence]) best = s;
  }
  return best;
}

export function matchServices(company: Company, services: FreyrService[], limit = 8): MatchedService[] {
  const signals = deriveSignals(company);
  const now = new Date();

  const directPainServiceIds = new Set(
    company.painPoints.map((p) => p.relevantServiceId).filter((id): id is string => Boolean(id)),
  );
  // Curated company triggers, keyed by type, carry their own confidence + source.
  const triggerByType = new Map(company.triggers.map((t) => [t.type, t] as const));

  const matched: MatchedService[] = [];

  for (const service of services) {
    if (!service.activeStatus) continue;

    // Build evidence, de-duped by signal key (keep the highest-contribution item)
    // so a term appearing in both relevantCompanySignals and keywords isn't double-counted.
    const byKey = new Map<string, EvidenceItem>();
    const addEvidence = (item: EvidenceItem) => {
      const prev = byKey.get(item.signalKey);
      if (!prev || item.contribution > prev.contribution) byKey.set(item.signalKey, item);
    };

    const consider = (term: string, type: "signal" | "keyword") => {
      const sig = bestMatchingSignal(signals, term);
      if (!sig) return;
      const rf = recencyMultiplier(sig.observedAt, now);
      const contribution = BASE_WEIGHTS[type] * confidenceMultiplier(sig.confidence) * rf;
      addEvidence({
        signalKey: sig.key,
        signalLabel: sig.label,
        matchType: type,
        category: sig.category,
        confidence: sig.confidence,
        observedAt: sig.observedAt,
        recencyFactor: rf,
        contribution,
        sources: sig.citations ?? [],
      });
    };

    for (const term of service.relevantCompanySignals) consider(term, "signal");
    for (const kw of service.keywords) consider(kw, "keyword");

    // Curated business triggers (BusinessTrigger objects on the company).
    const matchedTriggers: string[] = [];
    for (const trg of service.buyingTriggers) {
      const t = triggerByType.get(trg);
      if (!t) continue;
      matchedTriggers.push(trg);
      const observedAt = t.source?.publishedAt;
      const rf = recencyMultiplier(observedAt, now);
      const contribution = BASE_WEIGHTS.trigger * confidenceMultiplier(t.confidence) * rf;
      addEvidence({
        signalKey: `trigger:${trg}`,
        signalLabel: trg,
        matchType: "trigger",
        category: "trigger",
        confidence: t.confidence,
        observedAt,
        recencyFactor: rf,
        contribution,
        sources: t.source ? [t.source] : [],
      });
    }

    // Explicit human-noted pain-point link (strong, curated).
    let directPain: string | undefined;
    if (directPainServiceIds.has(service.id)) {
      const pain = company.painPoints.find((p) => p.relevantServiceId === service.id);
      directPain = pain?.title;
      const conf = pain?.confidence ?? "Likely";
      addEvidence({
        signalKey: `pain:${service.id}`,
        signalLabel: directPain ?? "Noted challenge",
        matchType: "painpoint",
        category: "pain-point",
        confidence: conf,
        recencyFactor: 1,
        contribution: BASE_WEIGHTS.painpoint * confidenceMultiplier(conf),
        sources: [],
      });
    }

    const evidence = Array.from(byKey.values()).sort((a, b) => b.contribution - a.contribution);
    if (!evidence.length) continue;

    const rawScore = evidence.reduce((s, e) => s + e.contribution, 0);
    const baseSum = evidence.reduce((s, e) => s + BASE_WEIGHTS[e.matchType], 0);

    // Corroboration: distinct source types across the contributing signals.
    const sourceTypes = new Set<string>();
    for (const e of evidence) for (const c of e.sources) if (c.sourceType) sourceTypes.add(c.sourceType);
    const corr = corroborationBonus(sourceTypes.size);

    const score = Math.min(100, Math.round(rawScore * corr));
    const strength = evidenceStrength(evidence.map((e) => ({ confidence: e.confidence, recencyFactor: e.recencyFactor })), sourceTypes.size);

    const topConfidence = evidence.reduce<ConfidenceRating>(
      (m, e) => (CONFIDENCE_RANK[e.confidence] > CONFIDENCE_RANK[m] ? e.confidence : m),
      "Unknown",
    );

    const triggerOrPainPoint =
      directPain ??
      (matchedTriggers[0] ? `Trigger: ${matchedTriggers[0]}` : undefined) ??
      (evidence[0] ? `Signal: ${evidence[0].signalLabel}` : "Portfolio fit");

    matched.push({
      service,
      relevanceScore: score,
      matchedSignals: evidence.slice(0, 5).map((e) => e.signalLabel),
      whyRelevant: buildWhy(service, evidence, sourceTypes.size, strength),
      likelyBuyer: service.targetPersonas[0] ?? "vp-regulatory-affairs",
      triggerOrPainPoint,
      suggestedOpeningMessage: service.exampleOpeningMessage,
      confidence: topConfidence,
      evidence,
      evidenceStrength: strength,
      breakdown: {
        base: Math.round(baseSum),
        confidenceRecencyAdj: Math.round(rawScore - baseSum),
        corroborationBonus: Math.round(score - rawScore),
      },
    });
  }

  // Deterministic ranking: score, then strongest confidence, then source breadth,
  // then service name (stable).
  return matched
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
      const ca = CONFIDENCE_RANK[a.confidence];
      const cb = CONFIDENCE_RANK[b.confidence];
      if (cb !== ca) return cb - ca;
      const sa = (a.evidence ?? []).reduce((n, e) => n + e.sources.length, 0);
      const sb = (b.evidence ?? []).reduce((n, e) => n + e.sources.length, 0);
      if (sb !== sa) return sb - sa;
      return a.service.serviceName.localeCompare(b.service.serviceName);
    })
    .slice(0, limit);
}

const CONF_WORD: Record<ConfidenceRating, string> = {
  Verified: "Verified",
  Likely: "Likely",
  Inferred: "Inferred",
  Unknown: "unverified",
};

/** Deterministic one-line "why", citation-aware, no LLM. */
function buildWhy(service: FreyrService, evidence: EvidenceItem[], distinctSources: number, strength: EvidenceStrength): string {
  const top = evidence.slice(0, 2).map((e) => {
    const src = e.sources[0]?.publisher || e.sources[0]?.sourceType;
    const when = e.observedAt ? `, ${e.observedAt.slice(0, 7)}` : "";
    return `${CONF_WORD[e.confidence]} ${e.signalLabel}${src ? ` (${src}${when})` : ""}`;
  });
  if (!top.length) return service.description;
  const corr = distinctSources >= 2 ? ` — corroborated by ${distinctSources} sources` : "";
  if (strength === "Limited") {
    return `Based on limited, unverified signals (${top.join("; ")}). Run live research to strengthen.`;
  }
  return `Recommended on ${top.join(" and ")}${corr}.`;
}
