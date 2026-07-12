import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminPricingStatus } from "../pricingCms.types";

type AdminPricingStatusBadgeProps = {
  status: AdminPricingStatus;
};

export const AdminPricingStatusBadge: React.FC<
  AdminPricingStatusBadgeProps
> = ({ status }) => {
  const isPublished = status === "published";

  return (
    <span
      style={{
        ...styles.badge,
        ...(isPublished ? styles.published : styles.draft),
      }}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
};

const styles = {
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: radius.pill,
    fontSize: "11px",
    lineHeight: 1,
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
  },

  published: {
    backgroundColor: "rgba(116, 245, 66, 0.12)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
  },

  draft: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${colors.border.default}`,
    color: colors.text.muted,
  },
};
