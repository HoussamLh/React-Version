-- ==========================================
-- Project Request Message Media
-- ==========================================

create table if not exists public.project_message_media (
  id uuid primary key default gen_random_uuid(),

  project_request_id uuid not null
    references public.project_requests(id)
    on delete cascade,

  message_id uuid not null
    references public.project_messages(id)
    on delete cascade,

  customer_id uuid not null
    references public.customer_profiles(id)
    on delete cascade,

  media_type text not null,
  resource_type text not null,
  original_filename text not null,
  mime_type text,
  file_size bigint,
  secure_url text not null,
  public_id text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint project_message_media_type_check
    check (media_type in ('image', 'file')),

  constraint project_message_media_resource_type_check
    check (resource_type in ('image', 'raw')),

  constraint project_message_media_type_resource_check
    check (
      (media_type = 'image' and resource_type = 'image')
      or (media_type = 'file' and resource_type = 'raw')
    ),

  constraint project_message_media_size_check
    check (file_size is null or file_size >= 0),

  constraint project_message_media_public_id_unique
    unique (public_id)
);

create index if not exists project_message_media_project_request_id_idx
on public.project_message_media (project_request_id, created_at);

create index if not exists project_message_media_message_id_idx
on public.project_message_media (message_id, created_at);

create index if not exists project_message_media_customer_id_idx
on public.project_message_media (customer_id, created_at);

create or replace function public.set_project_message_media_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_project_message_media_updated_at
on public.project_message_media;

create trigger set_project_message_media_updated_at
before update on public.project_message_media
for each row
execute function public.set_project_message_media_updated_at();

alter table public.project_message_media enable row level security;

revoke all on table public.project_message_media from anon, authenticated;
grant select, insert, delete on table public.project_message_media to authenticated;

drop policy if exists "Customers can view own project message media"
on public.project_message_media;

drop policy if exists "Customers can insert own project message media"
on public.project_message_media;

drop policy if exists "Customers can delete own project message media"
on public.project_message_media;

drop policy if exists "Admins can view project message media"
on public.project_message_media;
drop policy if exists "Admins can insert project message media"
on public.project_message_media;
drop policy if exists "Admins can delete project message media"
on public.project_message_media;

create policy "Customers can view own project message media"
on public.project_message_media
for select
to authenticated
using (
  customer_id = (select auth.uid())
  and exists (
    select 1
    from public.project_requests pr
    where pr.id = project_message_media.project_request_id
      and pr.customer_id = (select auth.uid())
  )
);

create policy "Customers can insert own project message media"
on public.project_message_media
for insert
to authenticated
with check (
  customer_id = (select auth.uid())
  and exists (
    select 1
    from public.project_requests pr
    where pr.id = project_message_media.project_request_id
      and pr.customer_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.project_messages pm
    where pm.id = project_message_media.message_id
      and pm.project_request_id = project_message_media.project_request_id
      and pm.sender_id = (select auth.uid())
      and pm.sender_type = 'customer'
  )
);

create policy "Customers can delete own project message media"
on public.project_message_media
for delete
to authenticated
using (
  customer_id = (select auth.uid())
  and exists (
    select 1
    from public.project_messages pm
    where pm.id = project_message_media.message_id
      and pm.project_request_id = project_message_media.project_request_id
      and pm.sender_id = (select auth.uid())
      and pm.sender_type = 'customer'
  )
);

create policy "Admins can view project message media"
on public.project_message_media
for select
to authenticated
using ((select public.is_admin()));

create policy "Admins can insert project message media"
on public.project_message_media
for insert
to authenticated
with check (
  (select public.is_admin())
  and exists (
    select 1
    from public.project_messages pm
    where pm.id = project_message_media.message_id
      and pm.project_request_id = project_message_media.project_request_id
      and pm.sender_id = (select auth.uid())
      and pm.sender_type = 'admin'
  )
  and exists (
    select 1
    from public.project_requests pr
    where pr.id = project_message_media.project_request_id
      and pr.customer_id = project_message_media.customer_id
  )
);

create policy "Admins can delete project message media"
on public.project_message_media
for delete
to authenticated
using ((select public.is_admin()));

-- Keep message media available to Realtime subscribers.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'project_message_media'
  ) then
    alter publication supabase_realtime
      add table public.project_message_media;
  end if;
end;
$$;
