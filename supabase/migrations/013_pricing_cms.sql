-- ==========================================
-- Pricing CMS
-- ==========================================

-- ==========================================
-- Build Pricing Plans
-- ==========================================

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  label text not null,
  price text not null,
  suffix text,
  description text not null,

  features text[] not null default '{}'::text[],

  cta_label text not null default 'Contact',
  cta_to text not null default '/contact',

  recommended boolean not null default false,

  status text not null default 'draft',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint pricing_plans_status_check
    check (status in ('draft', 'published'))
);

create index if not exists pricing_plans_status_idx
on public.pricing_plans (status);

create index if not exists pricing_plans_sort_order_idx
on public.pricing_plans (sort_order);

create or replace function public.set_pricing_plans_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_pricing_plans_updated_at
on public.pricing_plans;

create trigger set_pricing_plans_updated_at
before update on public.pricing_plans
for each row
execute function public.set_pricing_plans_updated_at();

alter table public.pricing_plans enable row level security;

drop policy if exists "Public can read published pricing plans" on public.pricing_plans;
drop policy if exists "Admins can read all pricing plans" on public.pricing_plans;
drop policy if exists "Admins can create pricing plans" on public.pricing_plans;
drop policy if exists "Admins can update pricing plans" on public.pricing_plans;
drop policy if exists "Admins can delete pricing plans" on public.pricing_plans;

create policy "Public can read published pricing plans"
on public.pricing_plans
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all pricing plans"
on public.pricing_plans
for select
to authenticated
using (public.is_admin());

create policy "Admins can create pricing plans"
on public.pricing_plans
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update pricing plans"
on public.pricing_plans
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete pricing plans"
on public.pricing_plans
for delete
to authenticated
using (public.is_admin());


-- ==========================================
-- Maintenance Plans
-- ==========================================

create table if not exists public.maintenance_plans (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  price text not null,
  suffix text not null default '/mo',
  description text not null,

  features text[] not null default '{}'::text[],

  cta_label text not null default 'Contact',
  cta_to text not null default '/contact',

  recommended boolean not null default false,

  status text not null default 'draft',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint maintenance_plans_status_check
    check (status in ('draft', 'published'))
);

create index if not exists maintenance_plans_status_idx
on public.maintenance_plans (status);

create index if not exists maintenance_plans_sort_order_idx
on public.maintenance_plans (sort_order);

create or replace function public.set_maintenance_plans_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_maintenance_plans_updated_at
on public.maintenance_plans;

create trigger set_maintenance_plans_updated_at
before update on public.maintenance_plans
for each row
execute function public.set_maintenance_plans_updated_at();

alter table public.maintenance_plans enable row level security;

drop policy if exists "Public can read published maintenance plans" on public.maintenance_plans;
drop policy if exists "Admins can read all maintenance plans" on public.maintenance_plans;
drop policy if exists "Admins can create maintenance plans" on public.maintenance_plans;
drop policy if exists "Admins can update maintenance plans" on public.maintenance_plans;
drop policy if exists "Admins can delete maintenance plans" on public.maintenance_plans;

create policy "Public can read published maintenance plans"
on public.maintenance_plans
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all maintenance plans"
on public.maintenance_plans
for select
to authenticated
using (public.is_admin());

create policy "Admins can create maintenance plans"
on public.maintenance_plans
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update maintenance plans"
on public.maintenance_plans
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete maintenance plans"
on public.maintenance_plans
for delete
to authenticated
using (public.is_admin());


-- ==========================================
-- Emergency Restoration
-- ==========================================

create table if not exists public.emergency_restoration (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  price text not null,
  suffix text not null default 'one-time',
  text text not null,

  status text not null default 'draft',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint emergency_restoration_status_check
    check (status in ('draft', 'published'))
);

create index if not exists emergency_restoration_status_idx
on public.emergency_restoration (status);

create or replace function public.set_emergency_restoration_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_emergency_restoration_updated_at
on public.emergency_restoration;

create trigger set_emergency_restoration_updated_at
before update on public.emergency_restoration
for each row
execute function public.set_emergency_restoration_updated_at();

alter table public.emergency_restoration enable row level security;

drop policy if exists "Public can read published emergency restoration" on public.emergency_restoration;
drop policy if exists "Admins can read all emergency restoration" on public.emergency_restoration;
drop policy if exists "Admins can create emergency restoration" on public.emergency_restoration;
drop policy if exists "Admins can update emergency restoration" on public.emergency_restoration;
drop policy if exists "Admins can delete emergency restoration" on public.emergency_restoration;

create policy "Public can read published emergency restoration"
on public.emergency_restoration
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all emergency restoration"
on public.emergency_restoration
for select
to authenticated
using (public.is_admin());

create policy "Admins can create emergency restoration"
on public.emergency_restoration
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update emergency restoration"
on public.emergency_restoration
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete emergency restoration"
on public.emergency_restoration
for delete
to authenticated
using (public.is_admin());


-- ==========================================
-- Comparison Rows
-- ==========================================

create table if not exists public.comparison_rows (
  id uuid primary key default gen_random_uuid(),

  feature text not null,
  standard text not null,
  advanced text not null,
  premium text not null,

  status text not null default 'draft',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint comparison_rows_status_check
    check (status in ('draft', 'published'))
);

create index if not exists comparison_rows_status_idx
on public.comparison_rows (status);

create index if not exists comparison_rows_sort_order_idx
on public.comparison_rows (sort_order);

create or replace function public.set_comparison_rows_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_comparison_rows_updated_at
on public.comparison_rows;

create trigger set_comparison_rows_updated_at
before update on public.comparison_rows
for each row
execute function public.set_comparison_rows_updated_at();

alter table public.comparison_rows enable row level security;

drop policy if exists "Public can read published comparison rows" on public.comparison_rows;
drop policy if exists "Admins can read all comparison rows" on public.comparison_rows;
drop policy if exists "Admins can create comparison rows" on public.comparison_rows;
drop policy if exists "Admins can update comparison rows" on public.comparison_rows;
drop policy if exists "Admins can delete comparison rows" on public.comparison_rows;

create policy "Public can read published comparison rows"
on public.comparison_rows
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all comparison rows"
on public.comparison_rows
for select
to authenticated
using (public.is_admin());

create policy "Admins can create comparison rows"
on public.comparison_rows
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update comparison rows"
on public.comparison_rows
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete comparison rows"
on public.comparison_rows
for delete
to authenticated
using (public.is_admin());