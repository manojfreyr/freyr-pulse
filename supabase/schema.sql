-- Freyr Pulse — Phase 2A.0a schema
-- Run this in the Supabase SQL editor.
--
-- The server talks to these tables with the SERVICE-ROLE key, so they are
-- server-only and do NOT need Row Level Security. RLS is explicitly DISABLED
-- below. If RLS is left ON with no policies, reads return empty and writes are
-- rejected — which presents as "data appears then disappears on refresh".

create table if not exists service_catalog (
  id            text primary key,
  data          jsonb       not null,
  active_status boolean     not null default true,
  updated_at    timestamptz not null default now()
);

create table if not exists companies (
  id             text primary key,
  name           text        not null,
  website        text,
  origin         text        not null default 'user',
  is_placeholder boolean     not null default false,
  data           jsonb       not null,
  updated_at     timestamptz not null default now()
);
create index if not exists companies_name_idx
  on companies using gin (to_tsvector('simple', name));

create table if not exists saved_accounts (
  company_id text primary key,
  data       jsonb       not null,
  updated_at timestamptz not null default now()
);

-- Server-only access via the service-role key → disable RLS on all three.
alter table service_catalog disable row level security;
alter table companies       disable row level security;
alter table saved_accounts  disable row level security;

-- Notes:
-- * The Service Catalog auto-seeds from the app's bundled seed on first read.
-- * The five demo companies always come from the code seed; the companies
--   table holds only user-created companies.
