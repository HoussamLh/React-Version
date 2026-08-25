import { requireSupabase } from "../../../../lib/supabase";
import {
  cleanupAdminCloudinaryFolder,
  deleteAdminImageFromCloudinary,
  getCloudinaryImagePublicId,
} from "../../../../shared/services/cloudinaryUpload.service";
import type {
  AdminTeamMember,
  AdminTeamMemberFormValues,
} from "../types/teamCms.types";

type TeamMemberRow = {
  id: string;

  name: string;
  role: string;
  description: string;

  image_url: string;
  image_public_id: string | null;
  image_alt: string;

  hover_accent: AdminTeamMember["hoverAccent"];

  status: AdminTeamMember["status"];
  sort_order: number;

  created_at: string;
  updated_at: string;
};

const mapTeamMemberRow = (row: TeamMemberRow): AdminTeamMember => ({
  id: row.id,

  name: row.name,
  role: row.role,
  description: row.description,

  imageUrl: row.image_url,
  imagePublicId: row.image_public_id,
  imageAlt: row.image_alt,

  hoverAccent: row.hover_accent,

  status: row.status,
  sortOrder: row.sort_order,

  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapTeamMemberFormValues = (values: AdminTeamMemberFormValues) => ({
  name: values.name,
  role: values.role,
  description: values.description,

  image_url: values.imageUrl,
  image_public_id: values.imagePublicId,
  image_alt: values.imageAlt,

  hover_accent: values.hoverAccent,

  status: values.status,
  sort_order: values.sortOrder,
});

const getStoredImagePublicId = (
  imageUrl: string | null,
  imagePublicId: string | null,
) => imagePublicId || getCloudinaryImagePublicId(imageUrl);

const cleanupTeamImage = async (
  imageUrl: string | null,
  imagePublicId: string | null,
) => {
  const resolvedPublicId = getStoredImagePublicId(imageUrl, imagePublicId);

  if (!resolvedPublicId) return;

  try {
    await deleteAdminImageFromCloudinary(resolvedPublicId);
  } catch (error) {
    // Asset cleanup should not make an otherwise successful CMS mutation fail.
    console.error("Could not clean up Cloudinary team image:", error);
  }
};

const cleanupTeamFolder = async (memberId: string) => {
  try {
    await cleanupAdminCloudinaryFolder(`devbysam/team/${memberId}`);
  } catch (error) {
    // Folder cleanup is best-effort. Asset deletion remains the critical action.
    console.error("Could not clean up empty Cloudinary team folders:", error);
  }
};

export const getAdminTeamMembers = async (): Promise<AdminTeamMember[]> => {
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
  memberId?: string,
): Promise<AdminTeamMember> => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("team_members")
    .insert({
      ...(memberId ? { id: memberId } : {}),
      ...mapTeamMemberFormValues(values),
    })
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
}): Promise<AdminTeamMember> => {
  const client = requireSupabase();

  const { data: previousMember, error: previousMemberError } = await client
    .from("team_members")
    .select("image_url, image_public_id")
    .eq("id", memberId)
    .single();

  if (previousMemberError) {
    throw previousMemberError;
  }

  const { data, error } = await client
    .from("team_members")
    .update(mapTeamMemberFormValues(values))
    .eq("id", memberId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const previousImagePublicId = getStoredImagePublicId(
    previousMember.image_url,
    previousMember.image_public_id,
  );

  if (previousImagePublicId && previousImagePublicId !== values.imagePublicId) {
    await cleanupTeamImage(
      previousMember.image_url,
      previousImagePublicId,
    );
  }

  await cleanupTeamFolder(memberId);

  return mapTeamMemberRow(data as TeamMemberRow);
};

export const deleteAdminTeamMember = async (memberId: string) => {
  const client = requireSupabase();

  const { data: member, error: memberError } = await client
    .from("team_members")
    .select("image_url, image_public_id")
    .eq("id", memberId)
    .single();

  if (memberError) {
    throw memberError;
  }

  const { error } = await client
    .from("team_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    throw error;
  }

  await cleanupTeamImage(member.image_url, member.image_public_id);
  await cleanupTeamFolder(memberId);
};
