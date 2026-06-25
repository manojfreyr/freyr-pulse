-- Run this if writes/deletes are failing (e.g. tables created via the Table
-- Editor, which enables RLS, or the app using the anon key with no DELETE policy).
-- It disables RLS AND explicitly grants full CRUD to the API roles, so SELECT,
-- INSERT, UPDATE and DELETE all work regardless of how the tables were created.
-- Idempotent — safe to re-run.

-- Core tables (v1.x).
alter table service_catalog disable row level security;
alter table companies       disable row level security;
alter table saved_accounts  disable row level security;

-- Commercial Enablement (V2.0-A) tables.
alter table service_types         disable row level security;
alter table customer_segments     disable row level security;
alter table markets               disable row level security;
alter table sales_assets          disable row level security;
alter table service_applicability disable row level security;
alter table service_assets        disable row level security;

-- Explicit privileges for the PostgREST API roles. With RLS disabled these grants
-- are what actually permit DELETE (and the rest) when the app uses the anon key.
grant select, insert, update, delete on
  service_catalog, companies, saved_accounts,
  service_types, customer_segments, markets,
  sales_assets, service_applicability, service_assets
to anon, authenticated, service_role;
