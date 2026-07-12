import { requireSupabase } from "../../../lib/supabase";
import type {
  AdminEmergencyRestoration,
  AdminEmergencyRestorationFormValues,
} from "./pricingCms.types";

type EmergencyRestorationRow = {
  id: string;
  title: string;
  price: string;
  suffix: string;
  text: string;
  status: AdminEmergencyRestoration["status"];
  created_at: string;
  updated_at: string;
};

const mapEmergencyRestorationRow = (
  row: EmergencyRestorationRow,
): AdminEmergencyRestoration => {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    suffix: row.suffix,
    text: row.text,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapEmergencyRestorationFormValues = (
  values: AdminEmergencyRestorationFormValues,
) => {
  return {
    title: values.title,
    price: values.price,
    suffix: values.suffix,
    text: values.text,
    status: values.status,
  };
};

export const getAdminEmergencyRestorations = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("emergency_restoration")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as EmergencyRestorationRow[]).map(
    mapEmergencyRestorationRow,
  );
};

export const createAdminEmergencyRestoration = async (
  values: AdminEmergencyRestorationFormValues,
) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("emergency_restoration")
    .insert(mapEmergencyRestorationFormValues(values))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapEmergencyRestorationRow(data as EmergencyRestorationRow);
};

export const updateAdminEmergencyRestoration = async ({
  restorationId,
  values,
}: {
  restorationId: string;
  values: AdminEmergencyRestorationFormValues;
}) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("emergency_restoration")
    .update(mapEmergencyRestorationFormValues(values))
    .eq("id", restorationId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapEmergencyRestorationRow(data as EmergencyRestorationRow);
};

export const deleteAdminEmergencyRestoration = async (
  restorationId: string,
) => {
  const client = requireSupabase();

  const { error } = await client
    .from("emergency_restoration")
    .delete()
    .eq("id", restorationId);

  if (error) {
    throw error;
  }
};
