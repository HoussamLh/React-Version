import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../design-system";
import {
  getCurrentCustomerProfile,
  signOutCustomer,
} from "../auth/customerAuth.service";
import type { CustomerProfile } from "../auth/customerAuth.types";
import { CustomerProjectRequestsPanel } from "../project-requests";

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const currentProfile = await getCurrentCustomerProfile();

        if (!isMounted) return;

        setProfile(currentProfile);
      } catch {
        if (!isMounted) return;

        setError("Could not load your customer profile.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setError("");

    try {
      await signOutCustomer();
      navigate("/sign-in", { replace: true });
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

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
        <header style={styles.header}>
          <div>
            <span style={styles.badge}>Customer Dashboard</span>

            <h1 style={styles.title}>
              Welcome{profile?.fullName ? `, ${profile.fullName}` : ""}.
            </h1>

            <p style={styles.subtitle}>
              Your DevBySam customer area is ready. Project onboarding, package
              requests, and account tools will be added here step by step.
            </p>
          </div>

          <button
            type="button"
            style={{
              ...styles.signOutButton,
              ...(isSigningOut ? styles.buttonDisabled : {}),
            }}
            onClick={() => void handleSignOut()}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          <article style={styles.panel}>
            <p style={styles.panelEyebrow}>Account</p>

            <h2 style={styles.panelTitle}>Profile Details</h2>

            <div style={styles.detailList}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Name</span>
                <span style={styles.detailValue}>
                  {profile?.fullName || "Not provided"}
                </span>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Email</span>
                <span style={styles.detailValue}>
                  {profile?.email || "Not available"}
                </span>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Company</span>
                <span style={styles.detailValue}>
                  {profile?.companyName || "Not provided"}
                </span>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Phone</span>
                <span style={styles.detailValue}>
                  {profile?.phone || "Not provided"}
                </span>
              </div>
            </div>
          </article>

          <article style={styles.panel}>
            <p style={styles.panelEyebrow}>Onboarding</p>

            <h2 style={styles.panelTitle}>Project Status</h2>

            <div style={styles.statusRow}>
              <span style={styles.statusBadge}>
                {profile?.onboardingStatus || "new"}
              </span>

              <span style={styles.accountBadge}>
                {profile?.accountStatus || "active"}
              </span>
            </div>

            <p style={styles.panelText}>
              This dashboard shell confirms customer authentication is working.
              The next phases can add project requests, selected packages,
              onboarding steps, and customer messages.
            </p>
          </article>
        </div>
        <CustomerProjectRequestsPanel />
        <section style={styles.nextPanel}>
          <div>
            <p style={styles.panelEyebrow}>Next Step</p>

            <h2 style={styles.panelTitle}>Start your project request</h2>

            <p style={styles.panelText}>
              Choose a package or contact DevBySam to discuss your project
              requirements.
            </p>
          </div>

          <div style={styles.actions}>
            <Link to="/pricing" style={styles.secondaryLink}>
              View Pricing
            </Link>

            <Link to="/contact" style={styles.primaryLink}>
              Contact DevBySam
            </Link>
          </div>
        </section>
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

  header: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.card,
    padding: spacing["2xl"],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.xl,
    flexWrap: "wrap",
    boxShadow: "0 24px 70px rgba(0,0,0,0.32)",
  },

  badge: {
    display: "inline-flex",
    marginBottom: spacing.md,
    padding: "7px 14px",
    borderRadius: radius.md,
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    fontSize: "10px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  title: {
    color: colors.text.main,
    fontSize: "36px",
    lineHeight: "44px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
    maxWidth: "720px",
  },

  signOutButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "12px 16px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
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

  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  nextPanel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.xl,
    alignItems: "center",
    flexWrap: "wrap",
  },

  panelEyebrow: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: `0 0 ${spacing.sm} 0`,
  },

  panelTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: `0 0 ${spacing.md} 0`,
    fontWeight: typography.fontWeight.black,
  },

  panelText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },

  detailList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },

  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingBottom: spacing.sm,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  detailLabel: {
    color: colors.text.muted,
    fontSize: "13px",
  },

  detailValue: {
    color: colors.text.main,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    textAlign: "right",
  },

  statusRow: {
    display: "flex",
    gap: spacing.sm,
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },

  statusBadge: {
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },

  accountBadge: {
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.muted,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "capitalize",
  },

  actions: {
    display: "flex",
    gap: spacing.md,
    flexWrap: "wrap",
  },

  primaryLink: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "13px 18px",
    fontWeight: typography.fontWeight.black,
    textDecoration: "none",
  },

  secondaryLink: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "13px 18px",
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
