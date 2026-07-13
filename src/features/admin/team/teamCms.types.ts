export type AdminTeamStatus = "draft" | "published";

export type AdminTeamAccent = "green" | "blue" | "purple" | "pink";

export type AdminTeamMember = {
  id: string;

  name: string;
  role: string;
  description: string;

  imageUrl: string;
  imageAlt: string;

  hoverAccent: AdminTeamAccent;

  status: AdminTeamStatus;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};

export type AdminTeamMemberFormValues = {
  name: string;
  role: string;
  description: string;

  imageUrl: string;
  imageAlt: string;

  hoverAccent: AdminTeamAccent;

  status: AdminTeamStatus;
  sortOrder: number;
};
