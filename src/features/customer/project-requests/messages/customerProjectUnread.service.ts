import { requireSupabase } from "../../../../lib/supabase";

export const getCustomerUnreadMessageCounts = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("project_messages")
    .select(
      `
      project_request_id
      `,
    )
    .eq("sender_type", "admin")
    .is("read_at", null);

  if (error) {
    throw error;
  }

  const counts: Record<string, number> = {};

  data.forEach((message) => {
    counts[message.project_request_id] =
      (counts[message.project_request_id] ?? 0) + 1;
  });

  return counts;
};
