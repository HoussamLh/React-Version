import { requireSupabase } from "../../../../lib/supabase";
import {
  cleanupAdminCloudinaryFolder,
  deleteAdminImageFromCloudinary,
  deleteAdminVideoFromCloudinary,
  getCloudinaryImagePublicId,
  getCloudinaryVideoPublicId,
} from "../../../../shared/services/cloudinaryUpload.service";
import type { AdminProject, AdminProjectFormValues } from "../types/projectsCms.types";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  text: string;
  category: AdminProject["category"];
  tags: string[];
  media_type: AdminProject["mediaType"];
  image_url: string | null;
  image_public_id: string | null;
  video_url: string | null;
  video_public_id: string | null;
  video_poster_url: string | null;
  video_poster_public_id: string | null;
  span: AdminProject["span"];
  image_height: string;
  hover_accent: AdminProject["hoverAccent"];
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
  status: AdminProject["status"];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const mapProjectRow = (row: ProjectRow): AdminProject => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  text: row.text,
  category: row.category,
  tags: row.tags ?? [],
  mediaType: row.media_type,
  imageUrl: row.image_url,
  imagePublicId: row.image_public_id,
  videoUrl: row.video_url,
  videoPublicId: row.video_public_id,
  videoPosterUrl: row.video_poster_url,
  videoPosterPublicId: row.video_poster_public_id,
  span: row.span,
  imageHeight: row.image_height,
  hoverAccent: row.hover_accent,
  demoUrl: row.demo_url,
  githubUrl: row.github_url,
  featured: row.featured,
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapProjectFormValues = (values: AdminProjectFormValues) => ({
  title: values.title,
  slug: values.slug,
  text: values.text,
  category: values.category,
  tags: values.tags,
  media_type: values.mediaType,
  image_url: values.imageUrl,
  image_public_id: values.imagePublicId,
  video_url: values.videoUrl,
  video_public_id: values.videoPublicId,
  video_poster_url: values.videoPosterUrl,
  video_poster_public_id: values.videoPosterPublicId,
  span: values.span,
  image_height: values.imageHeight,
  hover_accent: values.hoverAccent,
  demo_url: values.demoUrl,
  github_url: values.githubUrl,
  featured: values.featured,
  status: values.status,
  sort_order: values.sortOrder,
});

const getStoredPublicId = (
  mediaUrl: string | null,
  mediaPublicId: string | null,
  resourceType: "image" | "video",
) => {
  if (mediaPublicId) return mediaPublicId;
  return resourceType === "image"
    ? getCloudinaryImagePublicId(mediaUrl)
    : getCloudinaryVideoPublicId(mediaUrl);
};

const cleanupImage = async (url: string | null, publicId: string | null) => {
  const resolvedPublicId = getStoredPublicId(url, publicId, "image");
  if (!resolvedPublicId) return;

  try {
    await deleteAdminImageFromCloudinary(resolvedPublicId);
  } catch (error) {
    console.error("Could not clean up Cloudinary image:", error);
  }
};

const cleanupVideo = async (url: string | null, publicId: string | null) => {
  const resolvedPublicId = getStoredPublicId(url, publicId, "video");
  if (!resolvedPublicId) return;

  try {
    await deleteAdminVideoFromCloudinary(resolvedPublicId);
  } catch (error) {
    console.error("Could not clean up Cloudinary video:", error);
  }
};

export const getAdminProjects = async () => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as ProjectRow[]).map(mapProjectRow);
};

export const createAdminProject = async (
  values: AdminProjectFormValues,
  projectId?: string,
) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("projects")
    .insert({ ...(projectId ? { id: projectId } : {}), ...mapProjectFormValues(values) })
    .select("*")
    .single();

  if (error) throw error;
  return mapProjectRow(data as ProjectRow);
};

export const updateAdminProject = async ({
  projectId,
  values,
}: {
  projectId: string;
  values: AdminProjectFormValues;
}) => {
  const client = requireSupabase();

  const { data: previousProject, error: previousProjectError } = await client
    .from("projects")
    .select(
      "image_url, image_public_id, video_url, video_public_id, video_poster_url, video_poster_public_id",
    )
    .eq("id", projectId)
    .single();

  if (previousProjectError) throw previousProjectError;

  const { data, error } = await client
    .from("projects")
    .update(mapProjectFormValues(values))
    .eq("id", projectId)
    .select("*")
    .single();

  if (error) throw error;

  const previousImagePublicId = getStoredPublicId(
    previousProject.image_url,
    previousProject.image_public_id,
    "image",
  );
  const previousVideoPublicId = getStoredPublicId(
    previousProject.video_url,
    previousProject.video_public_id,
    "video",
  );
  const previousPosterPublicId = getStoredPublicId(
    previousProject.video_poster_url,
    previousProject.video_poster_public_id,
    "image",
  );

  if (previousImagePublicId && previousImagePublicId !== values.imagePublicId) {
    await cleanupImage(previousProject.image_url, previousImagePublicId);
  }

  if (previousVideoPublicId && previousVideoPublicId !== values.videoPublicId) {
    await cleanupVideo(previousProject.video_url, previousVideoPublicId);
  }

  if (
    previousPosterPublicId &&
    previousPosterPublicId !== values.videoPosterPublicId
  ) {
    await cleanupImage(previousProject.video_poster_url, previousPosterPublicId);
  }

  try {
    await cleanupAdminCloudinaryFolder(`devbysam/projects/${projectId}`);
  } catch (error) {
    console.error("Could not clean up empty Cloudinary project folders:", error);
  }

  return mapProjectRow(data as ProjectRow);
};

export const deleteAdminProject = async (projectId: string) => {
  const client = requireSupabase();

  const { data: project, error: projectError } = await client
    .from("projects")
    .select(
      "image_url, image_public_id, video_url, video_public_id, video_poster_url, video_poster_public_id",
    )
    .eq("id", projectId)
    .single();

  if (projectError) throw projectError;

  const { error } = await client.from("projects").delete().eq("id", projectId);
  if (error) throw error;

  await Promise.all([
    cleanupImage(project.image_url, project.image_public_id),
    cleanupVideo(project.video_url, project.video_public_id),
    cleanupImage(project.video_poster_url, project.video_poster_public_id),
  ]);

  try {
    await cleanupAdminCloudinaryFolder(`devbysam/projects/${projectId}`);
  } catch (cleanupError) {
    console.error("Could not clean up empty Cloudinary project folders:", cleanupError);
  }
};
