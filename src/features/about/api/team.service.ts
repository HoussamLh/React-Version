import { supabase } from "../../../lib/supabase";
import type { TeamMember, TeamMemberAccent } from "../data/team.data";

type TeamMemberRow = {
  name: string;
  role: string;
  description: string;
  image_url: string;
  image_alt: string;
  hover_accent: TeamMemberAccent;
};

const mapTeamMemberRow = (row: TeamMemberRow): TeamMember => {
  return {
    name: row.name,
    role: row.role,
    description: row.description,
    image: row.image_url,
    imageAlt: row.image_alt || row.name,
    hoverAccent: row.hover_accent,
  };
};

export const getPublishedTeamMembers = async (): Promise<TeamMember[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("team_members")
    .select("name, role, description, image_url, image_alt, hover_accent")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TeamMemberRow[]).map(mapTeamMemberRow);
};
