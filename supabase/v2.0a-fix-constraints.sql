-- Remediation for the V2.0-A delete anomaly when the cause is a MISSING PRIMARY KEY
-- on a commercial table (i.e. the table pre-existed without the PK, so the
-- `create table if not exists` in v2.0a-commercial.sql was a no-op and never added it).
--
-- Run this ONLY if /api/debug/commercial?raw=1 reports `uniqueConstraintOnId: false`
-- (its interpretation will say "ROOT CAUSE: ... NO primary key"). Idempotent: it adds a
-- primary key on `id` to any of the six tables that lacks one.
--
-- If a table already contains duplicate ids, de-duplicate first (keep the newest):
--   delete from <table> a using <table> b
--   where a.id = b.id and a.ctid < b.ctid;   -- removes older duplicates
-- then re-run this script.

do $$
declare
  t text;
  tables text[] := array[
    'service_types','customer_segments','markets',
    'sales_assets','service_applicability','service_assets'
  ];
begin
  foreach t in array tables loop
    if to_regclass(t) is not null
       and not exists (
         select 1 from pg_constraint
         where conrelid = t::regclass and contype = 'p'
       ) then
      execute format('alter table %I add primary key (id)', t);
      raise notice 'Added primary key on %', t;
    end if;
  end loop;
end $$;
