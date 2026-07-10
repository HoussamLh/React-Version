-- -------------------------------------------------------------------
-- 1. Prevent admins/support users from changing their own role/email
-- --------------------------------------------------------------------

drop policy if exists "Admins can update own admin profile"
on public.admin_profiles;

revoke update on public.admin_profiles from authenticated;

grant update (display_name)
on public.admin_profiles
to authenticated;

create policy "Admins can update own display name"
on public.admin_profiles
for update
to authenticated
using (
  id = auth.uid()
  and public.is_admin()
)
with check (
  id = auth.uid()
  and public.is_admin()
);


-- ---------------------------------------------------------
-- 2. Prevent visitors from directly updating conversations
-- ---------------------------------------------------------

drop policy if exists "Visitors can update own conversations"
on public.conversations;
