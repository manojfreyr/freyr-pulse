import type { Company, SavedAccount } from "@/lib/types";
import { nowIso } from "@/lib/utils/format";

/** Pure helpers for saved accounts — no persistence (handled by the data layer/API). */

export function isSaved(accounts: SavedAccount[], companyId: string): boolean {
  return accounts.some((a) => a.companyId === companyId);
}

/** Build a default SavedAccount from a Company. */
export function newAccountFromCompany(company: Company): SavedAccount {
  return {
    companyId: company.id,
    companyName: company.name,
    accountOwner: "Unassigned",
    priority:
      company.opportunity.level === "High" ? "High" : company.opportunity.level === "Medium" ? "Medium" : "Low",
    opportunityScore: company.opportunity.score,
    relationshipStatus: "Prospect",
    notes: [],
    lastRefreshed: nowIso(),
    tags: company.snapshot.therapeuticFocus.slice(0, 2),
    msaStatus: "Unknown",
    preferredVendor: false,
    currentFreyrServices: [],
    satisfaction: "Unknown",
    lastInteraction: "—",
    nextAction: company.opportunity.nextBestAction,
  };
}
