import React from "react";
import { colors, spacing, typography } from "../../../design-system";

type AdminPanelHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  isNarrow?: boolean;
};

export const AdminPanelHeader: React.FC<AdminPanelHeaderProps> = ({
  title,
  subtitle,
  actions,
  isNarrow = false,
}) => {
  return (
    <div
      style={{
        ...styles.header,
        ...(isNarrow ? styles.headerNarrow : {}),
      }}
    >
      <div>
        <h2 style={styles.title}>{title}</h2>

        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      {actions}
    </div>
  );
};

const styles = {
  header: {
    padding: spacing.lg,
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  headerNarrow: {
    alignItems: "flex-start",
  },

  title: {
    color: colors.text.main,
    fontSize: "20px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },
};
