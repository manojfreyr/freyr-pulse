# Freyr Pulse — Sales Intelligence

An internal **sales-intelligence and account-planning** web app for life-sciences
regulatory services. Search any company, get an opportunity verdict ("Why should
Freyr care?"), **catalog-driven service fit**, the **signals** behind each
recommendation, persona talking points, ready-to-send outreach, and an account
strategy — **with every claim rated for confidence**.

> **Phase status:** Phase 1 (intelligence UI) complete. **Phase 2A.0a (backend
> foundation)** complete — the app now runs as a server application backed by a
> shared database, with live data connectors to follow.

> **Demo intelligence — mock data.** The five demo companies (Pfizer, Moderna,
> Amgen, Medtronic, Gilead) are seeded profiles. Live source integration
> (SEC / company website) is the next milestone.

---

## What changed in Phase 2A.0a

The app is no longer a static export. It is a **Next.js server app** with:

- **API routes** (`/api/*`) as the single way the UI reads/writes data.
- A **shared database** via **Supabase Postgres** — the Service Catalog,
  companies, and saved accounts are now **team-wide**, not per-browser.
- A **fallback mode**: if Supabase env vars are absent, the app runs on an
  in-memory, seed-backed store so it still works for local dev/demo (writes are
  ephemeral — see below).
- A **minimal access gate**: a shared passphrase (no user accounts / SSO yet).

There are **no live data connectors yet** — that's the next milestone. 2A.0a is
the stable foundation they plug into.

---

## Quick start (local, no database needed)

```bash
npm install
npm run dev        # http://localhost:3000  — runs in FALLBACK mode (in-memory)
```

In fallback mode the app is fully usable; catalog/company/account changes persist
only for the lifetime of the dev server process. To use a real shared database,
set the Supabase env vars below.

```bash
npm run build && npm run start   # production server build
```

---

## Configuration (environment variables)

Copy `.env.example` to `.env.local` and fill in what you need. **All are optional**
— with none set, the app runs in fallback mode with the gate disabled.

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL (Settings → API). Enables shared DB. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key (preferred). **Server-only — never exposed to the browser.** |
| `SUPABASE_ANON_KEY` | Optional, less-privileged alternative to the service-role key. |
| `APP_ACCESS_PASSPHRASE` | Shared passphrase that gates the whole app. Leave blank to disable the gate. |

The data mode is reported at `GET /api/health` → `{ "dataMode": "supabase" | "fallback" }`.

---

## Database setup (Supabase)

1. Create a project at supabase.com (free tier is fine).
2. In the SQL editor, run **`supabase/schema.sql`** (creates `service_catalog`,
   `companies`, `saved_accounts`).
3. Copy the project URL and the **service-role** key (Settings → API) into
   `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
4. Start the app — the Service Catalog auto-seeds from the bundled catalogue on
   first read. The five demo companies always come from the code seed; the
   `companies` table holds only user-created companies.

Notes: the server uses the service-role key, so Row Level Security isn't required
for 2A.0a (server-only access). Keep the service-role key server-side. Supabase
free projects can pause on inactivity — fine for an internal tool.

---

## Deploying (Vercel)

1. Push the repo to GitHub and **Import** it into Vercel (it auto-detects Next.js).
2. In Vercel → Project → **Settings → Environment Variables**, add `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, and `APP_ACCESS_PASSPHRASE`.
3. Deploy. Do **not** re-add `output: "export"` — this is a server app now.

The access gate is the only protection in 2A.0a, so **set `APP_ACCESS_PASSPHRASE`
in production**. (Full SSO is a later phase.)

---

## App map

| Page | Route | What it does |
|------|-------|--------------|
| Universal search | `/` | Search any company; create placeholder profiles for unknowns |
| Company dashboard | `/company?c=<id>` | Tabbed intelligence dossier (demo + user-created) |
| Service Catalog | `/services` | Team-shared CRUD for Freyr services (drives recommendations) |
| Saved accounts | `/accounts` | Team-shared pipeline |
| Account detail | `/accounts?c=<id>` | Owner, priority, MSA, tags, notes |
| Settings | `/settings` | Configuration + connector inventory |
| Unlock | `/unlock` | Passphrase entry (only when the gate is enabled) |

Dashboard tabs: Overview, Opportunities, Portfolio & field, Personas & talking
points, Outreach, Strategy, Sources (incl. the **Company Signals** panel).

---

## Architecture

```
src/
  app/
    api/                     Route Handlers (Node runtime): catalog, companies,
                             accounts, health, unlock
    company|services|accounts|settings|unlock/  pages (client; call /api/*)
    layout.tsx               providers, nav, fonts
  middleware.ts              shared-passphrase access gate
  components/                UI (dashboard sections, search, accounts, ui/*)
  lib/
    db/                      data layer:
      dataMode.ts            supabase vs fallback selection
      repositories.ts        CatalogRepo / CompanyRepo / AccountRepo interfaces
      supabaseRepos.ts       Supabase implementation
      memoryRepos.ts         in-memory fallback (seed-backed)
      supabaseClient.ts      lazy, server-only client
      index.ts               getRepos() factory
    client/api.ts            client fetch wrapper (UI → /api/*)
    auth/gate.ts             access-gate token helper
    companies/placeholder.ts pure placeholder builder
    accounts/helpers.ts      pure saved-account helpers
    catalog/helpers.ts       pure catalog helper
    signals/companySignals.ts   the Company Signal layer (deriveSignals/mergeSignals)
    generators/              matcher, talking points, outreach (unchanged)
    mock/                    seed services (25), 8 personas, 5 demo companies
    api/searchService.ts     pure company matcher
    sources/connectors.ts    connector interfaces (live impls are a later phase)
    types.ts                 all data models
  supabase/schema.sql        database schema
```

**Data flow:** UI → `lib/client/api.ts` → `/api/*` route handlers → `getRepos()`
→ Supabase or in-memory repo. The matcher, signal layer, and generators are pure
and unchanged; they consume whatever the data layer returns.

---

## Persistence

- **Supabase mode** (env set): shared Postgres. `service_catalog`, `companies`
  (user-created only), `saved_accounts`.
- **Fallback mode** (no env): in-memory maps seeded from code. Persists for one
  server process; **ephemeral on serverless** (each cold start reseeds). For real,
  shared persistence, configure Supabase.

---

## Notes & limitations (Phase 2A.0a)

- All company intelligence is still **mock/seeded**; live connectors are next.
- The access gate is a **single shared passphrase**, not per-user auth/SSO.
- Export buttons (PDF/PPT/Word/CRM) remain **"coming soon"** placeholders.
- Pinned to Next.js 14.2.x; track security releases as normal maintenance.

---

## Live research (Phase 2A.0c)

"Run live research" / "Research again" on a company pulls live signals from two
**zero-cost, no-LLM** sources and feeds them into the recommendations and the
Sources tab (with citations + confidence):

- **SEC EDGAR** — resolves the company's CIK, reads the submissions feed for
  firmographics (public status, SIC segment, HQ) and recent material filings
  (8-K → material event, S-4/425 → M&A), and optionally XBRL revenue. US public
  filers only; private/foreign companies return nothing (by design). Requires
  `SEC_USER_AGENT` (a contact email) per SEC fair-access rules.
- **Company website** — deterministic, rule-based parsing only (no AI): `<title>`,
  meta/OpenGraph, JSON-LD, headings, About/Products/Pipeline links, and RSS/Atom
  newsroom feeds. Structured evidence → Likely; pattern hits → Inferred. Respects
  a blanket `robots.txt` disallow. Thin/JS-rendered sites yield a partial result,
  never fabricated data.

**Orchestration is client-driven** — no queue, no cron. The browser creates a job
(`POST /api/companies/[id]/enrich`) then calls `POST /api/enrichment/[jobId]/run-next`
once per source, showing progress. Manual research always bypasses the cache;
results are written to `source_cache` for reuse. Enrichment output is stored on the
company and folded into `deriveSignals`, so recommendations and the Signals panel
reflect live data on the next render.

---

## Troubleshooting persistence (data disappears on refresh)

If changes appear but vanish after a refresh while `/api/health` says `supabase`,
writes are failing while reads succeed. Diagnose and fix:

1. **Hit `GET /api/debug`.** It runs a real insert → read-back → delete on each
   table and returns the raw Postgres error per step (and which env vars are set).
2. **Most common cause — Row Level Security.** If you created tables via the
   Supabase Table Editor, RLS is ON by default and blocks writes (error code
   `42501`). Run **`supabase/fix-rls.sql`** to disable RLS on the three
   server-only tables. (Running the full `supabase/schema.sql` also disables it.)
3. **Use the service-role key**, not the anon key, in `SUPABASE_SERVICE_ROLE_KEY`
   (Settings → API → `service_role`). The service role bypasses RLS.
4. **Schema mismatch.** Error `42P10` (no unique/PK for upsert) or `42703`
   (undefined column) means the table wasn't created from `supabase/schema.sql` —
   re-create it from that file.
5. Server logs (Vercel → the function's logs) now print the exact Supabase error
   for every failed write, and a warning if the catalog re-seeds on every read.

The UI no longer hides write failures: the Service Catalog shows a "Save failed"
banner with the error, and lists always reconcile with the server so what you see
is what's actually stored.

---

## Tech

Next.js 14 (App Router, server) · React 18 · TypeScript · Supabase Postgres
(with in-memory fallback) · plain-CSS design system. No CSS framework.
