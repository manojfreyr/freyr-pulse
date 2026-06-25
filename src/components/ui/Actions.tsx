"use client";

import { useState } from "react";
import type { Company } from "@/lib/types";
import { useSavedAccounts } from "@/lib/store/useSavedAccounts";

export function SaveButton({ company }: { company: Company }) {
  const { isSaved, toggle, hydrated } = useSavedAccounts();
  const saved = hydrated && isSaved(company.id);

  return (
    <button
      type="button"
      className={saved ? "btn" : "btn btn-primary"}
      onClick={() => toggle(company)}
      disabled={!hydrated}
      aria-pressed={saved}
    >
      {saved ? "✓ Saved to accounts" : "Save account"}
    </button>
  );
}

const EXPORTS = [
  { id: "pdf", label: "Export PDF" },
  { id: "ppt", label: "Export PPT" },
  { id: "word", label: "Export Word" },
  { id: "crm", label: "Push to CRM" },
];

export function ExportButtons() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div>
      <div className="row-wrap">
        {EXPORTS.map((e) => (
          <button
            key={e.id}
            type="button"
            className="btn btn-sm"
            onClick={() => setNotice(`${e.label} is coming in a later phase.`)}
            title="Coming soon"
          >
            {e.label}
            <span className="chip chip-mono" style={{ marginLeft: 8, padding: "1px 6px" }}>soon</span>
          </button>
        ))}
      </div>
      {notice && (
        <p className="small muted" style={{ marginTop: 10 }} role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
