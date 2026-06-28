import React from "react";
import { colors, radius } from "../../tokens";

export type CardHoverAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

type CardProps = {
  children: React.ReactNode;
  interactive?: boolean;
  hoverAccent?: CardHoverAccent;
  className?: string;
  style?: React.CSSProperties;
};

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  hoverAccent = "green",
  className = "",
  style,
}) => {
  const cardClassName = [
    "ds-card",
    interactive ? "ds-hover-card" : "",
    interactive ? `ds-hover-card-${hoverAccent}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div style={{ ...styles.card, ...style }} className={cardClassName}>
      {children}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
  },
};
