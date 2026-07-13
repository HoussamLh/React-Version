import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminPricingEmptyStateProps = {
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const AdminPricingEmptyState: React.FC<AdminPricingEmptyStateProps> = ({
  title,
  text,
  actionLabel,
  onAction,
}) => {
  return (
    <div style={styles.emptyState}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.text}>{text}</p>

      {actionLabel && onAction && (
        <button type="button" style={styles.button} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

const styles = {
  emptyState: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.xl,
    padding: spacing.xl,
    textAlign: "center" as const,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },

  title: {
    color: colors.text.main,
    fontSize: "18px",
    lineHeight: "24px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  text: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },

  button: {
    marginTop: spacing.md,
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },
};
