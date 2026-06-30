import React from "react";
import { colors, SpecialCard, spacing } from "../../../design-system";
import type { PricingPlan } from "../data/pricing.data";

type PricingCardProps = {
  plan: PricingPlan;
};

export const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <SpecialCard
      recommended={plan.recommended}
      action={{
        label: plan.ctaLabel,
        to: plan.ctaTo,
        variant: plan.recommended ? "primary" : "secondary",
      }}
    >
      <div style={styles.header}>
        <span
          className="ds-pill mono-text"
          style={plan.recommended ? styles.recommendedPill : undefined}
        >
          {plan.label}
        </span>

        <h3 style={styles.title}>{plan.name}</h3>
      </div>

      <div style={styles.priceRow}>
        <span style={styles.price}>{plan.price}</span>

        {plan.suffix && <span style={styles.suffix}>{plan.suffix}</span>}
      </div>

      <div style={styles.featureList}>
        {plan.features.map((feature) => (
          <div key={feature} style={styles.featureItem}>
            <span style={styles.check}>✓</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </SpecialCard>
  );
};

const styles = {
  header: {
    marginBottom: spacing.xl,
  },

  recommendedPill: {
    color: colors.accent.green,
    borderColor: colors.accent.green,
  },

  title: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 600,
    color: colors.text.main,
    margin: `${spacing.md} 0 0 0`,
    letterSpacing: "-0.01em",
  },

  priceRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "4px",
    marginBottom: spacing["2xl"],
    flexWrap: "wrap" as const,
  },

  price: {
    fontSize: "36px",
    lineHeight: "40px",
    fontWeight: 700,
    color: colors.text.main,
    letterSpacing: "-1px",
  },

  suffix: {
    fontSize: "14px",
    lineHeight: "20px",
    color: colors.text.muted,
    marginBottom: "4px",
  },

  featureList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
    marginBottom: "40px",
  },

  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "14px",
    lineHeight: "20px",
    color: colors.text.muted,
  },

  check: {
    color: colors.accent.green,
    fontSize: "20px",
    lineHeight: "20px",
    fontWeight: 700,
    flexShrink: 0,
  },
};
