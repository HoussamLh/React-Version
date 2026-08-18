import React from "react";
import type { CustomerProfile } from "../../auth/types/customerAuth.types";
import { colors, radius, spacing, typography } from "../../../../design-system";

type CustomerProfilePanelProps = {
  profile: CustomerProfile | null;
};

export const CustomerProfilePanel: React.FC<CustomerProfilePanelProps> = ({
  profile,
}) => {
  return (
    <article style={styles.panel}>
      <p style={styles.panelEyebrow}>Account</p>

      <h2 style={styles.panelTitle}>Profile Details</h2>

      <div style={styles.detailList}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Name</span>
          <span style={styles.detailValue}>
            {profile?.fullName || "Not provided"}
          </span>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Email</span>
          <span style={styles.detailValue}>
            {profile?.email || "Not available"}
          </span>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Company</span>
          <span style={styles.detailValue}>
            {profile?.companyName || "Not provided"}
          </span>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Phone</span>
          <span style={styles.detailValue}>
            {profile?.phone || "Not provided"}
          </span>
        </div>
      </div>
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

  detailList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },

  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingBottom: spacing.sm,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  detailLabel: {
    color: colors.text.muted,
    fontSize: "13px",
  },

  detailValue: {
    color: colors.text.main,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    textAlign: "right",
  },
};
