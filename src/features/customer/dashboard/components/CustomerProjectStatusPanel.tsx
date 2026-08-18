import React from "react";
import type { CustomerProfile } from "../../auth/types/customerAuth.types";
import { colors, radius, spacing, typography } from "../../../../design-system";

type CustomerProjectStatusPanelProps = {
  profile: CustomerProfile | null;
};

export const CustomerProjectStatusPanel: React.FC<
  CustomerProjectStatusPanelProps
> = ({ profile }) => {
  return (
    <article style={styles.panel}>
      <p style={styles.panelEyebrow}>Onboarding</p>

      <h2 style={styles.panelTitle}>Project Status</h2>

      <div style={styles.statusRow}>
        <span style={styles.statusBadge}>
          {profile?.onboardingStatus || "new"}
        </span>

        <span style={styles.accountBadge}>
          {profile?.accountStatus || "active"}
        </span>
      </div>

      <p style={styles.panelText}>
        This dashboard shell confirms customer authentication is working. The
        next phases can add project requests, selected packages, onboarding
        steps, and customer messages.
      </p>
    </article>
  );
};

const styles: Record<string, React.CSSProperties> = {
  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  panelEyebrow: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: `0 0 ${spacing.sm} 0`,
  },

  panelTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: `0 0 ${spacing.md} 0`,
    fontWeight: typography.fontWeight.black,
  },

  statusRow: {
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },

  statusBadge: {
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },

  accountBadge: {
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.muted,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },

  panelText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },
};
