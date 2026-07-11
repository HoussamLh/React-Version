import React from "react";
import { Link } from "react-router-dom";
import { colors, spacing, typography } from "../../../design-system";

type AdminEmptyStateProps = {
  title: string;
  text: string;
  actionLabel?: string;
  actionTo?: string;
};

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  text,
  actionLabel,
  actionTo,
}) => {
  return (
    <div style={styles.emptyState}>
      <h4 style={styles.emptyTitle}>{title}</h4>

      <p style={styles.emptyText}>{text}</p>

      {actionLabel && actionTo && (
        <Link to={actionTo} style={styles.emptyLink}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

const styles = {
  emptyState: {
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "16px",
    fontWeight: typography.fontWeight.black,
    margin: `0 0 ${spacing.sm} 0`,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `0 0 ${spacing.md} 0`,
  },

  emptyLink: {
    color: colors.accent.green,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
