import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminProjectRequestHeaderProps = {
  onRefresh: () => void;
};

export const AdminProjectRequestHeader: React.FC<
  AdminProjectRequestHeaderProps
> = ({ onRefresh }) => {
  return (
    <header style={styles.header}>
      <div>
        <p style={styles.eyebrow}>Customer Requests</p>

        <h1 style={styles.title}>Project Requests</h1>

        <p style={styles.subtitle}>
          Review customer project requests, update their status, and keep
          internal admin notes.
        </p>
      </div>

      <button type="button" style={styles.secondaryButton} onClick={onRefresh}>
        Refresh
      </button>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    flexWrap: "wrap",
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
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

  secondaryButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
