export type TeamMemberAccent = "green" | "blue" | "purple" | "pink";

export type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  imageAlt: string;
  hoverAccent?: TeamMemberAccent;
};
