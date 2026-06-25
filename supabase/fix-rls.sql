-- Run this if tables already exist (e.g. created via the Table Editor, which
-- enables RLS by default) and writes are failing. It disables RLS on the three
-- server-only tables so the service-role key can read AND write.
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
