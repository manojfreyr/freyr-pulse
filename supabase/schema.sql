-- Freyr Pulse — Phase 2A.0a schema
-- Run in the Supabase SQL editor. The server uses the service-role key, so
-- Row Level Security is not required for 2A.0a (server-only access). Keep the
-- service-role key server-side only.

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

-- The Service Catalog auto-seeds from the app's bundled seed on first read,
-- so no manual catalog seed is required here. The five demo companies always
-- come from the code seed; the companies table holds only user-created ones.
