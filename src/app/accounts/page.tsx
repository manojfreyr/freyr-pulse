"use client";

import { useEffect, useState } from "react";
import { AccountsList } from "@/components/accounts/AccountsList";
import { AccountDetail } from "@/components/accounts/AccountDetail";

export default function AccountsPage() {
  const [companyId, setCompanyId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCompanyId(params.get("c"));
    // Keep in sync if the user navigates back/forward.
    const onPop = () => {
      const p = new URLSearchParams(window.location.search);
      setCompanyId(p.get("c"));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (companyId === undefined) {
    return <div className="card"><p className="muted" style={{ margin: 0 }}>Loading…</p></div>;
  }

  if (companyId) {
    return <AccountDetail companyId={companyId} />;
  }

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <span className="eyebrow">Pipeline</span>
        <h1 className="display" style={{ fontSize: 28, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Saved accounts</h1>
        <p className="soft" style={{ margin: 0 }}>Accounts you&rsquo;re tracking, with owner, priority, relationship status, and notes. Shared across your team.</p>
      </section>
      <AccountsList />
    </div>
  );
}
