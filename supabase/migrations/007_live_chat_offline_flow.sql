alter table public.visitor_profiles
add column if not exists contact_service text;

alter table public.visitor_profiles
add column if not exists contact_extra_details text;

alter table public.visitor_profiles
add column if not exists chat_mode text;

alter table public.visitor_profiles
drop constraint if exists visitor_profiles_chat_mode_check;

alter table public.visitor_profiles
add constraint visitor_profiles_chat_mode_check
check (
  chat_mode is null
  or chat_mode in ('online', 'offline')
);

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
    'offline_notice',
    'service',
    'topic',
    'connecting',
    'offline_confirm',
    'extra_choice',
    'extra_message_prompt',
    'extra_message',
    'extra_received',
    'closed',
    'ready'
  )
);