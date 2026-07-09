drop policy if exists "Admins can read visitor profiles" on public.visitor_profiles;

create policy "Admins can read visitor profiles"
on public.visitor_profiles
for select
to authenticated
using (public.is_admin());

grant select on public.visitor_profiles to authenticated;