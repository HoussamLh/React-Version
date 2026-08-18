import React from "react";
import type { CustomerProfile } from "../../auth/types/customerAuth.types";
import { colors, radius, spacing, typography } from "../../../../design-system";

type CustomerDashboardHeaderProps = {
  profile: CustomerProfile | null;
  isSigningOut: boolean;
  onSignOut: () => void;
};

export const CustomerDashboardHeader: React.FC<CustomerDashboardHeaderProps> = ({
  profile,
  isSigningOut,
  onSignOut,
}) => {
  return (
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
        onClick={onSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
};
