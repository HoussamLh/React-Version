import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

interface AdminServicesHeaderProps {
  isCreateFormOpen: boolean;
  isLoading: boolean;
  onCreateToggle: () => void;
  onRefresh: () => void;
}

export const AdminServicesHeader: React.FC<AdminServicesHeaderProps> = ({
  isCreateFormOpen,
  isLoading,
  onCreateToggle,
  onRefresh,
}) => {
  return (
    <div style={styles.header}>
      <div>
        <p style={styles.eyebrow}>Admin CMS</p>

        <h1 style={styles.title}>Services</h1>

        <p style={styles.subtitle}>
          Manage service cards, icons, images, pills, layout spans, badges,
          monitoring status, and publish visibility.
        </p>
      </div>

      <div style={styles.headerActions}>
        <button
          type="button"
          style={styles.createButton}
          onClick={onCreateToggle}
        >
          {isCreateFormOpen ? "Close Form" : "New Service"}
        </button>

        <button type="button" style={styles.refreshButton} onClick={onRefresh}>
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.xl,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 0,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "32px",
    lineHeight: "40px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    maxWidth: "720px",
    margin: `${spacing.sm} 0 0 0`,
  },

  createButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontWeight: typography.fontWeight.bold,
  },

  refreshButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontWeight: typography.fontWeight.bold,
  },
};
