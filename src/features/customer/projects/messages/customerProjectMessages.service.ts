import { supabase } from "../../../../lib/supabase";
import type { CustomerProjectMessage } from "./customerProjectMessages.types";

type ProjectMessageRow = {
  id: string;
  project_request_id: string;
  sender_id: string;
  sender_type: "customer" | "admin";
  message: string;
  created_at: string;
  read_at: string | null;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const mapMessage = (row: ProjectMessageRow): CustomerProjectMessage => ({
  id: row.id,
  projectRequestId: row.project_request_id,
  senderId: row.sender_id,
  senderType: row.sender_type,
  message: row.message,
  createdAt: row.created_at,
  readAt: row.read_at,
});

export const getCustomerProjectMessages = async (
  projectRequestId: string,
): Promise<CustomerProjectMessage[]> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("project_messages")
    .select(
      `
      id,
      project_request_id,
      sender_id,
      sender_type,
      message,
      created_at,
      read_at
      `,
    )
    .eq("project_request_id", projectRequestId)
    .order("created_at", {
      ascending: true,
    })
    .returns<ProjectMessageRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapMessage);
};

export const sendCustomerProjectMessage = async (
  projectRequestId: string,
  message: string,
) => {
  const client = requireSupabase();

  const {
    data: { session },
  } = await client.auth.getSession();

  if (!session?.user?.id) {
    throw new Error("Customer session required.");
  }

  const { error } = await client.from("project_messages").insert({
    project_request_id: projectRequestId,

    sender_id: session.user.id,

    sender_type: "customer",

    message: message.trim(),
  });

  if (error) {
    throw error;
  }
};

export const markCustomerProjectMessagesAsRead = async (
  projectRequestId: string,
) => {
  const client = requireSupabase();

  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.user?.id) {
    throw new Error("Customer session required.");
  }

  const { error } = await client
    .from("project_messages")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("project_request_id", projectRequestId)
    .eq("sender_type", "admin")
    .is("read_at", null);

  if (error) {
    throw error;
  }
};
