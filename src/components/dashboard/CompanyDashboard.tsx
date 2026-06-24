"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Company, FreyrService, PersonaId } from "@/lib/types";
import { Tabs } from "@/components/ui/Tabs";
import { SaveButton, ExportButtons } from "@/components/ui/Actions";
import { DemoDataNotice } from "@/components/ui/DemoDataNotice";
import { WhyCareCard } from "@/components/dashboard/WhyCareCard";
import { CompanySnapshot, OpportunityBreakdown } from "@/components/dashboard/Snapshot";
import { ServicesGrid, PainPoints } from "@/components/dashboard/Services";
import { ProductsTA, TriggersTimeline, CompetitiveLandscape } from "@/components/dashboard/Portfolio";
import { AccountStrategyView, SourcesCenter, CompanySignalsPanel } from "@/components/dashboard/StrategySources";
import { PersonasPanel, OutreachPanel } from "@/components/dashboard/PersonaWork";
import { ResearchPanel } from "@/components/dashboard/ResearchPanel";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { matchServices } from "@/lib/generators/serviceMatch";
import * as api from "@/lib/client/api";

export function CompanyDashboard({ company: initialCompany }: { company: Company }) {
  const [company, setCompany] = useState<Company>(initialCompany);
  const [persona, setPersona] = useState<PersonaId>("vp-regulatory-affairs");

  // Live Service Catalog (shared, via API). Recommendations are computed from it.
  const [catalog, setCatalog] = useState<FreyrService[]>([]);
  useEffect(() => {
    api.getCatalog().then(setCatalog).catch(() => setCatalog([]));
  }, []);

  const serviceById = useMemo(
    () => Object.fromEntries(catalog.map((s) => [s.id, s])) as Record<string, FreyrService>,
    [catalog],
  );
  const recommendations = useMemo(
    () => matchServices(company, catalog.filter((s) => s.activeStatus)),
    [company, catalog],
  );

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="stack" style={{ gap: 20 }}>
          <WhyCareCard company={company} recommendations={recommendations} />
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
          <ServicesGrid recommendations={recommendations} />
          <PainPoints company={company} serviceById={serviceById} />
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
      content: <PersonasPanel company={company} personaId={persona} onPersonaChange={setPersona} matched={recommendations} />,
    },
    {
      id: "outreach",
      label: "Outreach",
      content: <OutreachPanel company={company} personaId={persona} onPersonaChange={setPersona} matched={recommendations} />,
    },
    {
      id: "strategy",
      label: "Strategy",
      content: <AccountStrategyView company={company} />,
    },
    {
      id: "sources",
      label: "Sources",
      content: (
        <div className="stack" style={{ gap: 20 }}>
          <CompanySignalsPanel company={company} />
          <SourcesCenter company={company} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <CompanyHeader company={company} />
      {company.isPlaceholder && <PlaceholderBanner company={company} />}
      <ResearchPanel company={company} onResearched={setCompany} />
      <ExportMenu company={company} primaryPersona={persona} />
      <Tabs tabs={tabs} />
    </div>
  );
}

function CompanyHeader({ company }: { company: Company }) {
  const cleanSite = company.website.replace(/^https?:\/\//, "");
  const hasSite = company.website && company.website !== "Unknown";
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="spread" style={{ marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
        <Link href="/" className="small muted" style={{ display: "inline-block" }}>← New search</Link>
        <DemoDataNotice />
      </div>
      <div className="spread" style={{ alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
        <div className="row" style={{ gap: 16 }}>
          <span
            aria-hidden
            style={{
              width: 56, height: 56, borderRadius: 13,
              background: "linear-gradient(150deg, var(--navy), var(--navy-2))", color: "var(--ink-on-dark)",
              display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, flex: "0 0 auto",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {company.logoMonogram}
          </span>
          <div>
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 25, marginBottom: 0 }}>{company.name}</h1>
              {company.isPlaceholder && <span className="chip" style={{ background: "var(--surface-2)" }}>Placeholder profile</span>}
            </div>
            <div className="row-wrap small muted" style={{ gap: 12, marginTop: 4 }}>
              {hasSite ? (
                <a href={company.website} target="_blank" rel="noreferrer">{cleanSite}</a>
              ) : (
                <span>Website: Unknown</span>
              )}
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

function PlaceholderBanner({ company }: { company: Company }) {
  // A user-origin company is already persisted (created via the discovery flow).
  const [saved, setSaved] = useState(company.origin === "user");

  return (
    <div
      className="card fade-in"
      style={{ boxShadow: "none", borderColor: "var(--accent-line)", background: "var(--accent-soft)", marginBottom: 20 }}
    >
      <div className="spread" style={{ gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <div className="strong" style={{ marginBottom: 4 }}>Partial profile</div>
          <p className="small soft" style={{ margin: 0, maxWidth: 640 }}>
            This company isn&rsquo;t in the demo data, so we created a placeholder. Fields are marked
            <span className="mono"> Unknown</span> until live research runs. The data-source connectors
            will enrich and re-score this profile automatically in a later phase.
          </p>
        </div>
        <div className="row-wrap" style={{ gap: 10 }}>
          {saved ? (
            <span className="chip chip-accent">Saved for enrichment ✓</span>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                api.createCompany(company).then(() => setSaved(true)).catch(() => {});
              }}
            >
              Save company for future enrichment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
