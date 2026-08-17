import React from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../../design-system";

export const CustomerDashboardActions: React.FC = () => {
  return (
    <section style={styles.nextPanel}>
      <div>
        <p style={styles.panelEyebrow}>Next Step</p>

        <h2 style={styles.panelTitle}>Start your project request</h2>

        <p style={styles.panelText}>
          Choose a package or contact DevBySam to discuss your project
          requirements.
        </p>
      </div>

      <div style={styles.actions}>
        <Link to="/pricing" style={styles.secondaryLink}>
          View Pricing
        </Link>

        <Link to="/contact" style={styles.primaryLink}>
          Contact DevBySam
        </Link>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nextPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.xl,
    alignItems: "center",
    flexWrap: "wrap",
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

  panelText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },

  actions: {
    display: "flex",
    gap: spacing.md,
    flexWrap: "wrap",
  },

  primaryLink: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "13px 18px",
    fontWeight: typography.fontWeight.black,
    textDecoration: "none",
  },

  secondaryLink: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "13px 18px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
