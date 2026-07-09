create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'admin' check (role in ('owner', 'admin', 'support')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_profiles_role_idx
  on public.admin_profiles(role);

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;

create trigger set_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where admin_profiles.id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
create policy "Admins can read admin profiles"
on public.admin_profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update own admin profile" on public.admin_profiles;
create policy "Admins can update own admin profile"
on public.admin_profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins can read all conversations" on public.conversations;
create policy "Admins can read all conversations"
on public.conversations
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update all conversations" on public.conversations;
create policy "Admins can update all conversations"
on public.conversations
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read all messages" on public.messages;
create policy "Admins can read all messages"
on public.messages
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can create admin messages" on public.messages;
create policy "Admins can create admin messages"
on public.messages
for insert
to authenticated
with check (
  public.is_admin()
  and sender_type = 'admin'
  and exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
  )
);

grant select, update on public.admin_profiles to authenticated;
grant select, update on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;