import React from "react";
import { colors, spacing, typography } from "../../../design-system";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  isCompact?: boolean;
  isNarrow?: boolean;
};

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
  isCompact = false,
  isNarrow = false,
}) => {
  return (
    <header
      style={{
        ...styles.header,
        ...(isCompact ? styles.headerCompact : {}),
      }}
    >
      <div style={styles.headerContent}>
        {eyebrow && <p style={styles.eyebrow}>{eyebrow}</p>}

        <h2
          style={{
            ...styles.title,
            ...(isNarrow ? styles.titleNarrow : {}),
          }}
        >
          {title}
        </h2>

        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      {actions}
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.xl,
  },

  headerCompact: {
    flexDirection: "column" as const,
    gap: spacing.md,
  },

  headerContent: {
    minWidth: 0,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "32px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  titleNarrow: {
    fontSize: "28px",
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "15px",
    lineHeight: "24px",
    maxWidth: "680px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
