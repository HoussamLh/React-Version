import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminTeamFormPanelProps = {
  title: string;
  description: string;
  error?: string | null;
  children: React.ReactNode;
};

export const AdminTeamFormPanel: React.FC<AdminTeamFormPanelProps> = ({
  title,
  description,
  error,
  children,
}) => {
  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.description}>{description}</p>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {children}
    </div>
  );
};

const styles = {
  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  header: {
    marginBottom: spacing.lg,
  },

  title: {
    color: colors.text.main,
    fontSize: "18px",
    lineHeight: "24px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  description: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.xs} 0 0 0`,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
    marginBottom: spacing.md,
  },
};
