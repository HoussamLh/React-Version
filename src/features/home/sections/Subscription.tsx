import React, { useEffect, useState } from "react";
import {
  Card,
  colors,
  radius,
  SectionHeader,
  spacing,
  typography,
} from "../../../design-system";
import { MaintenanceCard } from "../../pricing/components";
import type {
  EmergencyRestoration,
  MaintenancePlan,
} from "../../pricing/data/pricing.data";
import {
  getPublishedEmergencyRestoration,
  getPublishedMaintenancePlans,
} from "../../pricing/api";

export const SubscriptionSection: React.FC = () => {
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [restoration, setRestoration] = useState<EmergencyRestoration | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const [cmsPlans, cmsRestoration] = await Promise.all([
            getPublishedMaintenancePlans(),
            getPublishedEmergencyRestoration(),
          ]);

          if (!isMounted) return;

          setPlans(cmsPlans);
          setRestoration(cmsRestoration);
          setError(null);
        } catch (error) {
          console.error("Could not load home maintenance content:", error);

          if (!isMounted) return;

          setError("Maintenance subscriptions could not be loaded right now.");
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      })();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section style={styles.container} className="ds-section">
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
          subtitle="Enterprise-grade support and insurance for digital products that can't afford to fail."
          subtitleStyle={styles.subheading}
        />
      </div>

      {isLoading && (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Loading maintenance subscriptions...</p>
        </div>
      )}

      {!isLoading && error && (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>Maintenance unavailable</h3>
          <p style={styles.stateText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && !restoration && plans.length === 0 && (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>Maintenance plans coming soon</h3>
          <p style={styles.stateText}>
            Maintenance subscriptions will be published here soon.
          </p>
        </div>
      )}

      {!isLoading && !error && restoration && (
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
                {restoration.title}
              </h3>

              <div style={styles.emergencyPrice}>
                <span style={styles.price}>{restoration.price}</span>
                <span style={styles.suffix}>{restoration.suffix}</span>
              </div>
            </div>

            <p className="ds-card-text" style={styles.emergencyText}>
              {restoration.text}
            </p>
          </div>
        </Card>
      )}

      {!isLoading && !error && plans.length > 0 && (
        <div style={styles.grid} className="ds-grid ds-grid-3">
          {plans.map((plan) => (
            <MaintenanceCard key={plan.name} plan={plan} />
          ))}
        </div>
      )}
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

  badge: {
    backgroundColor: "#1c1f26",
    color: colors.accent.green,
    border: `1px solid ${colors.border.default}`,
    marginBottom: spacing.lg,
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
    gap: spacing.xl,
    alignItems: "stretch",
    marginTop: spacing["4xl"],
  },

  stateBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  stateTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
