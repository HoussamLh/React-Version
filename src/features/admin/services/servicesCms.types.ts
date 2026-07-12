export type ServiceIcon = "code" | "smartphone" | "server" | "shield-check";

export type ServiceSpan = "span 1" | "span 2";

export type ServiceStatus = "draft" | "published";

export type ServiceAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

export type AdminService = {
  id: string;

  title: string;
  slug: string;
  text: string;

  icon: ServiceIcon;
  imageUrl: string | null;

  pills: string[];

  span: ServiceSpan;
  badge: string | null;
  monitoring: boolean;

  hoverAccent: ServiceAccent;

  status: ServiceStatus;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};

export type AdminServiceFormValues = {
  title: string;
  slug: string;
  text: string;

  icon: ServiceIcon;
  imageUrl: string | null;

  pills: string[];

  span: ServiceSpan;
  badge: string | null;
  monitoring: boolean;

  hoverAccent: ServiceAccent;

  status: ServiceStatus;
  sortOrder: number;
};
