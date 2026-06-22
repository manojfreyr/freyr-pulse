"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";
import { getCompanyById, createPlaceholderCompany, saveUserCompany } from "@/lib/store/companyStore";
import { CompanyDashboard } from "@/components/dashboard/CompanyDashboard";

type ViewState =
  | { status: "loading" }
  | { status: "found"; company: Company }
  | { status: "missing"; id: string };

export default function CompanyPage() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = (params.get("c") || "").trim();
    if (!id) {
      setState({ status: "missing", id: "" });
      return;
    }
    const company = getCompanyById(id);
    setState(company ? { status: "found", company } : { status: "missing", id });
  }, []);

  if (state.status === "loading") {
    return <div className="card"><p className="muted" style={{ margin: 0 }}>Loading company profile…</p></div>;
  }

  if (state.status === "missing") {
    return <NotFoundState id={state.id} />;
  }

  return <CompanyDashboard company={state.company} />;
}

function NotFoundState({ id }: { id: string }) {
  const [creating, setCreating] = useState(false);

  function createPlaceholder() {
    if (!id) return;
    setCreating(true);
    const company = createPlaceholderCompany(id.replace(/-/g, " "));
    saveUserCompany(company);
    // Navigate to the freshly created profile.
    window.location.href = `/company/?c=${encodeURIComponent(company.id)}`;
  }

  return (
    <div>
      <Link href="/" className="small muted" style={{ display: "inline-block", marginBottom: 16 }}>← New search</Link>
      <div className="card card-pad-lg" style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Company not found in demo data</div>
        <h1 className="display" style={{ fontSize: 24, letterSpacing: "-0.02em", margin: "0 auto 10px", maxWidth: 520 }}>
          We don&rsquo;t have a demo profile for this company yet.
        </h1>
        <p className="soft" style={{ maxWidth: 520, margin: "0 auto 8px" }}>
          Live company research will be available in Phase 2. For now you can create a placeholder profile and save it
          for future enrichment.
        </p>
        <p className="tiny muted" style={{ margin: "0 auto 20px", maxWidth: 520 }}>
          Phase 1 ships with five fully-researched demo companies; the production design supports any life-sciences
          company of any size.
        </p>
        <div className="row" style={{ gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {id && (
            <button className="btn btn-primary" onClick={createPlaceholder} disabled={creating}>
              {creating ? "Creating…" : "Create placeholder profile"}
            </button>
          )}
          <Link href="/" className="btn">Back to search</Link>
        </div>
      </div>
    </div>
  );
}
