import { supabase } from "../../../../lib/supabase";

export const getUnreadCustomerMessageCounts = async () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("project_messages")
    .select(
      `
      project_request_id
      `,
    )
    .eq("sender_type", "customer")
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
