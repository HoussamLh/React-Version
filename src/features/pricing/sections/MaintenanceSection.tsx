import React from "react";
import { Card, colors, SharedHero, spacing } from "../../../design-system";
import { MaintenanceCard } from "../components";
import { emergencyRestoration, maintenancePlans } from "../data/pricing.data";

export const MaintenanceSection: React.FC = () => {
  return (
    <section style={styles.container} className="ds-section">
      <SharedHero
        badgeText="MAINTENANCE SUBSCRIPTIONS"
        titleStart="Always-on"
        titleAccent="support."
        subtitle="Keep your website or application secure, updated, and stable after launch."
        align="center"
        className="ds-hero-no-bottom-gap"
        containerStyle={{
          padding: 0,
        }}
      />

      <div style={styles.content}>
        <Card
          interactive
          hoverAccent="yellow"
          className="ds-card-stack"
          style={styles.emergencyCard}
        >
          <div>
            <span className="ds-pill mono-text" style={styles.urgentPill}>
              Urgent Fix
            </span>

            <div style={styles.emergencyHeader}>
              <h3 className="ds-card-title" style={styles.emergencyTitle}>
                {emergencyRestoration.title}
              </h3>

              <div style={styles.emergencyPrice}>
                <span style={styles.price}>{emergencyRestoration.price}</span>
                <span style={styles.suffix}>{emergencyRestoration.suffix}</span>
              </div>
            </div>

            <p className="ds-card-text" style={styles.emergencyText}>
              {emergencyRestoration.text}
            </p>
          </div>
        </Card>

        <div className="ds-grid ds-grid-3" style={styles.grid}>
          {maintenancePlans.map((plan) => (
            <MaintenanceCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },

  content: {
    marginTop: spacing["2xl"],
  },

  emergencyCard: {
    backgroundColor: "rgba(255, 189, 46, 0.06)",
    border: `1px solid ${colors.accent.yellow}`,
    borderRadius: "30px",
  },

  urgentPill: {
    color: colors.accent.yellow,
    borderColor: colors.accent.yellow,
    backgroundColor: "rgba(255, 189, 46, 0.08)",
  },

  emergencyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: spacing.xl,
    flexWrap: "wrap" as const,
    marginTop: spacing.lg,
  },

  emergencyTitle: {
    margin: 0,
    color: colors.text.main,
  },

  emergencyText: {
    maxWidth: "760px",
    marginTop: spacing.md,
  },

  emergencyPrice: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },

  price: {
    fontSize: "44px",
    lineHeight: "48px",
    fontWeight: 900,
    color: colors.accent.yellow,
    letterSpacing: "-1px",
  },

  suffix: {
    fontSize: "13px",
    color: colors.text.muted,
    marginBottom: "8px",
  },

  grid: {
    alignItems: "stretch",
    marginTop: spacing["4xl"],
  },
};
