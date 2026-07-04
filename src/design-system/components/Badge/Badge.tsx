import React from "react";

export type BadgeAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

type BadgeProps = {
  children: React.ReactNode;
  accent?: BadgeAccent;
  className?: string;
  style?: React.CSSProperties;
};

const accentColors: Record<BadgeAccent, string> = {
  green: "var(--accent-green)",
  blue: "var(--accent-blue)",
  purple: "var(--accent-purple)",
  pink: "var(--accent-pink)",
  yellow: "var(--accent-yellow)",
  cyan: "var(--accent-cyan)",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  accent = "green",
  className = "",
  style,
}) => {
  const accentColor = accentColors[accent];

  return (
    <span
      className={["ds-badge", "mono-text", className].filter(Boolean).join(" ")}
      style={{
        color: accentColor,
        borderColor: accentColor,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
