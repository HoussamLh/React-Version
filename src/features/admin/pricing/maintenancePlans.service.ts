import { requireSupabase } from "../../../lib/supabase";
import type {
  AdminMaintenancePlan,
  AdminMaintenancePlanFormValues,
} from "./pricingCms.types";

type MaintenancePlanRow = {
  id: string;
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  cta_label: string;
  cta_to: string;
  recommended: boolean;
  status: AdminMaintenancePlan["status"];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const mapMaintenancePlanRow = (
  row: MaintenancePlanRow,
): AdminMaintenancePlan => {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    suffix: row.suffix,
    description: row.description,
    features: row.features ?? [],
    ctaLabel: row.cta_label,
    ctaTo: row.cta_to,
    recommended: row.recommended,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapMaintenancePlanFormValues = (
  values: AdminMaintenancePlanFormValues,
) => {
  return {
    name: values.name,
    price: values.price,
    suffix: values.suffix,
    description: values.description,
    features: values.features,
    cta_label: values.ctaLabel,
    cta_to: values.ctaTo,
    recommended: values.recommended,
    status: values.status,
    sort_order: values.sortOrder,
  };
};

export const getAdminMaintenancePlans = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("maintenance_plans")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as MaintenancePlanRow[]).map(mapMaintenancePlanRow);
};

export const createAdminMaintenancePlan = async (
  values: AdminMaintenancePlanFormValues,
) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("maintenance_plans")
    .insert(mapMaintenancePlanFormValues(values))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapMaintenancePlanRow(data as MaintenancePlanRow);
};

export const updateAdminMaintenancePlan = async ({
  planId,
  values,
}: {
  planId: string;
  values: AdminMaintenancePlanFormValues;
}) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("maintenance_plans")
    .update(mapMaintenancePlanFormValues(values))
    .eq("id", planId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapMaintenancePlanRow(data as MaintenancePlanRow);
};

export const deleteAdminMaintenancePlan = async (planId: string) => {
  const client = requireSupabase();

  const { error } = await client
    .from("maintenance_plans")
    .delete()
    .eq("id", planId);

  if (error) {
    throw error;
  }
};
