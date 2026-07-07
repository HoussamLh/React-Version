import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { signOutAdmin } from "../auth/adminAuth.service";

export const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header style={styles.header}>
      <div>
        <p style={styles.eyebrow}>Admin Dashboard</p>
        <h1 style={styles.title}>Control Center</h1>
      </div>

      <button type="button" style={styles.button} onClick={handleSignOut}>
        <LogOut size={17} />
        <span>Sign out</span>
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
    boxSizing: "border-box" as const,
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
  },
};
