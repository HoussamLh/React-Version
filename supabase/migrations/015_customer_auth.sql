-- ==========================================
-- Customer Accounts / Get Started Auth
-- ==========================================

create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  email text not null,
  full_name text not null default '',
  company_name text not null default '',
  phone text not null default '',

  onboarding_status text not null default 'new',
  account_status text not null default 'active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint customer_profiles_onboarding_status_check
    check (
      onboarding_status in (
        'new',
        'profile_started',
        'project_started',
        'active'
      )
    ),

  constraint customer_profiles_account_status_check
    check (
      account_status in (
        'active',
        'suspended'
      )
    )
);

create index if not exists customer_profiles_email_idx
on public.customer_profiles (email);

create index if not exists customer_profiles_account_status_idx
on public.customer_profiles (account_status);

create index if not exists customer_profiles_onboarding_status_idx
on public.customer_profiles (onboarding_status);

create or replace function public.set_customer_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_customer_profiles_updated_at
on public.customer_profiles;

create trigger set_customer_profiles_updated_at
before update on public.customer_profiles
for each row
execute function public.set_customer_profiles_updated_at();

alter table public.customer_profiles enable row level security;

drop policy if exists "Customers can read own profile" on public.customer_profiles;
drop policy if exists "Customers can create own profile" on public.customer_profiles;
drop policy if exists "Customers can update own profile" on public.customer_profiles;

drop policy if exists "Admins can read customer profiles" on public.customer_profiles;
drop policy if exists "Admins can create customer profiles" on public.customer_profiles;
drop policy if exists "Admins can update customer profiles" on public.customer_profiles;
drop policy if exists "Admins can delete customer profiles" on public.customer_profiles;

create policy "Customers can read own profile"
on public.customer_profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Customers can create own profile"
on public.customer_profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Customers can update own profile"
on public.customer_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can read customer profiles"
on public.customer_profiles
for select
to authenticated
using (public.is_admin());

create policy "Admins can create customer profiles"
on public.customer_profiles
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update customer profiles"
on public.customer_profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete customer profiles"
on public.customer_profiles
for delete
to authenticated
using (public.is_admin());