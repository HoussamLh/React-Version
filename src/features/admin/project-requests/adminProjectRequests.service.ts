import { requireSupabase } from "../../../lib/supabase";
import type {
  AdminProjectRequest,
  AdminProjectRequestUpdateValues,
} from "./adminProjectRequests.types";

type ProjectRequestRow = {
  id: string;
  customer_id: string;

  title: string;
  project_type: AdminProjectRequest["projectType"];

  selected_package: string;
  package_category: AdminProjectRequest["packageCategory"];

  budget_range: string;
  timeline: string;

  description: string;
  goals: string;

  status: AdminProjectRequest["status"];
  admin_notes: string;

  created_at: string;
  updated_at: string;

  customer_profiles:
    | {
        email: string;
        full_name: string;
        company_name: string;
        phone: string;
      }
    | {
        email: string;
        full_name: string;
        company_name: string;
        phone: string;
      }[]
    | null;
};

const projectRequestSelectFields = `
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
  updated_at,
  customer_profiles (
    email,
    full_name,
    company_name,
    phone
  )
`;

const getCustomerProfile = (row: ProjectRequestRow) => {
  if (Array.isArray(row.customer_profiles)) {
    return row.customer_profiles[0] ?? null;
  }

  return row.customer_profiles;
};

const mapProjectRequestRow = (row: ProjectRequestRow): AdminProjectRequest => {
  const customerProfile = getCustomerProfile(row);

  return {
    id: row.id,
    customerId: row.customer_id,

    customerEmail: customerProfile?.email ?? "",
    customerName: customerProfile?.full_name ?? "",
    customerCompany: customerProfile?.company_name ?? "",
    customerPhone: customerProfile?.phone ?? "",

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
  };
};

export const getAdminProjectRequests = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("project_requests")
    .select(projectRequestSelectFields)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProjectRequestRow[]).map(mapProjectRequestRow);
};

export const updateAdminProjectRequest = async ({
  requestId,
  values,
}: {
  requestId: string;
  values: AdminProjectRequestUpdateValues;
}) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("project_requests")
    .update({
      status: values.status,
      admin_notes: values.adminNotes,
    })
    .eq("id", requestId)
    .select(projectRequestSelectFields)
    .single<ProjectRequestRow>();

  if (error) {
    throw error;
  }

  return mapProjectRequestRow(data);
};

export const deleteAdminProjectRequest = async (requestId: string) => {
  const client = requireSupabase();

  const { error } = await client
    .from("project_requests")
    .delete()
    .eq("id", requestId);

  if (error) {
    throw error;
  }
};
