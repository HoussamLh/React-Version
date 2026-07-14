import { requireSupabase } from "../../../lib/supabase";
import type {
  CustomerProjectRequest,
  CustomerProjectRequestFormValues,
} from "./projectRequests.types";

type ProjectRequestRow = {
  id: string;
  customer_id: string;

  title: string;
  project_type: CustomerProjectRequest["projectType"];

  selected_package: string;
  package_category: CustomerProjectRequest["packageCategory"];

  budget_range: string;
  timeline: string;

  description: string;
  goals: string;

  status: CustomerProjectRequest["status"];
  admin_notes: string;

  created_at: string;
  updated_at: string;
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
  updated_at
`;

const mapProjectRequestRow = (
  row: ProjectRequestRow,
): CustomerProjectRequest => {
  return {
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
  };
};

const mapProjectRequestFormValues = (
  values: CustomerProjectRequestFormValues,
) => {
  return {
    title: values.title.trim(),
    project_type: values.projectType,

    selected_package: values.selectedPackage.trim(),
    package_category: values.packageCategory,

    budget_range: values.budgetRange.trim(),
    timeline: values.timeline.trim(),

    description: values.description.trim(),
    goals: values.goals.trim(),
  };
};

const getCurrentCustomerId = async () => {
  const client = requireSupabase();

  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user?.id) {
    throw new Error("Customer session is required.");
  }

  return session.user.id;
};

export const getCustomerProjectRequests = async () => {
  const client = requireSupabase();
  const customerId = await getCurrentCustomerId();

  const { data, error } = await client
    .from("project_requests")
    .select(projectRequestSelectFields)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProjectRequestRow[]).map(mapProjectRequestRow);
};

export const createCustomerProjectRequest = async (
  values: CustomerProjectRequestFormValues,
) => {
  const client = requireSupabase();
  const customerId = await getCurrentCustomerId();

  const { data, error } = await client
    .from("project_requests")
    .insert({
      customer_id: customerId,
      ...mapProjectRequestFormValues(values),
      status: "submitted",
    })
    .select(projectRequestSelectFields)
    .single<ProjectRequestRow>();

  if (error) {
    throw error;
  }

  return mapProjectRequestRow(data);
};

export const updateCustomerProjectRequest = async ({
  requestId,
  values,
}: {
  requestId: string;
  values: CustomerProjectRequestFormValues;
}) => {
  const client = requireSupabase();
  const customerId = await getCurrentCustomerId();

  const { data, error } = await client
    .from("project_requests")
    .update(mapProjectRequestFormValues(values))
    .eq("id", requestId)
    .eq("customer_id", customerId)
    .eq("status", "submitted")
    .select(projectRequestSelectFields)
    .single<ProjectRequestRow>();

  if (error) {
    throw error;
  }

  return mapProjectRequestRow(data);
};
