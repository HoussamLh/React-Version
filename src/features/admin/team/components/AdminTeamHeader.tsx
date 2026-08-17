import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminTeamHeaderProps = {
  isCreateFormOpen: boolean;
  isLoading: boolean;
  onCreateToggle: () => void;
  onRefresh: () => void | Promise<void>;
};

export const AdminTeamHeader: React.FC<AdminTeamHeaderProps> = ({
  isCreateFormOpen,
  isLoading,
  onCreateToggle,
  onRefresh,
}) => {
  return (
    <div style={styles.header}>
      <div>
        <p style={styles.eyebrow} className="mono-text">
          Team CMS
        </p>

        <h1 style={styles.title}>Manage Technical Team</h1>

        <p style={styles.subtitle}>
          Add, edit, publish, and reorder team members shown on the About page.
        </p>
      </div>

      <div style={styles.actions}>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => void onRefresh()}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={onCreateToggle}
        >
          {isCreateFormOpen ? "Close Form" : "New Team Member"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  header: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    flexWrap: "wrap" as const,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
    maxWidth: "720px",
  },

  actions: {
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap" as const,
  },

  primaryButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  secondaryButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },
};
