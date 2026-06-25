-- Freyr Pulse — Phase 2A.0b migration (additive, idempotent).
-- Run against an existing 2A.0a database. Adds provenance, cache, and
-- enrichment-job tables. No changes to existing tables or data.

-- ─────────────────────────────────────────────────────────────────────────
-- Phase 2A.0b — provenance, cache & enrichment-job plumbing
-- ─────────────────────────────────────────────────────────────────────────

-- Structured source citations (provenance). Populated by live connectors later.
create table if not exists citations (
  id           text primary key,
  source_type  text,
  label        text        not null,
  url          text,
  publisher    text,
  published_at timestamptz,
  retrieved_at timestamptz,
  snippet      text,
  created_at   timestamptz not null default now()
);

-- Many-to-many between a (persisted) signal and its citations — enables
-- corroboration (a signal backed by several independent sources).
create table if not exists signal_citations (
  signal_ref  text not null,            -- e.g. "<companyId>:<signalKey>"
  citation_id text not null references citations(id) on delete cascade,
  primary key (signal_ref, citation_id)
);

-- Per-source response cache (TTL via expires_at). Postgres-only (no Redis).
create table if not exists source_cache (
  source       text        not null,
  cache_key    text        not null,
  value        jsonb       not null,
  content_hash text,
  fetched_at   timestamptz not null,
  expires_at   timestamptz not null,
  primary key (source, cache_key)
);

-- Async enrichment jobs (substrate for async-with-progress; orchestration 2A.0c).
create table if not exists enrichment_jobs (
  id         text primary key,
  company_id text        not null,
  status     text        not null default 'queued',
  steps      jsonb       not null default '[]'::jsonb,
  progress   integer     not null default 0,
  error      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Server-only access via the service-role key → disable RLS on all four.
alter table citations        disable row level security;
alter table signal_citations disable row level security;
alter table source_cache     disable row level security;
alter table enrichment_jobs  disable row level security;
