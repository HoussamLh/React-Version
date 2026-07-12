import React from "react";
import { colors, spacing, typography } from "../../../../design-system";

type AdminPricingFeatureListProps = {
  features: string[];
  emptyText?: string;
};

export const AdminPricingFeatureList: React.FC<
  AdminPricingFeatureListProps
> = ({ features, emptyText = "No features added." }) => {
  if (features.length === 0) {
    return <p style={styles.emptyText}>{emptyText}</p>;
  }

  return (
    <div style={styles.list}>
      {features.map((feature) => (
        <div key={feature} style={styles.item}>
          <span style={styles.check}>✓</span>
          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
};

const styles = {
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },

  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: spacing.sm,
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
  },

  check: {
    color: colors.accent.green,
    fontSize: "16px",
    lineHeight: "18px",
    fontWeight: typography.fontWeight.black,
    flexShrink: 0,
  },

  emptyText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },
};
