import { requireSupabase } from "../../../../lib/supabase";
import type { ProjectActivity } from "./projectActivity.types";

type ProjectActivityRow = {
  id: string;
  project_request_id: string;
  type: string;
  message: string;
  created_at: string;
};

const mapActivity = (row: ProjectActivityRow): ProjectActivity => ({
  id: row.id,
  projectRequestId: row.project_request_id,
  type: row.type,
  message: row.message,
  createdAt: row.created_at,
});

export const getProjectActivities = async (
  projectRequestId: string,
): Promise<ProjectActivity[]> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("project_activities")
    .select(
      `
      id,
      project_request_id,
      type,
      message,
      created_at
      `,
    )
    .eq("project_request_id", projectRequestId)
    .order("created_at", {
      ascending: true,
    })
    .returns<ProjectActivityRow[]>();

  if (error) {
    throw error;
  }

  return data.map(mapActivity);
};
