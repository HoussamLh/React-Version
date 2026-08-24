-- ==========================================
-- Services CMS Cloudinary media 
-- ==========================================

alter table public.services
add column if not exists image_public_id text;
