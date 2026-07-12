export type ProjectAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

export type ProjectMediaType = "image" | "video";

export type Project = {
  id?: string;
  slug?: string;
  title: string;
  text: string;
  image?: string | null;
  videoUrl?: string | null;
  videoPosterUrl?: string | null;
  mediaType?: ProjectMediaType;
  demoUrl?: string | null;
  githubUrl?: string | null;
  tags: string[];
  span: string;
  imageHeight: string;
  hoverAccent: ProjectAccent;
};
