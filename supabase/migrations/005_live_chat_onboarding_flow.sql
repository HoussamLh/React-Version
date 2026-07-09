alter table public.visitor_profiles
add column if not exists onboarding_step text;

alter table public.visitor_profiles
add column if not exists contact_topic text;

update public.visitor_profiles
set onboarding_step = 'welcome'
where onboarding_step is null;

alter table public.visitor_profiles
alter column onboarding_step set default 'welcome';

alter table public.visitor_profiles
alter column onboarding_step set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'visitor_profiles_onboarding_step_check'
  ) then
    alter table public.visitor_profiles
    add constraint visitor_profiles_onboarding_step_check
    check (
      onboarding_step in (
        'welcome',
        'privacy',
        'name',
        'email',
        'topic',
        'ready'
      )
    );
  end if;
end $$;

drop policy if exists "Visitors can create own system messages" on public.messages;

create policy "Visitors can create own system messages"
on public.messages
for insert
to authenticated
with check (
  sender_type = 'system'
  and exists (
    select 1
    from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.visitor_id = auth.uid()
  )
);