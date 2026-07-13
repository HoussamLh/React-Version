import { requireSupabase } from "../../../lib/supabase";
import type {
  AdminTeamMember,
  AdminTeamMemberFormValues,
} from "./teamCms.types";

type TeamMemberRow = {
  id: string;

  name: string;
  role: string;
  description: string;

  image_url: string;
  image_alt: string;

  hover_accent: AdminTeamMember["hoverAccent"];

  status: AdminTeamMember["status"];
  sort_order: number;

  created_at: string;
  updated_at: string;
};

const mapTeamMemberRow = (row: TeamMemberRow): AdminTeamMember => {
  return {
    id: row.id,

    name: row.name,
    role: row.role,
    description: row.description,

    imageUrl: row.image_url,
    imageAlt: row.image_alt,

    hoverAccent: row.hover_accent,

    status: row.status,
    sortOrder: row.sort_order,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapTeamMemberFormValues = (values: AdminTeamMemberFormValues) => {
  return {
    name: values.name,
    role: values.role,
    description: values.description,

    image_url: values.imageUrl,
    image_alt: values.imageAlt,

    hover_accent: values.hoverAccent,

    status: values.status,
    sort_order: values.sortOrder,
  };
};

export const getAdminTeamMembers = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TeamMemberRow[]).map(mapTeamMemberRow);
};

export const createAdminTeamMember = async (
  values: AdminTeamMemberFormValues,
) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("team_members")
    .insert(mapTeamMemberFormValues(values))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapTeamMemberRow(data as TeamMemberRow);
};

export const updateAdminTeamMember = async ({
  memberId,
  values,
}: {
  memberId: string;
  values: AdminTeamMemberFormValues;
}) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("team_members")
    .update(mapTeamMemberFormValues(values))
    .eq("id", memberId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapTeamMemberRow(data as TeamMemberRow);
};

export const deleteAdminTeamMember = async (memberId: string) => {
  const client = requireSupabase();

  const { error } = await client
    .from("team_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    throw error;
  }
};
