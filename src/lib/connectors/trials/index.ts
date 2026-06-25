import "server-only";
import type { ConnectorOutput, EnrichInput, LiveConnector } from "@/lib/connectors/types";
import { emptyOutput } from "@/lib/connectors/types";
import { getCached, setCached } from "@/lib/cache/sourceCache";
import type { SourceCitation } from "@/lib/types";
import { signalsFromStudies, type Study } from "./parse";

const API = "https://clinicaltrials.gov/api/v2/studies";
const UA = "FreyrPulseBot/1.0 (+internal sales-intelligence research)";

const FIELDS = [
  "protocolSection.identificationModule",
  "protocolSection.statusModule",
  "protocolSection.sponsorCollaboratorsModule",
  "protocolSection.conditionsModule",
  "protocolSection.designModule",
  "protocolSection.armsInterventionsModule",
  "protocolSection.contactsLocationsModule",
].join(",");

async function fetchStudies(name: string): Promise<Study[] | null> {
  try {
    const url = `${API}?query.spons=${encodeURIComponent(name)}&fields=${encodeURIComponent(FIELDS)}&sort=LastUpdatePostDate:desc&pageSize=50`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = (await res.json()) as { studies?: Study[] };
    return json.studies ?? [];
  } catch {
    return null;
  }
}

export const trialsConnector: LiveConnector = {
  id: "clinicaltrials",
  label: "ClinicalTrials.gov",
  appliesTo() {
    return true; // name-based; non-sponsors return empty gracefully
  },
  async enrich(input, opts): Promise<ConnectorOutput> {
    const cacheKey = `trials:${input.id}`;
    let studies = opts.bypassCache ? null : await getCached<Study[]>("clinicaltrials", cacheKey);
    if (!studies) {
      studies = await fetchStudies(input.name);
      if (studies) await setCached("clinicaltrials", cacheKey, studies);
    }
    if (!studies) return emptyOutput("ClinicalTrials.gov request failed.");

    const signals = signalsFromStudies(studies, { name: input.name, aliases: input.aliases });
    if (!signals.length) return emptyOutput("No registered trials matched this sponsor (private/pre-clinical, or name mismatch).");

    const citations: SourceCitation[] = signals.flatMap((s) => s.citations ?? []);
    return { signals, citations, notes: [`Matched ${signals.length} pipeline signal(s) from ClinicalTrials.gov.`] };
  },
};
