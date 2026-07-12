import { requireSupabase } from "../../../lib/supabase";
import type { AdminService, AdminServiceFormValues } from "./servicesCms.types";

type ServiceRow = {
  id: string;

  title: string;
  slug: string;
  text: string;

  icon: AdminService["icon"];
  image_url: string | null;

  pills: string[];

  span: AdminService["span"];
  badge: string | null;
  monitoring: boolean;

  hover_accent: AdminService["hoverAccent"];

  status: AdminService["status"];
  sort_order: number;

  created_at: string;
  updated_at: string;
};

const mapServiceRow = (row: ServiceRow): AdminService => {
  return {
    id: row.id,

    title: row.title,
    slug: row.slug,
    text: row.text,

    icon: row.icon,
    imageUrl: row.image_url,

    pills: row.pills ?? [],

    span: row.span,
    badge: row.badge,
    monitoring: row.monitoring,

    hoverAccent: row.hover_accent,

    status: row.status,
    sortOrder: row.sort_order,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapServiceFormValues = (values: AdminServiceFormValues) => {
  return {
    title: values.title,
    slug: values.slug,
    text: values.text,

    icon: values.icon,
    image_url: values.imageUrl,

    pills: values.pills,

    span: values.span,
    badge: values.badge,
    monitoring: values.monitoring,

    hover_accent: values.hoverAccent,

    status: values.status,
    sort_order: values.sortOrder,
  };
};

export const getAdminServices = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ServiceRow[]).map(mapServiceRow);
};

export const createAdminService = async (values: AdminServiceFormValues) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("services")
    .insert(mapServiceFormValues(values))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapServiceRow(data as ServiceRow);
};

export const updateAdminService = async ({
  serviceId,
  values,
}: {
  serviceId: string;
  values: AdminServiceFormValues;
}) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("services")
    .update(mapServiceFormValues(values))
    .eq("id", serviceId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapServiceRow(data as ServiceRow);
};

export const deleteAdminService = async (serviceId: string) => {
  const client = requireSupabase();

  const { error } = await client.from("services").delete().eq("id", serviceId);

  if (error) {
    throw error;
  }
};
