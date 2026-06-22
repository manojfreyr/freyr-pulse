"use client";

import { useState } from "react";
import Link from "next/link";
import type { Company, PersonaId } from "@/lib/types";
import { Tabs } from "@/components/ui/Tabs";
import { SaveButton, ExportButtons } from "@/components/ui/Actions";
import { WhyCareCard } from "@/components/dashboard/WhyCareCard";
import { CompanySnapshot, OpportunityBreakdown } from "@/components/dashboard/Snapshot";
import { ServicesGrid, PainPoints } from "@/components/dashboard/Services";
import { ProductsTA, TriggersTimeline, CompetitiveLandscape } from "@/components/dashboard/Portfolio";
import { AccountStrategyView, SourcesCenter } from "@/components/dashboard/StrategySources";
import { PersonasPanel, OutreachPanel } from "@/components/dashboard/PersonaWork";

export function CompanyDashboard({ company }: { company: Company }) {
  // Persona state is shared so the selector stays in sync across the
  // Personas and Outreach tabs.
  const [persona, setPersona] = useState<PersonaId>("vp-regulatory-affairs");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="stack" style={{ gap: 20 }}>
          <WhyCareCard company={company} />
          <CompanySnapshot company={company} />
          <TriggersTimeline company={company} />
        </div>
      ),
    },
    {
      id: "opportunities",
      label: "Opportunities",
      content: (
        <div className="stack" style={{ gap: 20 }}>
          <OpportunityBreakdown company={company} />
          <ServicesGrid company={company} />
          <PainPoints company={company} />
        </div>
      ),
    },
    {
      id: "portfolio",
      label: "Portfolio & field",
      content: (
        <div className="stack" style={{ gap: 20 }}>
          <ProductsTA company={company} />
          <CompetitiveLandscape company={company} />
        </div>
      ),
    },
    {
      id: "personas",
      label: "Personas & talking points",
      content: <PersonasPanel company={company} personaId={persona} onPersonaChange={setPersona} />,
    },
    {
      id: "outreach",
      label: "Outreach",
      content: <OutreachPanel company={company} personaId={persona} onPersonaChange={setPersona} />,
    },
    {
      id: "strategy",
      label: "Strategy",
      content: <AccountStrategyView company={company} />,
    },
    {
      id: "sources",
      label: "Sources",
      content: <SourcesCenter company={company} />,
    },
  ];

  return (
    <div>
      <CompanyHeader company={company} />
      <Tabs tabs={tabs} />
    </div>
  );
}

function CompanyHeader({ company }: { company: Company }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Link href="/" className="small muted" style={{ display: "inline-block", marginBottom: 14 }}>← New search</Link>
      <div className="spread" style={{ alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
        <div className="row" style={{ gap: 16 }}>
          <span
            aria-hidden
            style={{
              width: 54, height: 54, borderRadius: 12, background: "var(--ink)", color: "var(--paper)",
              display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, flex: "0 0 auto",
            }}
          >
            {company.logoMonogram}
          </span>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>{company.name}</h1>
            <div className="row-wrap small muted" style={{ gap: 12 }}>
              <a href={company.website} target="_blank" rel="noreferrer">{company.website.replace(/^https?:\/\//, "")}</a>
              <span>· {company.snapshot.industrySegment}</span>
              {company.snapshot.stockTicker && <span>· {company.snapshot.stockTicker}</span>}
            </div>
          </div>
        </div>
        <div className="row-wrap" style={{ gap: 10, justifyContent: "flex-end" }}>
          <SaveButton company={company} />
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <ExportButtons />
      </div>
    </div>
  );
}
