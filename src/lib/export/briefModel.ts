import type {
  Company,
  ConfidenceRating,
  FreyrService,
  PersonaId,
  SignalCategory,
  SourceCitation,
} from "@/lib/types";
import { deriveSignals, groupSignalsByCategory } from "@/lib/signals/companySignals";
import { matchServices, type MatchedService } from "@/lib/generators/serviceMatch";
import type { EvidenceStrength } from "@/lib/generators/scoring";
import { generateOutreach } from "@/lib/generators/outreach";
import { generateTalkingPoints } from "@/lib/generators/talkingPoints";
import { PERSONA_BY_ID } from "@/lib/mock/personas";
import { collectCitations, citationKey, type NumberedCitation } from "./citations";

/**
 * THE single shaped model every exporter (PDF/PPTX/DOCX) renders from. It is a
 * faithful projection of the live dashboard — built by calling the same
 * matchServices / deriveSignals / generators — so an exported brief can never
 * diverge from what the user sees. No new claims are invented here. Every
 * insight carries citations or is explicitly tagged "Freyr analysis".
 */

export interface Insight {
  label: string;
  value?: string;
  confidence?: ConfidenceRating;
  observedAt?: string;
  citations: SourceCitation[];
  analysis?: boolean; // true when there is no external citation (curated/derived)
}

export interface BriefEvidence {
  label: string;
  confidence: ConfidenceRating;
  observedAt?: string;
  contribution: number;
  citations: SourceCitation[];
}

export interface BriefService {
  id: string;
  name: string;
  line: string;
  category: string;
  score: number;
  strength?: EvidenceStrength;
  why: string;
  likelyBuyer: string;
  opener: string;
  evidence: BriefEvidence[];
}

export interface BriefPersona {
  id: PersonaId;
  title: string;
  caresAbout: string[];
  kpis: string[];
  openingLine: string;
  discoveryQuestions: string[];
  objections: { objection: string; response: string }[];
  recommendedNextStep: string;
}

export interface BriefTrigger {
  headline: string;
  whyItMatters: string;
  confidence: ConfidenceRating;
  observedAt?: string;
  citations: SourceCitation[];
  analysis?: boolean;
}

export interface BriefOutreach {
  label: string;
  subject?: string;
  body: string;
}

export interface AccountBrief {
  company: { name: string; website: string; monogram: string; segment: string; size: string; hq: string };
  generatedAt: string;
  dataAsOf: string;
  researched: boolean;
  opportunity: {
    verdict: string;
    level: string;
    score: number;
    confidence: ConfidenceRating;
    reasons: string[];
    nextBestAction: string;
    overallStrength: EvidenceStrength;
  };
  snapshot: Insight[];
  signals: { category: string; items: Insight[] }[];
  whyNow: BriefTrigger[];
  services: BriefService[];
  personas: BriefPersona[];
  primaryPersonaId: PersonaId;
  primaryPersonaTitle: string;
  outreach: BriefOutreach[];
  citations: NumberedCitation[];
  /** key (url|||label) -> footnote number, for inline [n] refs. */
  citationIndex: Record<string, number>;
}

const CATEGORY_LABEL: Record<SignalCategory, string> = {
  "therapeutic-area": "Therapeutic areas",
  segment: "Industry segment",
  size: "Size & scale",
  footprint: "Global footprint",
  product: "Products",
  market: "Markets",
  pipeline: "Clinical pipeline",
  regulatory: "Regulatory activity",
  trigger: "Business triggers",
  "pain-point": "Pain points",
  derived: "Derived signals",
};
const CATEGORY_ORDER: SignalCategory[] = [
  "segment", "size", "footprint", "therapeutic-area", "product", "pipeline", "regulatory", "market", "trigger", "derived", "pain-point",
];

function loc(l?: { city: string; country: string }): string {
  return l ? `${l.city}, ${l.country}` : "—";
}

function sourcedInsight(label: string, s: { value: string; confidence: ConfidenceRating; sources: SourceCitation[] }): Insight {
  const citations = (s.sources ?? []).filter((c) => c.type !== "Placeholder");
  return { label, value: s.value, confidence: s.confidence, citations, analysis: citations.length === 0 };
}

/** Default persona for a company: caller override → top service buyer → entry. */
function defaultPersona(matched: MatchedService[], override?: PersonaId): PersonaId {
  if (override && PERSONA_BY_ID[override]) return override;
  return matched[0]?.likelyBuyer ?? "vp-regulatory-affairs";
}

export function buildAccountBrief(
  company: Company,
  services: FreyrService[],
  opts: { generatedAt: string; personaId?: PersonaId },
): AccountBrief {
  const signals = deriveSignals(company);
  const matched = matchServices(company, services, 8);
  const primaryPersonaId = defaultPersona(matched, opts.personaId);

  // ---- snapshot ----
  const snap = company.snapshot;
  const snapshot: Insight[] = [
    { label: "Industry segment", value: snap.industrySegment, citations: [], analysis: true },
    sourcedInsight("Annual revenue", snap.annualRevenueUSD),
    sourcedInsight("Employees", snap.employeeCount),
    { label: "Size category", value: snap.sizeCategory, citations: [], analysis: true },
    { label: "Headquarters", value: loc(snap.headquarters), citations: [], analysis: true },
    { label: "Global footprint", value: `${snap.globalLocations.length} locations`, citations: [], analysis: true },
    { label: "Public status", value: snap.publicStatus + (snap.stockTicker ? ` (${snap.stockTicker})` : ""), citations: [], analysis: true },
    { label: "Therapeutic focus", value: snap.therapeuticFocus.join(", ") || "—", citations: [], analysis: true },
  ];

  // ---- signals grouped by category ----
  const grouped = groupSignalsByCategory(signals);
  const signalGroups: { category: string; items: Insight[] }[] = [];
  for (const cat of CATEGORY_ORDER) {
    const list = grouped[cat];
    if (!list?.length) continue;
    const items: Insight[] = list.slice(0, 8).map((s) => {
      const citations = (s.citations ?? []).filter((c) => c.type !== "Placeholder");
      return { label: s.label, confidence: s.confidence, observedAt: s.observedAt, citations, analysis: citations.length === 0 };
    });
    signalGroups.push({ category: CATEGORY_LABEL[cat], items });
  }

  // ---- why now (curated triggers + dated event signals) ----
  const whyNow: BriefTrigger[] = company.triggers.slice(0, 6).map((t) => {
    const cite = t.source && t.source.type !== "Placeholder" ? [t.source] : [];
    return { headline: t.headline, whyItMatters: t.whyItMatters, confidence: t.confidence, observedAt: t.source?.publishedAt ?? t.date, citations: cite, analysis: cite.length === 0 };
  });
  // Add enrichment-derived events not already represented.
  const seen = new Set(whyNow.map((w) => w.headline.toLowerCase()));
  for (const s of signals) {
    if (whyNow.length >= 8) break;
    if (!["trigger", "regulatory", "pipeline"].includes(s.category)) continue;
    if (!s.observedAt) continue;
    if (seen.has(s.label.toLowerCase())) continue;
    const citations = (s.citations ?? []).filter((c) => c.type !== "Placeholder");
    whyNow.push({ headline: s.label, whyItMatters: "Live signal from connector enrichment.", confidence: s.confidence, observedAt: s.observedAt, citations, analysis: citations.length === 0 });
    seen.add(s.label.toLowerCase());
  }

  // ---- services (faithful to dashboard ranking) ----
  const briefServices: BriefService[] = matched.map((m) => ({
    id: m.service.id,
    name: m.service.serviceName,
    line: m.service.serviceLine,
    category: m.service.serviceCategory,
    score: m.relevanceScore,
    strength: m.evidenceStrength,
    why: m.whyRelevant,
    likelyBuyer: PERSONA_BY_ID[m.likelyBuyer]?.title ?? m.likelyBuyer,
    opener: m.suggestedOpeningMessage,
    evidence: (m.evidence ?? []).slice(0, 6).map((e) => ({
      label: e.signalLabel,
      confidence: e.confidence,
      observedAt: e.observedAt,
      contribution: Math.round(e.contribution),
      citations: e.sources.filter((c) => c.type !== "Placeholder"),
    })),
  }));

  // ---- personas (primary + other relevant) ----
  const relevantIds: PersonaId[] = [];
  for (const id of [primaryPersonaId, ...matched.flatMap((m) => m.service.targetPersonas)]) {
    if (!relevantIds.includes(id) && PERSONA_BY_ID[id]) relevantIds.push(id);
    if (relevantIds.length >= 3) break;
  }
  const personas: BriefPersona[] = relevantIds.map((id) => {
    const tp = generateTalkingPoints(company, id, matched);
    const p = PERSONA_BY_ID[id];
    return {
      id, title: p.title, caresAbout: tp.caresAbout, kpis: tp.kpis,
      openingLine: tp.openingLine, discoveryQuestions: tp.discoveryQuestions,
      objections: tp.objections, recommendedNextStep: tp.recommendedNextStep,
    };
  });

  // ---- outreach for the primary persona ----
  const outreach: BriefOutreach[] = generateOutreach(company, primaryPersonaId, matched).map((o) => ({ label: o.label, subject: o.subject, body: o.body }));

  // ---- overall strength ----
  const overallStrength: EvidenceStrength = briefServices[0]?.strength ?? "Limited";

  // ---- citations (deterministic collection over fixed section order) ----
  const allCitationArrays: SourceCitation[][] = [
    ...snapshot.map((i) => i.citations),
    ...signalGroups.flatMap((g) => g.items.map((i) => i.citations)),
    ...whyNow.map((w) => w.citations),
    ...briefServices.flatMap((s) => s.evidence.map((e) => e.citations)),
  ];
  const numbered = collectCitations(allCitationArrays);
  const citationIndex: Record<string, number> = {};
  for (const nc of numbered) citationIndex[citationKey(nc.citation)] = nc.n;

  return {
    company: {
      name: company.name, website: company.website, monogram: company.logoMonogram,
      segment: snap.industrySegment, size: snap.sizeCategory, hq: loc(snap.headquarters),
    },
    generatedAt: opts.generatedAt,
    dataAsOf: company.enrichment?.lastResearchedAt ?? snap.lastUpdated,
    researched: Boolean(company.enrichment?.lastResearchedAt),
    opportunity: {
      verdict: company.opportunity.verdict, level: company.opportunity.level,
      score: company.opportunity.score, confidence: company.opportunity.confidence,
      reasons: company.opportunity.reasons, nextBestAction: company.opportunity.nextBestAction,
      overallStrength,
    },
    snapshot, signals: signalGroups, whyNow, services: briefServices, personas,
    primaryPersonaId, primaryPersonaTitle: PERSONA_BY_ID[primaryPersonaId]?.title ?? primaryPersonaId,
    outreach, citations: numbered, citationIndex,
  };
}

export type { Deliverable, ExportFormat } from "./formats";
export { FORMAT_MATRIX } from "./formats";
