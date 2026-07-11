-- ===============================================
-- Projects CMS with image/video media support
-- ===============================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,
  text text not null,

  category text not null default 'web',
  tags text[] not null default '{}'::text[],

  media_type text not null default 'image',
  image_url text,
  video_url text,
  video_poster_url text,

  span text not null default 'span 6',
  image_height text not null default '320px',
  hover_accent text not null default 'green',

  demo_url text,
  github_url text,

  featured boolean not null default false,
  status text not null default 'draft',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint projects_media_type_check
    check (media_type in ('image', 'video')),

  constraint projects_status_check
    check (status in ('draft', 'published')),

  constraint projects_hover_accent_check
    check (hover_accent in ('green', 'blue', 'purple', 'pink', 'yellow', 'cyan')),

  constraint projects_span_check
    check (span in ('span 4', 'span 6', 'span 8', 'span 12')),

  constraint projects_category_check
    check (category in ('web', 'mobile', 'backend', 'branding', 'fullstack', 'saas', 'uiux')),

  constraint projects_image_required_for_image_media
    check (
      media_type <> 'image'
      or image_url is not null
    ),

  constraint projects_video_required_for_video_media
    check (
      media_type <> 'video'
      or video_url is not null
    )
);

create index if not exists projects_status_idx
on public.projects (status);

create index if not exists projects_category_idx
on public.projects (category);

create index if not exists projects_featured_idx
on public.projects (featured);

create index if not exists projects_sort_order_idx
on public.projects (sort_order);

create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at
on public.projects;

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_projects_updated_at();

alter table public.projects enable row level security;

-- Public visitors can only read published projects.
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published');

-- Admins can read all projects, including drafts.
create policy "Admins can read all projects"
on public.projects
for select
to authenticated
using (public.is_admin());

-- Admins can create projects.
create policy "Admins can create projects"
on public.projects
for insert
to authenticated
with check (public.is_admin());

-- Admins can update projects.
create policy "Admins can update projects"
on public.projects
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Admins can delete projects.
create policy "Admins can delete projects"
on public.projects
for delete
to authenticated
using (public.is_admin());