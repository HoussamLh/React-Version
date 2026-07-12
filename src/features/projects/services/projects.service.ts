import { supabase } from "../../../lib/supabase";
import type {
  Project,
  ProjectAccent,
  ProjectMediaType,
} from "../data/projects.data";

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  text: string;
  tags: string[];
  media_type: ProjectMediaType;
  image_url: string | null;
  video_url: string | null;
  video_poster_url: string | null;
  span: string;
  image_height: string;
  hover_accent: ProjectAccent;
};

const mapProjectRow = (row: ProjectRow): Project => {
  const previewImage =
    row.media_type === "video"
      ? (row.video_poster_url ?? row.image_url)
      : row.image_url;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    text: row.text,
    image: previewImage,
    videoUrl: row.video_url,
    videoPosterUrl: row.video_poster_url,
    mediaType: row.media_type,
    tags: row.tags ?? [],
    span: row.span,
    imageHeight: row.image_height,
    hoverAccent: row.hover_accent,
  };
};

export const getPublishedProjects = async (): Promise<Project[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, text, tags, media_type, image_url, video_url, video_poster_url, span, image_height, hover_accent",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProjectRow[]).map(mapProjectRow);
};
