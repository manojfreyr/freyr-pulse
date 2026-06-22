"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSavedAccounts } from "@/lib/store/useSavedAccounts";

const NAV = [
  { href: "/", label: "Search" },
  { href: "/accounts/", label: "Saved accounts" },
  { href: "/settings/", label: "Settings" },
];

export function TopNav() {
  const pathname = usePathname() || "/";
  const { accounts, hydrated } = useSavedAccounts();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/" ;
    return pathname.startsWith(href.replace(/\/$/, ""));
  }

  return (
    <header style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 20 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
        <Link href="/" className="brand" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 11 }}>
          <span
            aria-hidden
            style={{
              width: 30, height: 30, borderRadius: 8, background: "var(--accent)", color: "#fff",
              display: "grid", placeItems: "center", fontWeight: 700, fontSize: 15,
              fontFamily: "var(--font-display)",
            }}
          >
            F
          </span>
          <span className="nav-brand-text" style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span className="strong" style={{ color: "var(--ink)", fontSize: 15 }}>Freyr Sales Intelligence</span>
            <span className="eyebrow" style={{ fontSize: 9.5 }}>Account Intelligence · Phase 1</span>
          </span>
        </Link>

        <nav className="row" style={{ gap: 4 }}>
          {NAV.map((n) => {
            const active = isActive(n.href);
            const showCount = n.href === "/accounts/" && hydrated && accounts.length > 0;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="btn btn-ghost btn-sm"
                style={{
                  color: active ? "var(--ink)" : "var(--muted)",
                  background: active ? "var(--surface-2)" : "transparent",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {n.label}
                {showCount && <span className="chip chip-accent" style={{ marginLeft: 7, padding: "0 7px" }}>{accounts.length}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
