import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminTeamStateProps = {
  isLoading: boolean;
  hasMembers: boolean;
};

export const AdminTeamState: React.FC<AdminTeamStateProps> = ({
  isLoading,
  hasMembers,
}) => {
  if (isLoading) {
    return <div style={styles.loadingBox}>Loading team members...</div>;
  }

  if (!hasMembers) {
    return (
      <div style={styles.emptyState}>
        <h2 style={styles.emptyTitle}>No team members found</h2>
        <p style={styles.emptyText}>
          Create your first team member or adjust your filters.
        </p>
      </div>
    );
  }

  return null;
};

const styles = {
  loadingBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: colors.background.dark,
    color: colors.text.muted,
    padding: spacing.lg,
    fontSize: "14px",
  },

  emptyState: {
    border: `1px dashed ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  emptyTitle: {
    color: colors.text.main,
    fontSize: "20px",
    lineHeight: "26px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
