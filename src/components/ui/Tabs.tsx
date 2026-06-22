"use client";

import { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({ tabs, initialId }: { tabs: TabItem[]; initialId?: string }) {
  const [active, setActive] = useState(initialId ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Dashboard sections"
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--line)",
          marginBottom: 22,
        }}
      >
        {tabs.map((t) => {
          const selected = t.id === activeTab.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              className="btn btn-ghost btn-sm"
              onClick={() => setActive(t.id)}
              style={{
                borderRadius: 0,
                borderBottom: selected ? "2px solid var(--accent)" : "2px solid transparent",
                color: selected ? "var(--ink)" : "var(--muted)",
                fontWeight: selected ? 600 : 500,
                padding: "10px 14px",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="fade-in" key={activeTab.id}>
        {activeTab.content}
      </div>
    </div>
  );
}
