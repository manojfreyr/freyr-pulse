-- Freyr Pulse — Version 2.0-A: Commercial Enablement foundation (ADDITIVE).
-- Creates five new tables. No changes to existing tables/columns. Safe to re-run
-- (create table if not exists / create index if not exists). Run fix-rls.sql
-- afterwards (it now also disables RLS on these tables).
--
-- Nothing consumes these tables yet (foundation only). Segments and markets are
-- seeded from application code on first read (seed-when-empty), so the optional
-- seed block at the bottom is not required.

create table if not exists customer_segments (
  id            text        primary key,
  name          text        not null,
  status        text        not null default 'active',
  display_order int         not null default 0,
  data          jsonb       not null,
  updated_at    timestamptz not null default now()
);

create table if not exists markets (
  id              text        primary key,
  name            text        not null,
  region          text        not null,
  regulatory_body text        not null,
  status          text        not null default 'active',
  display_order   int         not null default 0,
  data            jsonb       not null,
  updated_at      timestamptz not null default now()
);

create table if not exists sales_assets (
  id          text        primary key,
  title       text        not null,
  asset_type  text        not null,
  status      text        not null default 'draft',
  url         text        not null,
  data        jsonb       not null,
  updated_at  timestamptz not null default now()
);

create table if not exists service_applicability (
  id            text        primary key,
  service_id    text        not null,
  segment_id    text        not null,  -- a customer_segments.id OR '*'
  market_id     text        not null,  -- a markets.id OR '*'
  applicability text        not null,  -- 'recommended' | 'applicable' | 'not-applicable'
  data          jsonb       not null,
  updated_at    timestamptz not null default now()
);
create index if not exists service_applicability_service_idx on service_applicability (service_id);

create table if not exists service_assets (
  id          text        primary key,
  service_id  text        not null,
  asset_id    text        not null,
  data        jsonb       not null,
  updated_at  timestamptz not null default now()
);
create index if not exists service_assets_service_idx on service_assets (service_id);
create index if not exists service_assets_asset_idx   on service_assets (asset_id);

-- RLS off (server-only; service-role key must read AND write), matching existing tables.
alter table customer_segments     disable row level security;
alter table markets               disable row level security;
alter table sales_assets          disable row level security;
alter table service_applicability disable row level security;
alter table service_assets        disable row level security;

-- OPTIONAL: pre-seed editable default segments/markets as DB rows. Not required —
-- the app seeds these from code on first read. Uncomment to make them DB-resident.
-- insert into customer_segments (id, name, status, display_order, data) values
--   ('large-pharma','Large Pharma','active',1,'{"id":"large-pharma","name":"Large Pharma","status":"active","displayOrder":1,"classificationRules":[]}')
-- on conflict (id) do nothing;
-- (… remaining segments/markets …)
