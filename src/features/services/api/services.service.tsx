import { Code, Server, ShieldCheck, Smartphone } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type {
  Service,
  ServiceAccent,
  ServiceIcon,
} from "../data/services.data";

type ServiceRow = {
  title: string;
  slug: string;
  text: string;
  icon: ServiceIcon;
  image_url: string | null;
  pills: string[];
  span: string;
  badge: string | null;
  monitoring: boolean;
  hover_accent: ServiceAccent;
};

const accentColorMap: Record<ServiceAccent, string> = {
  green: "var(--accent-green)",
  blue: "var(--accent-blue)",
  purple: "var(--accent-purple)",
  pink: "var(--accent-pink)",
  yellow: "var(--accent-yellow)",
  cyan: "var(--accent-cyan)",
};

const getServiceIcon = (icon: ServiceIcon, accent: ServiceAccent) => {
  const iconColor = accentColorMap[accent];

  if (icon === "smartphone") {
    return <Smartphone size={32} color={iconColor} />;
  }

  if (icon === "server") {
    return <Server size={32} color={iconColor} />;
  }

  if (icon === "shield-check") {
    return <ShieldCheck size={32} color={iconColor} />;
  }

  return <Code size={32} color={iconColor} />;
};

const mapServiceRow = (row: ServiceRow): Service => {
  return {
    title: row.title,
    text: row.text,
    image: row.image_url,
    icon: getServiceIcon(row.icon, row.hover_accent),
    pills: row.pills ?? [],
    span: row.span,
    badge: row.badge,
    monitoring: row.monitoring,
    hoverAccent: row.hover_accent,
  };
};

export const getPublishedServices = async (): Promise<Service[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("services")
    .select(
      "title, slug, text, icon, image_url, pills, span, badge, monitoring, hover_accent",
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ServiceRow[]).map(mapServiceRow);
};
