-- ==========================================
-- Customer Project Requests
-- ==========================================

create table if not exists public.project_requests (
  id uuid primary key default gen_random_uuid(),

  customer_id uuid not null references public.customer_profiles(id) on delete cascade,

  title text not null,
  project_type text not null default 'website',

  selected_package text not null default '',
  package_category text not null default 'custom',

  budget_range text not null default '',
  timeline text not null default '',

  description text not null,
  goals text not null default '',

  status text not null default 'submitted',
  admin_notes text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint project_requests_project_type_check
    check (
      project_type in (
        'website',
        'mobile_app',
        'backend_system',
        'maintenance',
        'other'
      )
    ),

  constraint project_requests_package_category_check
    check (
      package_category in (
        'build_plan',
        'maintenance_plan',
        'custom'
      )
    ),

  constraint project_requests_status_check
    check (
      status in (
        'submitted',
        'reviewed',
        'in_progress',
        'completed',
        'cancelled'
      )
    )
);

create index if not exists project_requests_customer_id_idx
on public.project_requests (customer_id);

create index if not exists project_requests_status_idx
on public.project_requests (status);

create index if not exists project_requests_project_type_idx
on public.project_requests (project_type);

create index if not exists project_requests_created_at_idx
on public.project_requests (created_at desc);

create or replace function public.set_project_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_project_requests_updated_at
on public.project_requests;

create trigger set_project_requests_updated_at
before update on public.project_requests
for each row
execute function public.set_project_requests_updated_at();

alter table public.project_requests enable row level security;

drop policy if exists "Customers can read own project requests" on public.project_requests;
drop policy if exists "Customers can create own project requests" on public.project_requests;
drop policy if exists "Customers can update own submitted project requests" on public.project_requests;

drop policy if exists "Admins can read project requests" on public.project_requests;
drop policy if exists "Admins can update project requests" on public.project_requests;
drop policy if exists "Admins can delete project requests" on public.project_requests;

create policy "Customers can read own project requests"
on public.project_requests
for select
to authenticated
using (customer_id = auth.uid());

create policy "Customers can create own project requests"
on public.project_requests
for insert
to authenticated
with check (customer_id = auth.uid());

create policy "Customers can update own submitted project requests"
on public.project_requests
for update
to authenticated
using (
  customer_id = auth.uid()
  and status = 'submitted'
)
with check (
  customer_id = auth.uid()
  and status = 'submitted'
);

create policy "Admins can read project requests"
on public.project_requests
for select
to authenticated
using (public.is_admin());

create policy "Admins can update project requests"
on public.project_requests
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete project requests"
on public.project_requests
for delete
to authenticated
using (public.is_admin());