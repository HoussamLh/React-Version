import React, { useCallback, useEffect, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import {
  AdminPricingEmptyState,
  AdminPricingFeatureList,
  AdminPricingListCard,
  AdminPricingSectionPanel,
} from "./components";
import { getAdminComparisonRows } from "./comparisonRows.service";
import { getAdminEmergencyRestorations } from "./emergencyRestoration.service";
import { getAdminMaintenancePlans } from "./maintenancePlans.service";
import { getAdminPricingPlans } from "./pricingPlans.service";
import type {
  AdminComparisonRow,
  AdminEmergencyRestoration,
  AdminMaintenancePlan,
  AdminPricingPlan,
} from "./pricingCms.types";

export const AdminPricingPage: React.FC = () => {
  const [pricingPlans, setPricingPlans] = useState<AdminPricingPlan[]>([]);
  const [maintenancePlans, setMaintenancePlans] = useState<
    AdminMaintenancePlan[]
  >([]);
  const [emergencyRestorations, setEmergencyRestorations] = useState<
    AdminEmergencyRestoration[]
  >([]);
  const [comparisonRows, setComparisonRows] = useState<AdminComparisonRow[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPricingContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        pricingPlanResults,
        maintenancePlanResults,
        emergencyRestorationResults,
        comparisonRowResults,
      ] = await Promise.all([
        getAdminPricingPlans(),
        getAdminMaintenancePlans(),
        getAdminEmergencyRestorations(),
        getAdminComparisonRows(),
      ]);

      setPricingPlans(pricingPlanResults);
      setMaintenancePlans(maintenancePlanResults);
      setEmergencyRestorations(emergencyRestorationResults);
      setComparisonRows(comparisonRowResults);
    } catch (error) {
      console.error("Could not load pricing CMS content:", error);
      setError("Could not load pricing CMS content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      if (!isMounted) return;
      void loadPricingContent();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [loadPricingContent]);

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow} className="mono-text">
            Pricing CMS
          </p>

          <h1 style={styles.title}>Manage Pricing</h1>

          <p style={styles.subtitle}>
            Manage build plans, maintenance subscriptions, emergency
            restoration, and comparison table rows.
          </p>
        </div>

        <button
          type="button"
          style={styles.refreshButton}
          onClick={() => void loadPricingContent()}
        >
          Refresh
        </button>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {isLoading && <div style={styles.loadingBox}>Loading pricing CMS...</div>}

      {!isLoading && (
        <div style={styles.stack}>
          <AdminPricingSectionPanel
            title="Build Pricing Plans"
            subtitle="Main website and application build packages shown on the Pricing page."
          >
            {pricingPlans.length === 0 ? (
              <AdminPricingEmptyState
                title="No pricing plans yet"
                text="Create pricing plans in the next phase."
              />
            ) : (
              <div style={styles.grid}>
                {pricingPlans.map((plan) => (
                  <AdminPricingListCard
                    key={plan.id}
                    title={plan.name}
                    eyebrow={plan.label}
                    price={plan.price}
                    suffix={plan.suffix}
                    description={plan.description}
                    status={plan.status}
                    recommended={plan.recommended}
                    metaItems={[
                      `CTA: ${plan.ctaLabel}`,
                      `Link: ${plan.ctaTo}`,
                      `Order: ${plan.sortOrder}`,
                    ]}
                  >
                    <AdminPricingFeatureList features={plan.features} />
                  </AdminPricingListCard>
                ))}
              </div>
            )}
          </AdminPricingSectionPanel>

          <AdminPricingSectionPanel
            title="Maintenance Plans"
            subtitle="Monthly maintenance subscriptions used by the Pricing page and later the Home Subscription section."
          >
            {maintenancePlans.length === 0 ? (
              <AdminPricingEmptyState
                title="No maintenance plans yet"
                text="Create maintenance plans in the next phase."
              />
            ) : (
              <div style={styles.grid}>
                {maintenancePlans.map((plan) => (
                  <AdminPricingListCard
                    key={plan.id}
                    title={plan.name}
                    eyebrow="Maintenance"
                    price={plan.price}
                    suffix={plan.suffix}
                    description={plan.description}
                    status={plan.status}
                    recommended={plan.recommended}
                    metaItems={[
                      `CTA: ${plan.ctaLabel}`,
                      `Link: ${plan.ctaTo}`,
                      `Order: ${plan.sortOrder}`,
                    ]}
                  >
                    <AdminPricingFeatureList features={plan.features} />
                  </AdminPricingListCard>
                ))}
              </div>
            )}
          </AdminPricingSectionPanel>

          <AdminPricingSectionPanel
            title="Emergency Restoration"
            subtitle="Urgent one-time restoration offer shown above maintenance subscriptions."
          >
            {emergencyRestorations.length === 0 ? (
              <AdminPricingEmptyState
                title="No emergency restoration item yet"
                text="Create the emergency restoration item in a later phase."
              />
            ) : (
              <div style={styles.gridSingle}>
                {emergencyRestorations.map((item) => (
                  <AdminPricingListCard
                    key={item.id}
                    title={item.title}
                    eyebrow="Urgent Fix"
                    price={item.price}
                    suffix={item.suffix}
                    description={item.text}
                    status={item.status}
                  />
                ))}
              </div>
            )}
          </AdminPricingSectionPanel>

          <AdminPricingSectionPanel
            title="Comparison Rows"
            subtitle="Rows shown inside the Pricing comparison table."
          >
            {comparisonRows.length === 0 ? (
              <AdminPricingEmptyState
                title="No comparison rows yet"
                text="Create comparison rows in a later phase."
              />
            ) : (
              <div style={styles.grid}>
                {comparisonRows.map((row) => (
                  <AdminPricingListCard
                    key={row.id}
                    title={row.feature}
                    eyebrow="Comparison Row"
                    status={row.status}
                    metaItems={[`Order: ${row.sortOrder}`]}
                  >
                    <div style={styles.comparisonValues}>
                      <div style={styles.comparisonValue}>
                        <span style={styles.comparisonLabel}>Standard</span>
                        <strong style={styles.comparisonText}>
                          {row.standard}
                        </strong>
                      </div>

                      <div style={styles.comparisonValue}>
                        <span style={styles.comparisonLabel}>Advanced</span>
                        <strong style={styles.comparisonText}>
                          {row.advanced}
                        </strong>
                      </div>

                      <div style={styles.comparisonValue}>
                        <span style={styles.comparisonLabel}>Premium</span>
                        <strong style={styles.comparisonText}>
                          {row.premium}
                        </strong>
                      </div>
                    </div>
                  </AdminPricingListCard>
                ))}
              </div>
            )}
          </AdminPricingSectionPanel>
        </div>
      )}
    </section>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xl,
  },

  header: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.lg,
    flexWrap: "wrap" as const,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  title: {
    color: colors.text.main,
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
    maxWidth: "720px",
  },

  refreshButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
  },

  loadingBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    color: colors.text.muted,
    padding: spacing.lg,
    fontSize: "14px",
  },

  stack: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xl,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: spacing.md,
  },

  gridSingle: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: spacing.md,
  },

  comparisonValues: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: spacing.sm,
  },

  comparisonValue: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  comparisonLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "11px",
    lineHeight: "16px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    marginBottom: spacing.xs,
  },

  comparisonText: {
    color: colors.text.main,
    fontSize: "13px",
    lineHeight: "18px",
  },
};
