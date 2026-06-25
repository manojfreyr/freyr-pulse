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
          gap: 2,
          flexWrap: "nowrap",
          overflowX: "auto",
          borderBottom: "1px solid var(--line)",
          marginBottom: 24,
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((t) => {
          const selected = t.id === activeTab.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              style={{
                appearance: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                background: "transparent",
                border: "none",
                borderBottom: selected ? "2.5px solid var(--accent)" : "2.5px solid transparent",
                color: selected ? "var(--ink)" : "var(--muted)",
                fontWeight: selected ? 650 : 500,
                fontSize: 14,
                letterSpacing: "-0.005em",
                padding: "12px 15px",
                marginBottom: -1,
                transition: "color .15s ease",
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
