alter table public.conversations
add column if not exists admin_last_read_at timestamptz;

create index if not exists conversations_admin_last_read_at_idx
  on public.conversations(admin_last_read_at);

create or replace function public.mark_conversation_read_for_admin(
  conversation_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  update public.conversations
  set admin_last_read_at = now(),
      updated_at = now()
  where id = conversation_id;
end;
$$;

revoke all on function public.mark_conversation_read_for_admin(uuid) from public;
grant execute on function public.mark_conversation_read_for_admin(uuid) to authenticated;