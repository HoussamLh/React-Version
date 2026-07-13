import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminPricingSectionPanelProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
};

export const AdminPricingSectionPanel: React.FC<
  AdminPricingSectionPanelProps
> = ({ title, subtitle, actionLabel, onAction, children }) => {
  return (
    <section style={styles.panel}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{title}</h2>

          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>

        {actionLabel && onAction && (
          <button type="button" style={styles.actionButton} onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>

      {children}
    </section>
  );
};

const styles = {
  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    marginBottom: spacing.xl,
    flexWrap: "wrap" as const,
  },

  title: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.xs} 0 0 0`,
    maxWidth: "720px",
  },

  actionButton: {
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
