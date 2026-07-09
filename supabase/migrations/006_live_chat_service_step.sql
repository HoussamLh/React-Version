alter table public.visitor_profiles
add column if not exists contact_service text;

alter table public.visitor_profiles
drop constraint if exists visitor_profiles_onboarding_step_check;

alter table public.visitor_profiles
add constraint visitor_profiles_onboarding_step_check
check (
  onboarding_step in (
    'welcome',
    'privacy',
    'name',
    'email',
    'service',
    'topic',
    'connecting',
    'ready'
  )
);