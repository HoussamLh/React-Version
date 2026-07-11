import { requireSupabase } from "../../../lib/supabase";
import type { AdminProject, AdminProjectFormValues } from "./projectsCms.types";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  text: string;

  category: AdminProject["category"];
  tags: string[];

  media_type: AdminProject["mediaType"];
  image_url: string | null;
  video_url: string | null;
  video_poster_url: string | null;

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

const mapProjectRow = (row: ProjectRow): AdminProject => {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    text: row.text,

    category: row.category,
    tags: row.tags ?? [],

    mediaType: row.media_type,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    videoPosterUrl: row.video_poster_url,

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
  };
};

const mapProjectFormValues = (values: AdminProjectFormValues) => {
  return {
    title: values.title,
    slug: values.slug,
    text: values.text,

    category: values.category,
    tags: values.tags,

    media_type: values.mediaType,
    image_url: values.imageUrl,
    video_url: values.videoUrl,
    video_poster_url: values.videoPosterUrl,

    span: values.span,
    image_height: values.imageHeight,
    hover_accent: values.hoverAccent,

    demo_url: values.demoUrl,
    github_url: values.githubUrl,

    featured: values.featured,
    status: values.status,
    sort_order: values.sortOrder,
  };
};

export const getAdminProjects = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProjectRow[]).map(mapProjectRow);
};

export const createAdminProject = async (values: AdminProjectFormValues) => {
  const client = requireSupabase();

  const { data, error } = await client
    .from("projects")
    .insert(mapProjectFormValues(values))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

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

  const { data, error } = await client
    .from("projects")
    .update(mapProjectFormValues(values))
    .eq("id", projectId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapProjectRow(data as ProjectRow);
};

export const deleteAdminProject = async (projectId: string) => {
  const client = requireSupabase();

  const { error } = await client.from("projects").delete().eq("id", projectId);

  if (error) {
    throw error;
  }
};
