import { supabase } from "../../../../lib/supabase";
import type { CustomerProjectRequest } from "../types/customerProjects.types";

type ProjectRequestRow = {
  id: string;
  customer_id: string;

  title: string;
  project_type: string;

  selected_package: string;
  package_category: string;

  budget_range: string;
  timeline: string;

  description: string;
  goals: string;

  status: "submitted" | "reviewed" | "in_progress" | "completed" | "cancelled";

  admin_notes: string;

  created_at: string;
  updated_at: string;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

const mapProjectRequest = (row: ProjectRequestRow): CustomerProjectRequest => ({
  id: row.id,
  customerId: row.customer_id,

  title: row.title,
  projectType: row.project_type,

  selectedPackage: row.selected_package,
  packageCategory: row.package_category,

  budgetRange: row.budget_range,
  timeline: row.timeline,

  description: row.description,
  goals: row.goals,

  status: row.status,

  adminNotes: row.admin_notes,

  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getCustomerProjectRequestById = async (
  id: string,
): Promise<CustomerProjectRequest> => {
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

  const { data, error } = await client
    .from("project_requests")
    .select(
      `
          id,
          customer_id,
          title,
          project_type,
          selected_package,
          package_category,
          budget_range,
          timeline,
          description,
          goals,
          status,
          admin_notes,
          created_at,
          updated_at
          `,
    )
    .eq("id", id)
    .eq("customer_id", session.user.id)
    .single<ProjectRequestRow>();

  if (error) {
    throw error;
  }

  return mapProjectRequest(data);
};
