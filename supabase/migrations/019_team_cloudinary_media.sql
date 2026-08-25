-- ==========================================
-- Team CMS Cloudinary media
-- ==========================================

alter table public.team_members
add column if not exists image_public_id text;

create index if not exists team_members_image_public_id_idx
on public.team_members (image_public_id)
where image_public_id is not null;
