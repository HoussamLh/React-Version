import React from "react";

type CardHoverAccent = "green" | "blue" | "purple" | "pink";

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
    <div style={style} className={cardClassName}>
      {children}
    </div>
  );
};
