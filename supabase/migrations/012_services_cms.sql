-- ==========================================
-- Services CMS
-- ==========================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,
  text text not null,

  icon text not null default 'code',
  image_url text,

  pills text[] not null default '{}'::text[],

  span text not null default 'span 1',
  badge text,
  monitoring boolean not null default false,

  hover_accent text not null default 'green',

  status text not null default 'draft',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint services_status_check
    check (status in ('draft', 'published')),

  constraint services_span_check
    check (span in ('span 1', 'span 2')),

  constraint services_icon_check
    check (icon in ('code', 'smartphone', 'server', 'shield-check')),

  constraint services_hover_accent_check
    check (hover_accent in ('green', 'blue', 'purple', 'pink', 'yellow', 'cyan'))
);

create index if not exists services_status_idx
on public.services (status);

create index if not exists services_sort_order_idx
on public.services (sort_order);

create index if not exists services_slug_idx
on public.services (slug);

create or replace function public.set_services_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_services_updated_at
on public.services;

create trigger set_services_updated_at
before update on public.services
for each row
execute function public.set_services_updated_at();

alter table public.services enable row level security;

drop policy if exists "Public can read published services" on public.services;
drop policy if exists "Admins can read all services" on public.services;
drop policy if exists "Admins can create services" on public.services;
drop policy if exists "Admins can update services" on public.services;
drop policy if exists "Admins can delete services" on public.services;

-- Public visitors can only read published services.
create policy "Public can read published services"
on public.services
for select
to anon, authenticated
using (status = 'published');

-- Admins can read all services, including drafts.
create policy "Admins can read all services"
on public.services
for select
to authenticated
using (public.is_admin());

-- Admins can create services.
create policy "Admins can create services"
on public.services
for insert
to authenticated
with check (public.is_admin());

-- Admins can update services.
create policy "Admins can update services"
on public.services
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Admins can delete services.
create policy "Admins can delete services"
on public.services
for delete
to authenticated
using (public.is_admin());