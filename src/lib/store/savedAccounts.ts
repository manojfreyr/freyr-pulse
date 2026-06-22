import type { Company, SavedAccount } from "@/lib/types";
import { nowIso } from "@/lib/utils/format";

/**
 * Persistence for saved accounts. Phase 1 uses localStorage so saved accounts
 * survive refreshes with no backend. (This is a real downloadable app, not a
 * sandboxed artifact, so localStorage is the right Phase 1 choice.) In later
 * phases this module is swapped for an API-backed implementation; callers use
 * the same functions.
 */
const KEY = "freyr.savedAccounts.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadSavedAccounts(): SavedAccount[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedAccount[]) : [];
  } catch {
    return [];
  }
}

function persist(accounts: SavedAccount[]): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(accounts));
  } catch {
    /* storage full or blocked — fail quietly in Phase 1 */
  }
}

export function isSaved(accounts: SavedAccount[], companyId: string): boolean {
  return accounts.some((a) => a.companyId === companyId);
}

/** Build a default SavedAccount from a Company. */
export function newAccountFromCompany(company: Company): SavedAccount {
  return {
    companyId: company.id,
    companyName: company.name,
    accountOwner: "Unassigned",
    priority: company.opportunity.level === "High" ? "High" : company.opportunity.level === "Medium" ? "Medium" : "Low",
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

export function addAccount(accounts: SavedAccount[], company: Company): SavedAccount[] {
  if (isSaved(accounts, company.id)) return accounts;
  const next = [...accounts, newAccountFromCompany(company)];
  persist(next);
  return next;
}

export function removeAccount(accounts: SavedAccount[], companyId: string): SavedAccount[] {
  const next = accounts.filter((a) => a.companyId !== companyId);
  persist(next);
  return next;
}

export function updateAccount(
  accounts: SavedAccount[],
  companyId: string,
  patch: Partial<SavedAccount>,
): SavedAccount[] {
  const next = accounts.map((a) => (a.companyId === companyId ? { ...a, ...patch } : a));
  persist(next);
  return next;
}
