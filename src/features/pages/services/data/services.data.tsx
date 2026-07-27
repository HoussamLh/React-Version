import type { ReactNode } from "react";

export type ServiceIcon = "code" | "smartphone" | "server" | "shield-check";

export type ServiceAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

export type Service = {
  title: string;
  text: string;
  image?: string | null;
  icon: ReactNode;
  pills?: string[];
  span?: string;
  badge?: string | null;
  monitoring?: boolean;
  hoverAccent?: ServiceAccent;
};
