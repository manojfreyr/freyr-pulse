import type { Company, ConfidenceRating, FreyrService, PersonaId } from "@/lib/types";

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
 * Builds a lowercased "signal bag" describing a company, derived from its
 * structured profile. Services declare `relevantCompanySignals`, `keywords`,
 * and `buyingTriggers`; the matcher scores overlap against this bag. This is
 * the Phase 1 stand-in for a future weighted scoring model.
 */
function buildSignalBag(company: Company): Set<string> {
  const bag = new Set<string>();
  const add = (s?: string) => { if (s) bag.add(s.toLowerCase()); };

  company.snapshot.therapeuticFocus.forEach(add);
  company.therapeuticAreas.forEach((t) => add(t.name));
  add(company.snapshot.industrySegment);
  add(company.snapshot.sizeCategory);

  // Footprint
  const regions = new Set(company.snapshot.globalLocations.map((l) => l.region));
  if (regions.size >= 2) { bag.add("global"); bag.add("many markets"); }
  if (company.snapshot.sizeCategory.startsWith("Enterprise") || company.snapshot.sizeCategory.startsWith("Large")) {
    bag.add("enterprise"); bag.add("broad portfolio");
  }

  // Triggers (type + a few derived terms from the headline)
  company.triggers.forEach((t) => {
    bag.add(t.type.toLowerCase());
    const h = t.headline.toLowerCase();
    ["biosimilar", "acquisition", "oncology", "cell therapy", "mdr", "ivdr", "digital", "vendor", "device", "launch", "expansion", "integration"].forEach((k) => {
      if (h.includes(k)) bag.add(k);
    });
  });

  // Products
  company.products.forEach((p) => {
    add(p.category); add(p.therapeuticArea);
    p.approvedMarkets.forEach(add);
    const c = p.category.toLowerCase();
    if (c.includes("biosimilar")) bag.add("biosimilar");
    if (c.includes("cell therapy")) bag.add("cell therapy");
    if (c.includes("device") || c.includes("implant")) { bag.add("device"); bag.add("medtech"); bag.add("mdr/ivdr"); }
    if (c.includes("connected") || c.includes("digital") || c.includes("samd")) { bag.add("connected"); bag.add("digital"); bag.add("software"); }
    if (c.includes("combination")) bag.add("delivery");
    if (c.includes("mrna")) bag.add("mrna");
  });

  // Pain points (titles)
  company.painPoints.forEach((pp) => add(pp.title));

  // Segment-derived
  const seg = company.snapshot.industrySegment.toLowerCase();
  if (seg.includes("device") || seg.includes("medtech")) { bag.add("device"); bag.add("medtech"); bag.add("mdr/ivdr"); }
  if (seg.includes("diagnostic")) bag.add("diagnostics");

  return bag;
}

function bagHas(bag: Set<string>, term: string): boolean {
  const t = term.toLowerCase();
  if (bag.has(t)) return true;
  for (const entry of bag) {
    if (entry.includes(t) || t.includes(entry)) return true;
  }
  return false;
}

/**
 * Scores each active service against the company and returns ranked matches.
 * @param limit max number of recommendations to return.
 */
export function matchServices(company: Company, services: FreyrService[], limit = 8): MatchedService[] {
  const bag = buildSignalBag(company);
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
      if (bagHas(bag, sig)) { score += 12; reasons.push(sig); }
    }
    for (const kw of service.keywords) {
      if (bagHas(bag, kw)) { score += 5; reasons.push(kw); }
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
