"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Company, SavedAccount } from "@/lib/types";
import {
  addAccount,
  isSaved,
  loadSavedAccounts,
  removeAccount,
  updateAccount,
} from "./savedAccounts";

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

  // Load once on mount (client only).
  useEffect(() => {
    setAccounts(loadSavedAccounts());
    setHydrated(true);
  }, []);

  const save = useCallback((company: Company) => {
    setAccounts((prev) => addAccount(prev, company));
  }, []);

  const unsave = useCallback((companyId: string) => {
    setAccounts((prev) => removeAccount(prev, companyId));
  }, []);

  const toggle = useCallback((company: Company) => {
    setAccounts((prev) => (isSaved(prev, company.id) ? removeAccount(prev, company.id) : addAccount(prev, company)));
  }, []);

  const update = useCallback((companyId: string, patch: Partial<SavedAccount>) => {
    setAccounts((prev) => updateAccount(prev, companyId, patch));
  }, []);

  const value: SavedAccountsContextValue = {
    accounts,
    hydrated,
    isSaved: (id) => isSaved(accounts, id),
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
