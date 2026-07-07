import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";

export const AdminDashboard: React.FC = () => {
  return (
    <section>
      <h2 style={styles.title}>Dashboard</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.label}>Live Chat</p>
          <h3 style={styles.value}>Ready</h3>
          <p style={styles.text}>Admin chat inbox will be connected next.</p>
        </div>

        <div style={styles.card}>
          <p style={styles.label}>Contacts</p>
          <h3 style={styles.value}>Pending</h3>
          <p style={styles.text}>Contact submissions page is prepared.</p>
        </div>

        <div style={styles.card}>
          <p style={styles.label}>Access</p>
          <h3 style={styles.value}>Protected</h3>
          <p style={styles.text}>Only admin profiles can access this area.</p>
        </div>
      </div>
    </section>
  );
};

const styles = {
  title: {
    color: colors.text.main,
    fontSize: "28px",
    fontWeight: typography.fontWeight.black,
    margin: `0 0 ${spacing.xl} 0`,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: spacing.lg,
  },

  card: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
  },

  label: {
    color: colors.text.muted,
    fontSize: "12px",
    margin: `0 0 ${spacing.sm} 0`,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },

  value: {
    color: colors.text.main,
    fontSize: "24px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  text: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },
};
