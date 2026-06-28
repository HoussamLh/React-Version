import React from "react";
import {
  colors,
  SectionHeader,
  spacing,
  typography,
  radius,
} from "../../../design-system";
import { 
  SubscriptionCard 
} from "../components/SubscriptionCard";
import { 
  subscriptionPlans 
} from "../data/subscription.data";

export const SubscriptionSection: React.FC = () => {
  return (
    <section style={styles.container} className="ds-section">
      {/* Section Header */}
      <div style={styles.header}>
        <SectionHeader
          badgeText="Subscribe Now"
          badgeStyle={styles.badge}
          textWrapperStyle={styles.textWrapper}
          customHeading={
            <>
              <h2 style={styles.heading}>
                Maintenance{" "}
                <span style={styles.subBadge} className="mono-text">
                  Subscription.
                </span>
              </h2>

              <h2 style={styles.heading}>Fixed Pricing.</h2>
            </>
          }
          subtitle="Enterprise-grade support and insurance 
          for digital products that can't afford to fail."
          subtitleStyle={styles.subheading}
        />

        {/* Anti-Churn Protection Banner */}
        <div style={styles.emergencyBanner} className="mono-text">
          ⚠️ Website currently broken? A one-time{" "}
          <strong>£150 Restoration Fee</strong> applies to stabilize
          pre-existing crashes.
        </div>
      </div>

      {/* 3-Column Tier Grid */}
      <div style={styles.grid} className="ds-grid ds-grid-3">
        {subscriptionPlans.map((plan) => (
          <SubscriptionCard key={plan.tier} plan={plan} />
        ))}
      </div>
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },

  header: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
    marginBottom: spacing["3xl"],
  },

  heading: {
    fontSize: "44px",
    fontWeight: typography.fontWeight.black,
    letterSpacing: typography.letterSpacing.tight,
    color: colors.text.main,
    margin: `0 0 ${spacing.md} 0`,
  },

  subheading: {
    fontSize: typography.fontSize.lg,
    color: colors.text.muted,
    maxWidth: "600px",
    lineHeight: typography.lineHeight.normal,
    margin: `0 0 ${spacing.xl} 0`,
  },

  subBadge: {
    backgroundColor: colors.accent.green,
    color: "#000000",
    fontSize: "30px",
    fontWeight: typography.fontWeight.black,
    padding: `${spacing.xs} 10px`,
    borderRadius: radius.lg,
    letterSpacing: "0.5px",
  },

  textWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  },

  emergencyBanner: {
    backgroundColor: "rgba(255, 189, 46, 0.06)",
    border: "1px solid #ffbd2e",
    color: "#ffbd2e",
    padding: `12px ${spacing.lg}`,
    borderRadius: "30px",
    fontSize: "13px",
    maxWidth: "700px",
  },

  badge: {
    backgroundColor: "#1c1f26",
    color: colors.accent.green,
    border: `1px solid ${colors.border.default}`,
    marginBottom: spacing.lg,
  },

  grid: {
    gap: spacing.xl,
    alignItems: "stretch",
  },
};