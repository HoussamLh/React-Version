import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../design-system";
import {
  getCurrentCustomerProfile,
  signUpCustomer,
  subscribeToCustomerAuthChanges,
} from "./customerAuth.service";

type AuthCheckState = "checking" | "ready" | "authenticated";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Could not create your account. Please try again.";
};

export const CustomerSignUpPage: React.FC = () => {
  const [authState, setAuthState] = useState<AuthCheckState>("checking");

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const checkCurrentCustomer = async () => {
      if (!isMounted) return;

      setAuthState("checking");

      try {
        const profile = await getCurrentCustomerProfile();

        if (!isMounted) return;

        setAuthState(profile ? "authenticated" : "ready");
      } catch {
        if (!isMounted) return;

        setAuthState("ready");
      }
    };

    window.setTimeout(() => {
      void checkCurrentCustomer();
    }, 0);

    const unsubscribe = subscribeToCustomerAuthChanges(() => {
      void checkCurrentCustomer();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const validateForm = () => {
    if (!fullName.trim()) {
      return "Full name is required.";
    }

    if (!email.trim()) {
      return "Email address is required.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUpCustomer({
        fullName,
        companyName,
        phone,
        email,
        password,
      });

      setFullName("");
      setCompanyName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      if (result.needsEmailConfirmation) {
        setSuccessMessage(
          "Account created. Please check your email to confirm your account before signing in.",
        );
        return;
      }

      setSuccessMessage("Your customer account has been created successfully.");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authState === "checking") {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.checkingText}>Checking customer session...</p>
        </section>
      </main>
    );
  }

  if (authState === "authenticated") {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <div style={styles.header}>
            <span style={styles.badge}>Customer Account</span>

            <h1 style={styles.title}>You are already signed in.</h1>

            <p style={styles.subtitle}>
              Your customer dashboard will be connected in the next phase.
            </p>
          </div>

          <div style={styles.linkActions}>
            <Link to="/pricing" style={styles.secondaryLink}>
              View Pricing
            </Link>

            <Link to="/contact" style={styles.primaryLink}>
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>Get Started</span>

          <h1 style={styles.title}>Create your customer account</h1>

          <p style={styles.subtitle}>
            Start your project request and manage your DevBySam onboarding from
            one place.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <label style={styles.field}>
              <span style={styles.label}>Full name</span>
              <input
                style={styles.input}
                type="text"
                value={fullName}
                placeholder="Your full name"
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Company name</span>
              <input
                style={styles.input}
                type="text"
                value={companyName}
                placeholder="Optional"
                onChange={(event) => setCompanyName(event.target.value)}
                autoComplete="organization"
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Phone</span>
              <input
                style={styles.input}
                type="tel"
                value={phone}
                placeholder="Optional"
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Email</span>
              <input
                style={styles.input}
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Password</span>
              <input
                style={styles.input}
                type="password"
                value={password}
                placeholder="Minimum 8 characters"
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Confirm password</span>
              <input
                style={styles.input}
                type="password"
                value={confirmPassword}
                placeholder="Repeat password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {successMessage && <p style={styles.success}>{successMessage}</p>}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {}),
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 90px)",
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  card: {
    width: "100%",
    maxWidth: "820px",
    padding: spacing["2xl"],
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
  },

  checkingText: {
    color: colors.text.muted,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
    textAlign: "center" as const,
    margin: 0,
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
    fontSize: "34px",
    lineHeight: "42px",
    margin: `0 0 ${spacing.sm} 0`,
    fontWeight: typography.fontWeight.black,
  },

  subtitle: {
    color: colors.text.muted,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
    maxWidth: "640px",
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.lg,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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

  success: {
    border: `1px solid ${colors.accent.green}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    color: colors.accent.green,
    padding: spacing.md,
    fontSize: "13px",
    lineHeight: "20px",
    margin: 0,
  },

  linkActions: {
    display: "flex",
    gap: spacing.md,
    flexWrap: "wrap" as const,
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
