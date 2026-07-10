-- =============================================
-- Safer admin-only conversation status updates
-- =============================================

create or replace function public.update_admin_conversation_status(
  target_conversation_id uuid,
  next_status text
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

  if next_status not in ('open', 'pending', 'closed') then
    raise exception 'Invalid conversation status';
  end if;

  update public.conversations
  set status = next_status,
      updated_at = now()
  where id = target_conversation_id;

  if not found then
    raise exception 'Conversation not found';
  end if;
end;
$$;

revoke all on function public.update_admin_conversation_status(uuid, text)
from public;

grant execute on function public.update_admin_conversation_status(uuid, text)
to authenticated;