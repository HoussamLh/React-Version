import React from "react";
import { colors, radius, spacing, typography } from "../../../design-system";

export const ContactSubmissionsPage: React.FC = () => {
  return (
    <section style={styles.card}>
      <h2 style={styles.title}>Contact Submissions</h2>

      <p style={styles.text}>
        This route is protected and ready. Later, we will save contact form
        submissions into Supabase and show them here.
      </p>
    </section>
  );
};

const styles = {
  card: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
  },

  title: {
    color: colors.text.main,
    fontSize: "28px",
    fontWeight: typography.fontWeight.black,
    margin: `0 0 ${spacing.md} 0`,
  },

  text: {
    color: colors.text.muted,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
  },
};
