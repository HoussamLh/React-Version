import React, { useEffect, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { PricingCard } from "../components";
import type { PricingPlan } from "../data/pricing.data";
import { getPublishedPricingPlans } from "../api";

export const PricingSection: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsPlans = await getPublishedPricingPlans();

          if (!isMounted) return;

          setPlans(cmsPlans);
          setError(null);
        } catch (error) {
          console.error("Could not load CMS pricing plans:", error);

          if (!isMounted) return;

          setError("Pricing plans could not be loaded right now.");
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
        <div style={styles.noticeBanner} className="mono-text">
          ⚡ Advanced is recommended for businesses that need authentication,
          database logic and API development.
        </div>
      </div>

      {isLoading && (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Loading pricing plans...</p>
        </div>
      )}

      {!isLoading && error && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Pricing unavailable</h2>
          <p style={styles.stateText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && plans.length === 0 && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Pricing plans coming soon</h2>
          <p style={styles.stateText}>
            Build packages will be published here soon.
          </p>
        </div>
      )}

      {!isLoading && !error && plans.length > 0 && (
        <div style={styles.grid} className="ds-grid ds-grid-5">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      )}
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
