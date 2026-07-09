create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  message text not null,
  status text not null default 'new',
  source text not null default 'contact_page',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint contact_submissions_status_check
  check (status in ('new', 'contacted', 'closed'))
);

create index if not exists contact_submissions_status_idx
  on public.contact_submissions(status);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions(created_at desc);

create or replace function public.set_contact_submissions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contact_submissions_set_updated_at
on public.contact_submissions;

create trigger contact_submissions_set_updated_at
before update on public.contact_submissions
for each row
execute function public.set_contact_submissions_updated_at();

alter table public.contact_submissions enable row level security;

drop policy if exists "Admins can read contact submissions"
on public.contact_submissions;

create policy "Admins can read contact submissions"
on public.contact_submissions
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update contact submissions"
on public.contact_submissions;

create policy "Admins can update contact submissions"
on public.contact_submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select, update on public.contact_submissions to authenticated;