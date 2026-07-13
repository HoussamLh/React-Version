-- ==========================================
-- Team CMS
-- ==========================================

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  role text not null,
  description text not null,

  image_url text not null,
  image_alt text not null,

  hover_accent text not null default 'green',

  status text not null default 'draft',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint team_members_status_check
    check (status in ('draft', 'published')),

  constraint team_members_hover_accent_check
    check (hover_accent in ('green', 'blue', 'purple', 'pink'))
);

create index if not exists team_members_status_idx
on public.team_members (status);

create index if not exists team_members_sort_order_idx
on public.team_members (sort_order);

create or replace function public.set_team_members_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_team_members_updated_at
on public.team_members;

create trigger set_team_members_updated_at
before update on public.team_members
for each row
execute function public.set_team_members_updated_at();

alter table public.team_members enable row level security;

drop policy if exists "Public can read published team members" on public.team_members;
drop policy if exists "Admins can read all team members" on public.team_members;
drop policy if exists "Admins can create team members" on public.team_members;
drop policy if exists "Admins can update team members" on public.team_members;
drop policy if exists "Admins can delete team members" on public.team_members;

create policy "Public can read published team members"
on public.team_members
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all team members"
on public.team_members
for select
to authenticated
using (public.is_admin());

create policy "Admins can create team members"
on public.team_members
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update team members"
on public.team_members
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete team members"
on public.team_members
for delete
to authenticated
using (public.is_admin());