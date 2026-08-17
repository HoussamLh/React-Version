import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerAccountSettings } from "../account";
import { updateCurrentCustomerProfile } from "../auth";
import { CustomerProjectRequestsPanel } from "../project-requests";
import { getProjectRequestValuesFromSearch } from "../project-requests/helpers/projectRequestIntent.helpers";
import { CustomerDashboardHeader } from "./components/CustomerDashboardHeader";
import { CustomerProfilePanel } from "./components/CustomerProfilePanel";
import { CustomerProjectStatusPanel } from "./components/CustomerProjectStatusPanel";
import { CustomerDashboardActions } from "./components/CustomerDashboardActions";
import { useCustomerDashboard } from "./hooks/useCustomerDashboard";
import { colors, radius, spacing, typography } from "../../../design-system";

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    profile,
    isLoading,
    isSigningOut,
    error,
    setProfile,
    handleSignOut,
  } = useCustomerDashboard();

  const initialRequestValues = getProjectRequestValuesFromSearch(location.search);

  const clearProjectRequestIntent = useCallback(() => {
    if (!location.search) return;

    navigate("/customer/dashboard", { replace: true });
  }, [location.search, navigate]);

  if (isLoading) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.loadingText}>Loading customer dashboard...</p>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <CustomerDashboardHeader
          profile={profile}
          isSigningOut={isSigningOut}
          onSignOut={() => void handleSignOut()}
        />

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          <CustomerProfilePanel profile={profile} />
          <CustomerProjectStatusPanel profile={profile} />
        </div>

        {profile && (
          <CustomerAccountSettings
            profile={profile}
            onProfileUpdated={setProfile}
            onUpdateProfile={updateCurrentCustomerProfile}
          />
        )}

        <CustomerProjectRequestsPanel
          initialRequestValues={initialRequestValues}
          onClearInitialRequestIntent={clearProjectRequestIntent}
        />

        <CustomerDashboardActions />
      </section>
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 90px)",
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: spacing.xl,
  },

  shell: {
    width: "100%",
    maxWidth: "1120px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: spacing.xl,
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    margin: "0 auto",
    padding: spacing["2xl"],
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
  },

  loadingText: {
    color: colors.text.muted,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    textAlign: "center",
    margin: 0,
  },

  error: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.xl,
  },
};
