# Freyr Sales Intelligence Platform — Phase 1 (MVP)

An AI-powered **sales intelligence and account-planning** web app for life-sciences
regulatory services. Search a company, get an opportunity verdict ("Why should
Freyr care?"), service fit, persona-ready talking points, ready-to-send outreach,
and an account strategy — **with every claim rated for confidence**.

Phase 1 runs entirely on **mock data** for five companies (Pfizer, Moderna,
Amgen, Medtronic, Gilead) and ships as a **static site** you can host anywhere.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# open http://localhost:3000

# 3. Build a static site (outputs to ./out)
npm run build
```

`npm run build` produces a fully static export in `out/` — plain HTML/CSS/JS with
no backend required.

---

## Deploying

**Vercel** — import the repo; zero config. Builds and serves automatically.

**GitHub Pages**
1. Push this project to a GitHub repo.
2. If you deploy to a **project page** (`https://<user>.github.io/<repo>`), open
   `next.config.mjs` and set `basePath` to `"/<repo>"` (a commented line is ready
   for you). For a **user/org page** or a custom domain, leave it off.
3. Run `npm run build`, then publish the `out/` folder (e.g. via the
   `actions/deploy-pages` workflow or by pushing `out/` to a `gh-pages` branch).

**Any static host** (S3, Netlify, Cloudflare Pages, nginx) — serve the `out/`
folder.

---

## What's in the app

| Page | Route | What it does |
|------|-------|--------------|
| Universal search | `/` | Search by company name or website; jump into a profile |
| Company dashboard | `/company/[id]` | The 12-section intelligence dossier, tabbed |
| Saved accounts | `/accounts` | Accounts you're tracking (owner, priority, status) |
| Account detail | `/accounts/[id]` | Edit owner, priority, MSA, tags, notes |
| Settings | `/settings` | Read-only Phase 1 configuration overview |

The company dashboard is organised into tabs — **Overview, Opportunities,
Portfolio & field, Personas & talking points, Outreach, Strategy, Sources** —
covering all twelve sections from the brief: company snapshot, the "Why should
Freyr care?" verdict, opportunity-score breakdown, recommended services, pain
points, products & therapeutic areas, business triggers, competitive landscape,
the **persona selector** (8 personas), the **outreach generator** (6 message
types with copy buttons), account strategy, and the source & confidence center.

### Confidence first
Nothing is presented as fact without a rating: **Verified · Likely · Inferred ·
Unknown**. The rating is part of the data model (`Sourced<T>`), so it can never be
quietly dropped. Phase 1 data is mostly *Inferred*/*Likely* because sources are
placeholders.

---

## Architecture

```
src/
  app/                     Next.js App Router pages
    layout.tsx             Fonts, global styles, providers, nav
    page.tsx               Home / universal search
    company/[id]/page.tsx  Company dashboard (generateStaticParams)
    accounts/              Saved-accounts list + detail
    settings/              Settings
    globals.css            Design system (tokens + reusable classes)
  components/
    layout/                Top navigation
    search/                Universal search experience
    dashboard/             The 12 dashboard sections + tabbed orchestrator
    accounts/              Saved-accounts list & editor
    ui/                    Primitives (Score dial, confidence/level badges,
                           tabs, copy button, save/export, section wrapper)
  lib/
    types.ts               ALL data models (the contract for everything)
    mock/                  Mock data: services, personas, 5 company profiles
    api/                   companyService + searchService — the swappable seam
    generators/            talkingPoints + outreach (deterministic stand-ins
                           for the future AI/LLM calls)
    store/                 Saved-accounts persistence (localStorage) + React hook
    utils/                 confidence + formatting helpers
```

### Designed to swap in live data
The UI never imports mock files directly — it goes through `companyService` and
`searchService` (in `src/lib/api`). To go live later, implement those interfaces
against real APIs and swap the exported instance. **No UI changes required.**

Persona talking points and outreach are produced by **generators**
(`src/lib/generators`). In Phase 1 they're deterministic templates; their function
signatures are the exact seam where a real LLM call slots in later.

### Saved accounts
Persisted to `localStorage` (key `freyr.savedAccounts.v1`) so they survive
refreshes with no backend. `src/lib/store/savedAccounts.ts` isolates persistence,
so it too can be swapped for an API later.

---

## How Phase 1 extends into later phases

- **Phase 2 — Account management:** the `SavedAccount` model and store already
  hold owner, priority, relationship status, MSA/preferred-vendor, tags, and
  notes. Swap `localStorage` for an API.
- **Phase 3 — Market intelligence:** `SearchFieldKind` already declares future
  search dimensions (LinkedIn, ticker, product, therapeutic area, competitor…),
  shown as "coming soon" in the UI. Extend `searchService`.
- **Phase 4 — AI recommendation engine:** replace the deterministic
  `generators/` with live model calls behind the same signatures.
- **Phase 5 — Executive account planning:** the strategy + 30/60/90 model and
  export buttons (PDF/PPT/Word/CRM, currently "coming soon") are the hooks.
- **Phase 6 — Agentic discovery:** the `companyService`/`searchService` seam is
  where autonomous data-gathering would feed the same types.

---

## Notes & limitations (Phase 1)

- All data is **mock** and for demonstration only.
- There is **no role-based access** by design — every user sees all features.
- Export buttons (PDF / PPT / Word / CRM) are intentional **"coming soon"**
  placeholders.
- Pinned to Next.js 14.2.35. Track Next.js security releases and upgrade as part
  of normal maintenance; for a static export with no server runtime the exposure
  is limited.

---

## Tech

Next.js 14 (App Router) · React 18 · TypeScript · static export · plain-CSS design
system. No CSS framework, no backend.
