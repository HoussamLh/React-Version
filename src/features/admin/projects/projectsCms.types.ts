export type ProjectMediaType = "image" | "video";

export type ProjectStatus = "draft" | "published";

export type ProjectAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

export type ProjectSpan = "span 4" | "span 6" | "span 8" | "span 12";

export type ProjectCategory =
  | "web"
  | "mobile"
  | "backend"
  | "branding"
  | "fullstack"
  | "saas"
  | "uiux";

export type AdminProject = {
  id: string;
  title: string;
  slug: string;
  text: string;

  category: ProjectCategory;
  tags: string[];

  mediaType: ProjectMediaType;
  imageUrl: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;

  span: ProjectSpan;
  imageHeight: string;
  hoverAccent: ProjectAccent;

  demoUrl: string | null;
  githubUrl: string | null;

  featured: boolean;
  status: ProjectStatus;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};

export type AdminProjectFormValues = {
  title: string;
  slug: string;
  text: string;

  category: ProjectCategory;
  tags: string[];

  mediaType: ProjectMediaType;
  imageUrl: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;

  span: ProjectSpan;
  imageHeight: string;
  hoverAccent: ProjectAccent;

  demoUrl: string | null;
  githubUrl: string | null;

  featured: boolean;
  status: ProjectStatus;
  sortOrder: number;
};
