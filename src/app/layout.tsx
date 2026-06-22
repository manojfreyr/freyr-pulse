import type { Metadata } from "next";
import "./globals.css";
import { SavedAccountsProvider } from "@/lib/store/useSavedAccounts";
import { TopNav } from "@/components/layout/TopNav";

export const metadata: Metadata = {
  title: "Freyr Sales Intelligence Platform",
  description: "AI-powered sales intelligence and account planning for life-sciences regulatory services.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are loaded at runtime in the browser (not at build time) so the
            project builds in any environment. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* In the App Router this shared layout wraps every page, so the font
            loads globally. The lint rule targets the old Pages Router's
            _document.js and is a false positive here. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SavedAccountsProvider>
          <TopNav />
          <main className="container" style={{ padding: "32px 24px 80px" }}>
            {children}
          </main>
          <footer style={{ borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
            <div className="container" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <span className="tiny muted">Freyr Sales Intelligence · Phase 1 (MVP). All data is mock and for demonstration only.</span>
              <span className="tiny muted">Every claim carries a confidence rating — validate before acting.</span>
            </div>
          </footer>
        </SavedAccountsProvider>
      </body>
    </html>
  );
}
