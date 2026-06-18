import React from "react";
import {
  Button,
  Card,
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../../design-system";
import type { 
  SubscriptionPlan 
} from "../data/subscription.data";

type SubscriptionCardProps = {
  plan: SubscriptionPlan;
};

export const SubscriptionCard: 
React.FC<SubscriptionCardProps> = ({ plan }) => {
  return (
    <Card
      className={`subscription-card${
        plan.featured ? " subscription-card-featured" : ""
      }`}
      style={{
        ...styles.card,
        ...(plan.featured ? styles.featuredCard : {}),
      }}
    >
      <div style={styles.cardTop}>
        <div style={styles.featuredHeader}>
          <div style={styles.tierName} 
          className="mono-text">
            {plan.tier}
          </div>

          {plan.featured && (
            <span style={styles.popularBadge} 
            className="mono-text">
              MOST POPULAR
            </span>
          )}
        </div>

        <div style={styles.priceContainer}>
          <span style={styles.currency}>£</span>
          <span style={styles.amount}>{plan.price}</span>
          <span style={styles.period}>/mo</span>
        </div>

        <h3 style={styles.cardTitle}>{plan.title}</h3>

        <p style={styles.cardDesc}>{plan.description}</p>
      </div>

      <hr
        style={{
          ...styles.divider,
          ...(plan.featured ? 
            { borderColor: "rgba(116, 245, 66, 0.2)" }
             : {}),
        }}
      />

      <ul style={styles.featureList}>
        {plan.features.map((feature) => (
          <li key={feature} style={styles.featureItem}>
            ✓ {feature}
          </li>
        ))}
      </ul>

      <Button
        fullWidth
        variant={plan.featured ? "primary" : "secondary"}
        style={plan.featured ? 
          styles.btnPrimary : 
          styles.btnSecondary}
      >
        {plan.buttonLabel}
      </Button>
    </Card>
  );
};

const styles = {
  card: {
    borderRadius: radius["2xl"],
    padding: `${spacing["2xl"]} ${spacing.xl}`,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },

  featuredCard: {
    border: `2px solid ${colors.accent.green}`,
    transform: "scale(1.03)",
  },

  cardTop: {
    display: "flex",
    flexDirection: "column" as const,
  },

  featuredHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tierName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.wide,
    color: colors.text.muted,
    marginBottom: "20px",
  },

  popularBadge: {
    backgroundColor: colors.accent.green,
    boxShadow: shadows.glow,
    color: "#000000",
    fontSize: "10px",
    fontWeight: typography.fontWeight.black,
    padding: `${spacing.xs} 10px`,
    borderRadius: radius.md,
    letterSpacing: "0.5px",
    transform: "translateY(-10px)",
  },

  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    marginBottom: spacing.md,
  },

  currency: {
    fontSize: "28px",
    fontWeight: typography.fontWeight.extraBold,
    color: colors.text.main,
  },

  amount: {
    fontSize: "56px",
    fontWeight: typography.fontWeight.black,
    color: colors.text.main,
    lineHeight: 1,
  },

  period: {
    fontSize: "16px",
    color: colors.text.muted,
    marginLeft: spacing.xs,
  },

  cardTitle: {
    fontSize: typography.fontSize.cardTitle,
    fontWeight: typography.fontWeight.extraBold,
    color: colors.text.main,
    margin: "0 0 12px 0",
  },

  cardDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
    lineHeight: typography.lineHeight.normal,
    margin: 0,
    minHeight: "42px",
  },

  divider: {
    border: "none",
    borderTop: `1px solid ${colors.border.default}`,
    margin: `${spacing.xl} 0`,
    width: "100%",
  },

  featureList: {
    listStyleType: "none",
    padding: 0,
    margin: `0 0 ${spacing["2xl"]} 0`,
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
  },

  featureItem: {
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
    lineHeight: "1.4",
  },

  btnPrimary: {
    borderRadius: radius.md,
    padding: `14px ${spacing.lg}`,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extraBold,
  },

  btnSecondary: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: `14px ${spacing.lg}`,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    boxShadow: "none",
  },
};
