import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { signOutAdmin } from "../auth/adminAuth.service";

type AdminHeaderProps = {
  isCompactLayout?: boolean;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isCompactLayout = false,
}) => {
  const navigate = useNavigate();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setError("");

    try {
      await signOutAdmin();
      navigate("/admin/login", { replace: true });
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header
      style={{
        ...styles.header,
        ...(isCompactLayout ? styles.headerCompact : {}),
      }}
    >
      <div style={styles.titleGroup}>
        <p style={styles.eyebrow}>Admin Dashboard</p>
        <h1
          style={{
            ...styles.title,
            ...(isCompactLayout ? styles.titleCompact : {}),
          }}
        >
          Control Center
        </h1>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      <button
        type="button"
        style={{
          ...styles.button,
          ...(isSigningOut ? styles.buttonDisabled : {}),
        }}
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        <LogOut size={17} />
        <span>
          {isSigningOut
            ? "Signing out..."
            : isCompactLayout
              ? "Out"
              : "Sign out"}
        </span>
      </button>
    </header>
  );
};

const styles = {
  header: {
    height: "82px",
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.dark,
    padding: `0 ${spacing.xl}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    boxSizing: "border-box" as const,
  },

  headerCompact: {
    height: "auto",
    minHeight: "70px",
    padding: spacing.md,
  },

  titleGroup: {
    minWidth: 0,
  },

  eyebrow: {
    color: colors.text.muted,
    fontSize: "12px",
    margin: 0,
  },

  title: {
    color: colors.text.main,
    fontSize: "22px",
    fontWeight: typography.fontWeight.black,
    margin: "4px 0 0 0",
    whiteSpace: "nowrap" as const,
  },

  titleCompact: {
    fontSize: "19px",
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "12px",
    lineHeight: "18px",
    margin: `${spacing.xs} 0 0 0`,
  },

  button: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    padding: "10px 14px",
    cursor: "pointer",
    flexShrink: 0,
  },

  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
