import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

type ProjectRequestsHeaderProps = {
  isFormOpen: boolean;
  onToggleForm: () => void;
};

export const ProjectRequestsHeader: React.FC<ProjectRequestsHeaderProps> = ({
  isFormOpen,
  onToggleForm,
}) => (
  <header style={styles.header}>
    <div>
      <p style={styles.eyebrow}>Project Requests</p>
      <h2 style={styles.title}>Start your project request</h2>
      <p style={styles.subtitle}>
        Submit your project details so DevBySam can review your goals, timeline,
        and package requirements.
      </p>
    </div>
    <button type="button" style={styles.primaryButton} onClick={onToggleForm}>
      {isFormOpen ? "Close Form" : "New Request"}
    </button>
  </header>
);

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.xl,
    alignItems: "flex-start",
    flexWrap: "wrap" as const,
  },
  eyebrow: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    margin: `0 0 ${spacing.sm} 0`,
  },
  title: {
    color: colors.text.main,
    fontSize: "24px",
    lineHeight: "32px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    maxWidth: "720px",
  },
  primaryButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "13px 18px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },
};
