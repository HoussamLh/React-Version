import React from "react";
import { colors, radius, typography } from "../../../design-system";

type AdminCountBadgeVariant = "circle" | "pill";

type AdminCountBadgeProps = {
  count: number;
  variant?: AdminCountBadgeVariant;
};

export const AdminCountBadge: React.FC<AdminCountBadgeProps> = ({
  count,
  variant = "pill",
}) => {
  return (
    <span
      style={{
        ...styles.base,
        ...(variant === "circle" ? styles.circle : styles.pill),
      }}
    >
      {count}
    </span>
  );
};

const styles = {
  base: {
    borderRadius: radius.pill,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  circle: {
    minWidth: "28px",
    height: "28px",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  pill: {
    padding: "4px 9px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },
};
