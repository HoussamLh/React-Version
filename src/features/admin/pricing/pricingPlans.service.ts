import { requireSupabase } from "../../../lib/supabase";
import type {
  AdminPricingPlan,
  AdminPricingPlanFormValues,
} from "./pricingCms.types";

type PricingPlanRow = {
  id: string;
  name: string;
  label: string;
  price: string;
  suffix: string | null;
  description: string;
  features: string[];
  cta_label: string;
  cta_to: string;
  recommended: boolean;
  status: AdminPricingPlan["status"];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const mapPricingPlanRow = (row: PricingPlanRow): AdminPricingPlan => {
  return {
    id: row.id,
    name: row.name,
    label: row.label,
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

const mapPricingPlanFormValues = (values: AdminPricingPlanFormValues) => {
  return {
    name: values.name,
    label: values.label,
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

export const getAdminPricingPlans = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("pricing_plans")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PricingPlanRow[]).map(mapPricingPlanRow);
};

export const createAdminPricingPlan = async (
  values: AdminPricingPlanFormValues,
) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("pricing_plans")
    .insert(mapPricingPlanFormValues(values))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapPricingPlanRow(data as PricingPlanRow);
};

export const updateAdminPricingPlan = async ({
  planId,
  values,
}: {
  planId: string;
  values: AdminPricingPlanFormValues;
}) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("pricing_plans")
    .update(mapPricingPlanFormValues(values))
    .eq("id", planId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapPricingPlanRow(data as PricingPlanRow);
};

export const deleteAdminPricingPlan = async (planId: string) => {
  const client = requireSupabase();

  const { error } = await client
    .from("pricing_plans")
    .delete()
    .eq("id", planId);

  if (error) {
    throw error;
  }
};
