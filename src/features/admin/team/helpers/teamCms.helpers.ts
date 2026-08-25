import type {
  AdminTeamMember,
  AdminTeamMemberFormValues,
} from "../types/teamCms.types";

export type TeamFilter = "all" | "published" | "draft";

export const defaultTeamMemberFormValues: AdminTeamMemberFormValues = {
  name: "",
  role: "",
  description: "",
  imageUrl: "",
  imagePublicId: null,
  imageAlt: "",
  hoverAccent: "green",
  status: "draft",
  sortOrder: 0,
};

export const getTeamMemberFormValues = (
  member: AdminTeamMember,
): AdminTeamMemberFormValues => ({
  name: member.name,
  role: member.role,
  description: member.description,
  imageUrl: member.imageUrl,
  imagePublicId: member.imagePublicId,
  imageAlt: member.imageAlt,
  hoverAccent: member.hoverAccent,
  status: member.status,
  sortOrder: member.sortOrder,
});

export const filterTeamMembers = ({
  members,
  statusFilter,
  searchQuery,
}: {
  members: AdminTeamMember[];
  statusFilter: TeamFilter;
  searchQuery: string;
}) => {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return members.filter((member) => {
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    const matchesSearch =
      !normalizedSearchQuery ||
      member.name.toLowerCase().includes(normalizedSearchQuery) ||
      member.role.toLowerCase().includes(normalizedSearchQuery) ||
      member.description.toLowerCase().includes(normalizedSearchQuery);

    return matchesStatus && matchesSearch;
  });
};
