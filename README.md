# Freyr Pulse — Sales Intelligence (Phase 1 / MVP)

An enterprise **sales-intelligence and account-planning** web app for life-sciences
regulatory services. Search any company, get an opportunity verdict ("Why should
Freyr care?"), **catalog-driven service fit**, persona-ready talking points,
ready-to-send outreach, and an account strategy — **with every claim rated for
confidence**.

Phase 1 ships **five fully-researched demo companies** (Pfizer, Moderna, Amgen,
Medtronic, Gilead) on **mock data**, but the search and data architecture are
built for **universal company discovery** — any pharma, biotech, medtech,
diagnostics, CRO, CDMO, or digital-health company. It deploys as a **static site**.

> **Demo intelligence — mock data. Live source integration planned for Phase 2.**

---

## Quick start

```bash
npm install        # 1. install dependencies
npm run dev        # 2. dev server → http://localhost:3000
npm run build      # 3. static export → ./out (plain HTML/CSS/JS, no backend)
```

---

## Deploying

**Vercel (recommended)** — import the repo, click Deploy. Zero config; leave
`next.config.mjs` as-is (do **not** set `basePath`).

**GitHub Pages** — for a project page (`https://<user>.github.io/<repo>`), set
`basePath` to `"/<repo>"` in `next.config.mjs` (a commented line is ready), then
build and publish `out/`. For a user/org page or custom domain, leave it off.

**Any static host** (S3, Netlify, Cloudflare Pages, nginx) — serve `out/`.

---

## What's in the app

| Page | Route | What it does |
|------|-------|--------------|
| Universal search | `/` | Search any company by name or website; create placeholder profiles for unknown companies |
| Company dashboard | `/company/?c=<id>` | The tabbed intelligence dossier (works for demo **and** user-created companies) |
| **Service Catalog** | `/services` | **Full CRUD** for Freyr services (the source of truth for recommendations) |
| Saved accounts | `/accounts` | Accounts you're tracking (owner, priority, status) |
| Account detail | `/accounts/?c=<id>` | Edit owner, priority, MSA, tags, notes |
| Settings | `/settings` | Configuration overview + Phase 2 connector inventory |

The company dashboard is organised into tabs — **Overview, Opportunities,
Portfolio & field, Personas & talking points, Outreach, Strategy, Sources** —
covering company snapshot, the bold **"Why should Freyr care?"** verdict + score,
the opportunity-score breakdown, **catalog-driven recommended services**, pain
points, products & therapeutic areas, business triggers, competitive landscape,
the **persona selector** (8 personas), the **outreach generator** (6 message types
with copy buttons), account strategy, and the source & confidence center.

### Service Catalog (new)
`/services` manages the Freyr service offering: **view, add, edit, delete, and
activate/deactivate** services; categorise them; and set descriptions, target
personas, pain points solved, buying triggers, keywords/signals, related services,
relevant company signals, an example opening message, differentiation points, and
confidence-rule placeholders. Stored in `localStorage` (Phase 1) with a shape that
maps cleanly to a future database.

### Catalog-driven recommendations (new)
Company recommendations are **computed from the Service Catalog**, not hardcoded.
`matchServices()` scores each active service against a company's signals
(therapeutic areas, size, global footprint, regulatory complexity, business
triggers, pain points, keywords, product portfolio, markets) and returns ranked
matches with a likely buyer, a way in, and a confidence rating.

### Universal company discovery (new)
Search isn't limited to the five demo companies. Enter any name or website:
the app checks the saved database, loads a profile if found, and otherwise offers
to **create a placeholder profile** — a partial record with everything clearly
labelled *Unknown*/*Inferred*, savable for **future enrichment** and re-research in
Phase 2. Empty states make the Phase 1 vs. production distinction explicit.

### Confidence first
Nothing is presented as fact without a rating: **Verified · Likely · Inferred ·
Unknown**, baked into the data model (`Sourced<T>`).

---

## Architecture

```
src/
  app/                     Next.js App Router pages (static export)
    layout.tsx             Fonts, global styles, providers, nav
    page.tsx               Home / universal search
    company/page.tsx       Universal company viewer (reads ?c=<id>, client)
    services/page.tsx      Service Catalog CRUD
    accounts/page.tsx      Saved-accounts list / detail (by ?c=<id>)
    settings/page.tsx      Settings + connector inventory
    globals.css            Design system (navy/teal enterprise tokens + classes)
  components/
    layout/                Dark navy top navigation
    search/                Universal search + placeholder creation
    dashboard/             Dashboard sections + tabbed orchestrator (client)
    accounts/              Saved-accounts list & editor
    ui/                    Primitives (score dial, badges, tabs, demo notice…)
  lib/
    types.ts               ALL data models (the contract for everything)
    mock/                  Seed services (25), 8 personas, 5 company profiles
    api/                   companyService + searchService (swappable seam)
    generators/            talkingPoints, outreach, serviceMatch (matching engine)
    sources/connectors.ts  13 placeholder data-source connectors (Phase 2 seam)
    store/                 serviceCatalog + companyStore + savedAccounts (localStorage)
    utils/                 confidence + formatting helpers
```

### Designed to swap in live data
- **Connectors** (`src/lib/sources/connectors.ts`) define clean interfaces for 13
  sources — Company website, SEC, FDA, EMA, ClinicalTrials.gov, News, LinkedIn,
  ZoomInfo, Crunchbase, PitchBook, Internal CRM, Contract/MSA DB, Freyr project
  history. Phase 1 makes **no live calls**; Phase 2 implements `fetchCompanyData`.
- The UI reads through `companyService`/`searchService`, so live APIs swap in with
  no UI changes.
- Persona talking points and outreach come from **generators** whose signatures
  are the exact seam where a real LLM call slots in later.

### Persistence (localStorage)
- Service Catalog — `freyrpulse.serviceCatalog.v1`
- User-created companies — `freyrpulse.userCompanies.v1`
- Saved accounts — `freyr.savedAccounts.v1`

Each store isolates persistence so it can be swapped for an API later.

---

## Notes & limitations (Phase 1)

- All data is **mock** and for demonstration only.
- The universal company viewer is **client-rendered** (reads `?c=` at runtime) so
  arbitrary, user-created companies work on a static host.
- Live research and live connectors are **not implemented** (Phase 2).
- Export buttons (PDF / PPT / Word / CRM) are intentional **"coming soon"**
  placeholders.
- Pinned to Next.js 14.2.35; track security releases as normal maintenance.

---

## Tech

Next.js 14 (App Router) · React 18 · TypeScript · static export · plain-CSS design
system. No CSS framework, no backend.
