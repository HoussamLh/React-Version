import React from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { CustomerAuthFormField } from "./CustomerAuthFormField";
import { CustomerAuthStatusMessage } from "./CustomerAuthStatusMessage";

type CustomerSignInFormProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const CustomerSignInForm: React.FC<CustomerSignInFormProps> = ({
  email,
  password,
  isSubmitting,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <form style={styles.form} onSubmit={onSubmit}>
      <CustomerAuthFormField
        label="Email"
        type="email"
        value={email}
        placeholder="you@example.com"
        onChange={(event) => onEmailChange(event.target.value)}
        autoComplete="email"
      />

      <CustomerAuthFormField
        label="Password"
        type="password"
        value={password}
        placeholder="Your password"
        onChange={(event) => onPasswordChange(event.target.value)}
        autoComplete="current-password"
      />

      {error && (
        <CustomerAuthStatusMessage type="error">{error}</CustomerAuthStatusMessage>
      )}

      <button
        type="submit"
        style={{ ...styles.button, ...(isSubmitting ? styles.buttonDisabled : {}) }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <p style={styles.footerText}>
        No customer account yet?{" "}
        <Link to="/get-started" style={styles.inlineLink}>
          Create one here
        </Link>
      </p>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: { display: "flex", flexDirection: "column", gap: spacing.lg },
  button: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: "14px 18px",
    fontWeight: typography.fontWeight.black,
    cursor: "pointer",
  },
  buttonDisabled: { opacity: 0.55, cursor: "not-allowed" },
  footerText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    textAlign: "center",
  },
  inlineLink: {
    color: colors.accent.green,
    fontWeight: typography.fontWeight.bold,
    textDecoration: "none",
  },
};
