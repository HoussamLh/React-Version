import React from "react";
import { colors, spacing } from "../../../design-system";
import { PricingCard } from "../components";
import { pricingPlans } from "../data/pricing.data";

export const PricingSection: React.FC = () => {
  return (
    <section style={styles.container} 
    className="ds-section">
      <div style={styles.header}>
        <div style={styles.noticeBanner} 
        className="mono-text">
          ⚡ Advanced is recommended for businesses that need authentication,
          database logic and API development.
        </div>
      </div>

      <div style={styles.grid} 
      className="ds-grid ds-grid-5">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    paddingTop: 0,
  },

  header: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    marginBottom: spacing["3xl"],
  },

  noticeBanner: {
    backgroundColor: "rgba(147, 220, 92, 0.06)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    padding: `12px ${spacing.lg}`,
    borderRadius: "30px",
    fontSize: "13px",
    maxWidth: "820px",
  },

  grid: {
    gap: spacing.xl,
    alignItems: "stretch",
  },
};
