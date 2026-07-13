import React, { useEffect, useState } from "react";
import {
  Card,
  colors,
  radius,
  SharedHero,
  spacing,
  typography,
} from "../../../design-system";
import { MaintenanceCard } from "../components";
import type {
  EmergencyRestoration,
  MaintenancePlan,
} from "../data/pricing.data";
import {
  getPublishedEmergencyRestoration,
  getPublishedMaintenancePlans,
} from "../api";

export const MaintenanceSection: React.FC = () => {
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
          console.error("Could not load CMS maintenance pricing:", error);

          if (!isMounted) return;

          setError("Maintenance pricing could not be loaded right now.");
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
        {isLoading && (
          <div style={styles.stateBox}>
            <p style={styles.stateText}>Loading maintenance plans...</p>
          </div>
        )}

        {!isLoading && error && (
          <div style={styles.stateBox}>
            <h2 style={styles.stateTitle}>Maintenance unavailable</h2>
            <p style={styles.stateText}>{error}</p>
          </div>
        )}

        {!isLoading && !error && !restoration && plans.length === 0 && (
          <div style={styles.stateBox}>
            <h2 style={styles.stateTitle}>Maintenance plans coming soon</h2>
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
          <div className="ds-grid ds-grid-3" style={styles.grid}>
            {plans.map((plan) => (
              <MaintenanceCard key={plan.name} plan={plan} />
            ))}
          </div>
        )}
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
