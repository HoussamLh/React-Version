import { requireSupabase } from "../../../lib/supabase";
import type {
  AdminComparisonRow,
  AdminComparisonRowFormValues,
} from "./pricingCms.types";

type ComparisonRowRecord = {
  id: string;
  feature: string;
  standard: string;
  advanced: string;
  premium: string;
  status: AdminComparisonRow["status"];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const mapComparisonRow = (row: ComparisonRowRecord): AdminComparisonRow => {
  return {
    id: row.id,
    feature: row.feature,
    standard: row.standard,
    advanced: row.advanced,
    premium: row.premium,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapComparisonRowFormValues = (values: AdminComparisonRowFormValues) => {
  return {
    feature: values.feature,
    standard: values.standard,
    advanced: values.advanced,
    premium: values.premium,
    status: values.status,
    sort_order: values.sortOrder,
  };
};

export const getAdminComparisonRows = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("comparison_rows")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ComparisonRowRecord[]).map(mapComparisonRow);
};

export const createAdminComparisonRow = async (
  values: AdminComparisonRowFormValues,
) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("comparison_rows")
    .insert(mapComparisonRowFormValues(values))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapComparisonRow(data as ComparisonRowRecord);
};

export const updateAdminComparisonRow = async ({
  rowId,
  values,
}: {
  rowId: string;
  values: AdminComparisonRowFormValues;
}) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("comparison_rows")
    .update(mapComparisonRowFormValues(values))
    .eq("id", rowId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapComparisonRow(data as ComparisonRowRecord);
};

export const deleteAdminComparisonRow = async (rowId: string) => {
  const client = requireSupabase();

  const { error } = await client
    .from("comparison_rows")
    .delete()
    .eq("id", rowId);

  if (error) {
    throw error;
  }
};
