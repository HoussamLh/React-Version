import React from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../../design-system";

type AdminDashboardQuickActionsProps = {
  isCompact: boolean;
  isNarrow: boolean;
};

export const AdminDashboardQuickActions: React.FC<
  AdminDashboardQuickActionsProps
> = ({ isCompact, isNarrow }) => {
  return (
    <section
      style={{
        ...styles.container,
        ...(isCompact ? styles.containerCompact : {}),
      }}
    >
      <div style={styles.content}>
        <h3 style={styles.title}>Quick actions</h3>
        <p style={styles.subtitle}>
          Jump directly to the admin tools you use most.
        </p>
      </div>

      <div
        style={{
          ...styles.links,
          ...(isNarrow ? styles.linksNarrow : {}),
        }}
      >
        <Link
          to="/admin/chat"
          style={{
            ...styles.primaryLink,
            ...(isNarrow ? styles.linkNarrow : {}),
          }}
        >
          Open chat inbox
        </Link>

        <Link
          to="/admin/contacts"
          style={{
            ...styles.secondaryLink,
            ...(isNarrow ? styles.linkNarrow : {}),
          }}
        >
          Review contact submissions
        </Link>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.xl,
  },

  containerCompact: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  content: {
    minWidth: 0,
  },

  title: {
    color: colors.text.main,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.xs} 0 0 0`,
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    flexWrap: "wrap",
  },

  linksNarrow: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  primaryLink: {
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `12px ${spacing.lg}`,
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: typography.fontWeight.black,
    textAlign: "center",
  },

  secondaryLink: {
    borderRadius: radius.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: "transparent",
    color: colors.text.main,
    padding: `12px ${spacing.lg}`,
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
  },

  linkNarrow: {
    width: "100%",
    boxSizing: "border-box",
  },
};
