import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Card: React.FC<CardProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={{ ...styles.card, ...style }}>
      {children}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    transition:
      "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
  },
};
