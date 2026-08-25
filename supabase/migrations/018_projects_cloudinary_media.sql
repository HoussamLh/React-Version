-- ==========================================
-- Projects CMS Cloudinary media metadata
-- ==========================================

alter table public.projects
add column if not exists image_public_id text;

alter table public.projects
add column if not exists video_public_id text;

alter table public.projects
add column if not exists video_poster_public_id text;
