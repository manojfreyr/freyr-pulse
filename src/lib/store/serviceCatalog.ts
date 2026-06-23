import type { FreyrService } from "@/lib/types";
import { FREYR_SERVICES } from "@/lib/mock/services";
import { nowIso } from "@/lib/utils/format";

/**
 * Editable Service Catalog persistence. Initialised from the seed catalogue
 * (src/lib/mock/services.ts) and stored in localStorage. The data shape matches
 * FreyrService exactly, so this module can be swapped for an API/DB later with
 * no change to callers.
 */
const KEY = "freyrpulse.serviceCatalog.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** Returns the live catalogue: stored if present, otherwise the seed. */
export function loadCatalog(): FreyrService[] {
  if (!canUseStorage()) return FREYR_SERVICES;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return FREYR_SERVICES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? (parsed as FreyrService[]) : FREYR_SERVICES;
  } catch {
    return FREYR_SERVICES;
  }
}

export function saveCatalog(list: FreyrService[]): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore in Phase 1 */
  }
}

export function resetCatalog(): FreyrService[] {
  if (canUseStorage()) {
    try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
  }
  return FREYR_SERVICES;
}

export function upsertService(list: FreyrService[], service: FreyrService): FreyrService[] {
  const stamped = { ...service, lastUpdated: nowIso() };
  const exists = list.some((s) => s.id === service.id);
  const next = exists ? list.map((s) => (s.id === service.id ? stamped : s)) : [...list, stamped];
  saveCatalog(next);
  return next;
}

export function deleteService(list: FreyrService[], id: string): FreyrService[] {
  const next = list.filter((s) => s.id !== id);
  saveCatalog(next);
  return next;
}

export function toggleActive(list: FreyrService[], id: string): FreyrService[] {
  const next = list.map((s) => (s.id === id ? { ...s, activeStatus: !s.activeStatus, lastUpdated: nowIso() } : s));
  saveCatalog(next);
  return next;
}

/** A blank service for the "Add service" form. */
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
