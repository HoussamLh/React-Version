import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../design-system";
import { signInAdmin } from "./adminAuth.service";

type LocationState = {
  from?: string;
};

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const redirectTo = state?.from ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await signInAdmin({
        email,
        password,
      });

      setIsLoggedIn(true);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>Admin Access</span>

          <h1 style={styles.title}>Sign in to DevBySam Admin</h1>

          <p style={styles.subtitle}>
            Manage live chat conversations, visitor messages, and contact
            requests.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              placeholder="admin@devbysam.co.uk"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          {error && <p style={styles.error}>{error}</p>}
        </form>
      </section>
    </main>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    padding: spacing["2xl"],
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
  },

  header: {
    marginBottom: spacing.xl,
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
    textTransform: "uppercase" as const,
  },

  title: {
    color: colors.text.main,
    fontSize: "28px",
    lineHeight: "36px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.lg,
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },

  label: {
    color: colors.text.main,
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },

  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
  },

  button: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "14px 18px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },

  error: {
    color: colors.accent.yellow,
    fontSize: "13px",
    lineHeight: "18px",
    margin: 0,
  },
};
