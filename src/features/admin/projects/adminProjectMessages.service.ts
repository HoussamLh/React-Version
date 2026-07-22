import { supabase } from "../../../lib/supabase";

export type AdminProjectMessage = {
  id: string;
  projectRequestId: string;
  senderId: string;
  senderType: "customer" | "admin";
  message: string;
  createdAt: string;
};


type ProjectMessageRow = {
  id: string;
  project_request_id: string;
  sender_id: string;
  sender_type: "customer" | "admin";
  message: string;
  created_at: string;
};


const requireSupabase = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured.",
    );
  }

  return supabase;
};


const mapMessage = (
  row: ProjectMessageRow,
): AdminProjectMessage => ({
  id: row.id,

  projectRequestId:
    row.project_request_id,

  senderId:
    row.sender_id,

  senderType:
    row.sender_type,

  message:
    row.message,

  createdAt:
    row.created_at,
});


export const getAdminProjectMessages =
async (
  projectRequestId: string,
): Promise<AdminProjectMessage[]> => {

  const client =
    requireSupabase();


  const {
    data,
    error,
  } =
    await client
      .from("project_messages")
      .select(
        `
        id,
        project_request_id,
        sender_id,
        sender_type,
        message,
        created_at
        `,
      )
      .eq(
        "project_request_id",
        projectRequestId,
      )
      .order(
        "created_at",
        {
          ascending: true,
        },
      )
      .returns<ProjectMessageRow[]>();


  if (error) {
    throw error;
  }


  return data.map(mapMessage);
};



export const sendAdminProjectMessage =
async (
  projectRequestId: string,
  message: string,
) => {

  const client =
    requireSupabase();


  const {
    data:{
      session,
    },
  } =
    await client.auth.getSession();


  if (!session?.user?.id) {
    throw new Error(
      "Admin session required.",
    );
  }


  const {
    error,
  } =
    await client
      .from("project_messages")
      .insert({
        project_request_id:
          projectRequestId,

        sender_id:
          session.user.id,

        sender_type:
          "admin",

        message:
          message.trim(),
      });


  if (error) {
    throw error;
  }
};