import React from "react";
import { colors, radius } from "../../../design-system";

type AdminStatusBadgeTone = "success" | "warning" | "muted";

type AdminStatusBadgeProps = {
  children: React.ReactNode;
  tone?: AdminStatusBadgeTone;
};

const getToneStyle = (tone: AdminStatusBadgeTone) => {
  if (tone === "warning") {
    return styles.warning;
  }

  if (tone === "muted") {
    return styles.muted;
  }

  return styles.success;
};

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  children,
  tone = "success",
}) => {
  return (
    <span
      style={{
        ...styles.base,
        ...getToneStyle(tone),
      }}
    >
      {children}
    </span>
  );
};

const styles = {
  base: {
    borderRadius: radius.pill,
    padding: "5px 9px",
    fontSize: "11px",
    textTransform: "capitalize" as const,
    whiteSpace: "nowrap" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  success: {
    color: colors.accent.green,
    border: `1px solid rgba(147, 220, 92, 0.35)`,
    backgroundColor: "transparent",
  },

  warning: {
    color: colors.accent.yellow,
    border: `1px solid rgba(255, 210, 122, 0.35)`,
    backgroundColor: "rgba(255, 210, 122, 0.08)",
  },

  muted: {
    color: colors.text.muted,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
};
