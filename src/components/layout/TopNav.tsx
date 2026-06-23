"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSavedAccounts } from "@/lib/store/useSavedAccounts";

const NAV = [
  { href: "/", label: "Search" },
  { href: "/services/", label: "Service Catalog" },
  { href: "/accounts/", label: "Saved accounts" },
  { href: "/settings/", label: "Settings" },
];

export function TopNav() {
  const pathname = usePathname() || "/";
  const { accounts, hydrated } = useSavedAccounts();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.replace(/\/$/, ""));
  }

  return (
    <header
      style={{
        background: "linear-gradient(180deg, var(--navy), var(--navy-2))",
        borderBottom: "1px solid var(--navy-line)",
        position: "sticky", top: 0, zIndex: 20,
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <Link href="/" className="brand" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <span
            aria-hidden
            style={{
              width: 32, height: 32, borderRadius: 9, background: "var(--accent)", color: "#fff",
              display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16,
              fontFamily: "var(--font-display)", boxShadow: "0 2px 8px rgba(13,148,136,.4)",
            }}
          >
            F
          </span>
          <span className="nav-brand-text" style={{ display: "flex", flexDirection: "column", lineHeight: 1.12 }}>
            <span className="strong" style={{ color: "var(--ink-on-dark)", fontSize: 15.5, letterSpacing: "-0.01em" }}>Freyr Pulse</span>
            <span className="eyebrow" style={{ fontSize: 9.5, color: "var(--muted-on-dark)" }}>Sales Intelligence · Phase 1</span>
          </span>
        </Link>

        <nav className="row" style={{ gap: 2 }}>
          {NAV.map((n) => {
            const active = isActive(n.href);
            const showCount = n.href === "/accounts/" && hydrated && accounts.length > 0;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="btn btn-ghost btn-sm"
                style={{
                  color: active ? "var(--ink-on-dark)" : "var(--muted-on-dark)",
                  background: active ? "rgba(255,255,255,0.10)" : "transparent",
                  fontWeight: active ? 600 : 500,
                  borderBottom: active ? "2px solid var(--accent-bright)" : "2px solid transparent",
                  borderRadius: 8,
                }}
              >
                {n.label}
                {showCount && (
                  <span
                    className="chip"
                    style={{ marginLeft: 7, padding: "0 7px", background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }}
                  >
                    {accounts.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
