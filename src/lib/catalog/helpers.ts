import type { FreyrService } from "@/lib/types";
import { nowIso } from "@/lib/utils/format";

/** A blank service for the "Add service" form. Pure — no persistence. */
export function emptyService(id: string): FreyrService {
  return {
    id,
    serviceName: "",
    serviceCategory: "Regulatory Affairs",
    serviceLine: "Regulatory",
    description: "",
    targetPersonas: [],
    painPointsSolved: [],
    buyingTriggers: [],
    keywords: [],
    relatedServices: [],
    relevantCompanySignals: [],
    exampleOpeningMessage: "",
    differentiationPoints: [],
    confidenceRules: [],
    activeStatus: true,
    lastUpdated: nowIso(),
  };
}
