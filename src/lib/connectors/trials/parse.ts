import type { CompanySignal, SignalCategory, SourceCitation } from "@/lib/types";

/**
 * Pure ClinicalTrials.gov (API v2) parsers — no network. Map study records into
 * pipeline / therapeutic-area / modality / footprint signals + submission-timing
 * triggers. Conservative sponsor matching avoids false positives.
 */

export function normalizeOrg(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(inc|corp|corporation|company|co|ltd|llc|plc|nv|sa|ag|gmbh|holdings?|pharmaceuticals?|pharma|therapeutics|biosciences?|biotech|labs?|laboratories)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface DateStruct {
  date?: string;
}
export interface Study {
  protocolSection?: {
    identificationModule?: { nctId?: string; briefTitle?: string };
    statusModule?: {
      overallStatus?: string;
      startDateStruct?: DateStruct;
      primaryCompletionDateStruct?: DateStruct;
      lastUpdatePostDateStruct?: DateStruct;
    };
    sponsorCollaboratorsModule?: { leadSponsor?: { name?: string; class?: string } };
    conditionsModule?: { conditions?: string[] };
    designModule?: { phases?: string[]; studyType?: string };
    armsInterventionsModule?: { interventions?: { type?: string; name?: string }[] };
    contactsLocationsModule?: { locations?: { country?: string }[] };
  };
}

const ACTIVE = new Set(["RECRUITING", "ACTIVE_NOT_RECRUITING", "ENROLLING_BY_INVITATION", "NOT_YET_RECRUITING"]);

const PHASE_RANK: Record<string, number> = { EARLY_PHASE1: 1, PHASE1: 2, PHASE2: 3, PHASE3: 4, PHASE4: 5 };

// Condition keyword → therapeutic-area bucket.
const TA_MAP: { pat: RegExp; key: string }[] = [
  { pat: /cancer|carcinoma|tumou?r|oncolog|leukemia|lymphoma|myeloma|melanoma/i, key: "oncology" },
  { pat: /diabet/i, key: "diabetes" },
  { pat: /cardio|heart|coronary|hypertension/i, key: "cardiology" },
  { pat: /neuro|alzheimer|parkinson|epilep|multiple sclerosis/i, key: "neurology" },
  { pat: /immun|arthritis|psoriasis|lupus|crohn|colitis/i, key: "immunology" },
  { pat: /infect|viral|vaccine|covid|influenza|hiv/i, key: "infectious disease" },
  { pat: /respir|asthma|copd|pulmonary/i, key: "respiratory" },
  { pat: /rare|orphan/i, key: "rare disease" },
  { pat: /ophthalm|retina|macular/i, key: "ophthalmology" },
  { pat: /dermat|skin/i, key: "dermatology" },
];

function modalityFromIntervention(type?: string, name = ""): string[] {
  const out: string[] = [];
  const t = (type || "").toUpperCase();
  const n = name.toLowerCase();
  if (t === "BIOLOGICAL") out.push("biologic");
  if (t === "GENETIC" || /gene therap/.test(n)) out.push("gene therapy");
  if (t === "DEVICE") out.push("device", "medtech");
  if (/car-?t|cell therap|stem cell/.test(n)) out.push("cell therapy");
  if (/vaccine/.test(n)) out.push("vaccine");
  if (t === "COMBINATION_PRODUCT") out.push("combination product");
  return out;
}

function studyUrl(nct: string): string {
  return `https://clinicaltrials.gov/study/${nct}`;
}
function searchUrl(name: string): string {
  return `https://clinicaltrials.gov/search?spons=${encodeURIComponent(name)}`;
}

function ctCitation(label: string, url: string, date?: string): SourceCitation {
  const at = new Date().toISOString();
  return {
    sourceType: "clinicaltrials",
    label,
    url,
    publisher: "ClinicalTrials.gov",
    type: "Industry Database",
    dateRetrieved: at,
    retrievedAt: at,
    ...(date ? { publishedAt: date } : {}),
  };
}

/** Keep studies whose lead sponsor matches the company (conservative). */
export function filterSponsorStudies(studies: Study[], query: { name: string; aliases?: string[] }): Study[] {
  const targets = new Set([normalizeOrg(query.name), ...(query.aliases ?? []).map(normalizeOrg)].filter(Boolean));
  return studies.filter((s) => {
    const lead = s.protocolSection?.sponsorCollaboratorsModule?.leadSponsor;
    if (!lead?.name) return false;
    const n = normalizeOrg(lead.name);
    if (!n) return false;
    for (const t of targets) if (t && (n === t || n.startsWith(t) || t.startsWith(n))) return true;
    return false;
  });
}

function mk(key: string, label: string, category: SignalCategory, confidence: CompanySignal["confidence"], citations: SourceCitation[], observedAt?: string): CompanySignal {
  return { key, label, category, confidence, source: "ClinicalTrials.gov", sourceType: "clinicaltrials", citations, ...(observedAt ? { observedAt } : {}) };
}

/** Build signals from a sponsor's studies. `now` injectable for tests. */
export function signalsFromStudies(studies: Study[], query: { name: string; aliases?: string[] }, now: Date = new Date()): CompanySignal[] {
  const matched = filterSponsorStudies(studies, query);
  if (!matched.length) return [];

  const out: CompanySignal[] = [];
  const search = ctCitation(`${query.name} — sponsored studies`, searchUrl(query.name));
  const horizon = 365 * 24 * 3600 * 1000;

  // Therapeutic areas (mapped buckets), modalities, phases, countries, triggers.
  const tas = new Set<string>();
  const modalities = new Set<string>();
  const countries = new Set<string>();
  let maxPhase = 0;
  let activeCount = 0;
  const triggers: CompanySignal[] = [];

  for (const s of matched) {
    const ps = s.protocolSection;
    const nct = ps?.identificationModule?.nctId || "";
    const status = (ps?.statusModule?.overallStatus || "").toUpperCase();
    const isActive = ACTIVE.has(status);
    if (isActive) activeCount++;
    const cite = nct ? ctCitation(`${nct} — ${ps?.identificationModule?.briefTitle?.slice(0, 80) || "study"}`, studyUrl(nct), ps?.statusModule?.lastUpdatePostDateStruct?.date) : search;

    (ps?.conditionsModule?.conditions ?? []).forEach((c) => {
      for (const m of TA_MAP) if (m.pat.test(c)) tas.add(m.key);
    });
    (ps?.armsInterventionsModule?.interventions ?? []).forEach((iv) => modalityFromIntervention(iv.type, iv.name).forEach((x) => modalities.add(x)));
    (ps?.contactsLocationsModule?.locations ?? []).forEach((l) => l.country && countries.add(l.country));
    (ps?.designModule?.phases ?? []).forEach((p) => (maxPhase = Math.max(maxPhase, PHASE_RANK[p.toUpperCase()] ?? 0)));

    // Recent trial start
    const start = ps?.statusModule?.startDateStruct?.date;
    if (start && now.getTime() - new Date(start).getTime() < horizon && now.getTime() - new Date(start).getTime() > 0) {
      triggers.push(mk("trial start", `New trial started: ${nct}`, "trigger", "Likely", [cite], start));
    }
    // Approaching primary completion → upcoming submission (implication = Inferred)
    const pcd = ps?.statusModule?.primaryCompletionDateStruct?.date;
    if (pcd && isActive) {
      const dt = new Date(pcd).getTime() - now.getTime();
      if (dt > 0 && dt < horizon) {
        triggers.push(mk("upcoming submission", `Trial nearing primary completion: ${nct}`, "trigger", "Inferred", [cite], pcd));
      }
    }
  }

  for (const ta of tas) out.push(mk(ta, ta, "therapeutic-area", "Likely", [search]));
  for (const mo of modalities) out.push(mk(mo, mo, "derived", "Likely", [search]));

  if (maxPhase >= 4) out.push(mk("late-stage program", `Late-stage clinical program (Phase ${maxPhase === 5 ? 4 : 3})`, "trigger", "Likely", [search]));
  if (maxPhase > 0) {
    const phaseLabel = maxPhase >= 4 ? "phase 3" : maxPhase === 3 ? "phase 2" : "phase 1";
    out.push(mk(`${phaseLabel} program`, `${phaseLabel.toUpperCase()} pipeline`, "pipeline", "Likely", [search]));
  }
  if (activeCount > 0) out.push(mk("active clinical pipeline", `${activeCount} active clinical trial(s)`, "pipeline", "Likely", [search]));
  if (activeCount >= 10) out.push(mk("large clinical pipeline", "Large active clinical pipeline", "pipeline", "Likely", [search]));
  if (countries.size >= 2) {
    out.push(mk("multi-region trials", `Trials across ${countries.size} countries`, "footprint", "Likely", [search]));
    out.push(mk("global", "Global clinical footprint", "footprint", "Likely", [search]));
  }

  // De-dupe triggers by key (keep first/most-recent), cap exemplars.
  const seen = new Set<string>();
  for (const t of triggers) {
    if (seen.has(t.key)) continue;
    seen.add(t.key);
    out.push(t);
  }

  return out.slice(0, 18);
}
