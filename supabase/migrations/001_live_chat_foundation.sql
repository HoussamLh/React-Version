create extension if not exists pgcrypto;

create table if not exists public.visitor_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references public.visitor_profiles(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('visitor', 'admin', 'system')),
  body text not null check (
    char_length(trim(body)) > 0
    and char_length(body) <= 4000
  ),
  created_at timestamptz not null default now()
);

create index if not exists visitor_profiles_last_seen_at_idx
  on public.visitor_profiles(last_seen_at desc);

create index if not exists conversations_visitor_id_idx
  on public.conversations(visitor_id);

create index if not exists conversations_status_idx
  on public.conversations(status);

create index if not exists conversations_last_message_at_idx
  on public.conversations(last_message_at desc);

create index if not exists messages_conversation_id_created_at_idx
  on public.messages(conversation_id, created_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_visitor_profiles_updated_at on public.visitor_profiles;

create trigger set_visitor_profiles_updated_at
before update on public.visitor_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;

create trigger set_conversations_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

create or replace function public.update_conversation_last_message_at()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message_at = new.created_at,
      updated_at = now()
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists update_conversation_last_message_at on public.messages;

create trigger update_conversation_last_message_at
after insert on public.messages
for each row
execute function public.update_conversation_last_message_at();

alter table public.visitor_profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Visitors can read own profile" on public.visitor_profiles;
create policy "Visitors can read own profile"
on public.visitor_profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Visitors can create own profile" on public.visitor_profiles;
create policy "Visitors can create own profile"
on public.visitor_profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Visitors can update own profile" on public.visitor_profiles;
create policy "Visitors can update own profile"
on public.visitor_profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Visitors can read own conversations" on public.conversations;
create policy "Visitors can read own conversations"
on public.conversations
for select
to authenticated
using (visitor_id = auth.uid());

drop policy if exists "Visitors can create own conversations" on public.conversations;
create policy "Visitors can create own conversations"
on public.conversations
for insert
to authenticated
with check (visitor_id = auth.uid());

drop policy if exists "Visitors can update own conversations" on public.conversations;
create policy "Visitors can update own conversations"
on public.conversations
for update
to authenticated
using (visitor_id = auth.uid())
with check (visitor_id = auth.uid());

drop policy if exists "Visitors can read own conversation messages" on public.messages;
create policy "Visitors can read own conversation messages"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.visitor_id = auth.uid()
  )
);

drop policy if exists "Visitors can create own messages" on public.messages;
create policy "Visitors can create own messages"
on public.messages
for insert
to authenticated
with check (
  sender_type = 'visitor'
  and exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.visitor_id = auth.uid()
  )
);

grant usage on schema public to authenticated;
grant select, insert, update on public.visitor_profiles to authenticated;
grant select, insert, update on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;