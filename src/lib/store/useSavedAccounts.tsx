"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Company, SavedAccount } from "@/lib/types";
import { isSaved as isSavedIn, newAccountFromCompany } from "@/lib/accounts/helpers";
import * as api from "@/lib/client/api";

/**
 * Saved-accounts state, now backed by the server API (Supabase or in-memory
 * fallback) instead of localStorage. The context interface is unchanged, so
 * consumers (TopNav, AccountsList, AccountDetail, SaveButton) need no changes.
 * Mutations are optimistic and reconcile from the server on error.
 */
interface SavedAccountsContextValue {
  accounts: SavedAccount[];
  hydrated: boolean;
  isSaved: (companyId: string) => boolean;
  save: (company: Company) => void;
  unsave: (companyId: string) => void;
  toggle: (company: Company) => void;
  update: (companyId: string, patch: Partial<SavedAccount>) => void;
}

const SavedAccountsContext = createContext<SavedAccountsContextValue | null>(null);

export function SavedAccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const reload = useCallback(async () => {
    try {
      setAccounts(await api.listAccounts());
    } catch {
      /* leave current state on failure */
    }
  }, []);

  useEffect(() => {
    (async () => {
      await reload();
      setHydrated(true);
    })();
  }, [reload]);

  const save = useCallback((company: Company) => {
    setAccounts((prev) => (isSavedIn(prev, company.id) ? prev : [...prev, newAccountFromCompany(company)]));
    api.saveAccount(newAccountFromCompany(company)).then(reload).catch(reload);
  }, [reload]);

  const unsave = useCallback((companyId: string) => {
    setAccounts((prev) => prev.filter((a) => a.companyId !== companyId));
    api.removeAccount(companyId).catch(reload);
  }, [reload]);

  const toggle = useCallback((company: Company) => {
    setAccounts((prev) => {
      if (isSavedIn(prev, company.id)) {
        api.removeAccount(company.id).catch(reload);
        return prev.filter((a) => a.companyId !== company.id);
      }
      api.saveAccount(newAccountFromCompany(company)).then(reload).catch(reload);
      return [...prev, newAccountFromCompany(company)];
    });
  }, [reload]);

  const update = useCallback((companyId: string, patch: Partial<SavedAccount>) => {
    setAccounts((prev) => prev.map((a) => (a.companyId === companyId ? { ...a, ...patch } : a)));
    api.updateAccount(companyId, patch).catch(reload);
  }, [reload]);

  const value: SavedAccountsContextValue = {
    accounts,
    hydrated,
    isSaved: (id) => isSavedIn(accounts, id),
    save,
    unsave,
    toggle,
    update,
  };

  return <SavedAccountsContext.Provider value={value}>{children}</SavedAccountsContext.Provider>;
}

export function useSavedAccounts(): SavedAccountsContextValue {
  const ctx = useContext(SavedAccountsContext);
  if (!ctx) throw new Error("useSavedAccounts must be used within SavedAccountsProvider");
  return ctx;
}
