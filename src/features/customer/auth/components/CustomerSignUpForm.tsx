import React from "react";
import { Link } from "react-router-dom";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { CustomerAuthFormField } from "./CustomerAuthFormField";
import { CustomerAuthStatusMessage } from "./CustomerAuthStatusMessage";

const styles: Record<string, React.CSSProperties> = {
  form: { display: "flex", flexDirection: "column", gap: spacing.lg },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: spacing.lg,
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

type CustomerSignUpFormProps = {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
  error: string;
  successMessage: string;
  signInPath: string;
  onFullNameChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const CustomerSignUpForm: React.FC<CustomerSignUpFormProps> = ({
  fullName,
  companyName,
  phone,
  email,
  password,
  confirmPassword,
  isSubmitting,
  error,
  successMessage,
  signInPath,
  onFullNameChange,
  onCompanyNameChange,
  onPhoneChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  return (
    <form style={styles.form} onSubmit={onSubmit}>
      <div style={styles.grid}>
        <CustomerAuthFormField
          label="Full name"
          type="text"
          value={fullName}
          placeholder="Your full name"
          onChange={(event) => onFullNameChange(event.target.value)}
          autoComplete="name"
        />
        <CustomerAuthFormField
          label="Company name"
          type="text"
          value={companyName}
          placeholder="Optional"
          onChange={(event) => onCompanyNameChange(event.target.value)}
          autoComplete="organization"
        />
        <CustomerAuthFormField
          label="Phone"
          type="tel"
          value={phone}
          placeholder="Optional"
          onChange={(event) => onPhoneChange(event.target.value)}
          autoComplete="tel"
        />
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
          placeholder="Minimum 8 characters"
          onChange={(event) => onPasswordChange(event.target.value)}
          autoComplete="new-password"
        />
        <CustomerAuthFormField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          placeholder="Repeat password"
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          autoComplete="new-password"
        />
      </div>

      {error && (
        <CustomerAuthStatusMessage type="error">{error}</CustomerAuthStatusMessage>
      )}
      {successMessage && (
        <CustomerAuthStatusMessage type="success">
          {successMessage}
        </CustomerAuthStatusMessage>
      )}

      <button
        type="submit"
        style={{ ...styles.button, ...(isSubmitting ? styles.buttonDisabled : {}) }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      <p style={styles.footerText}>
        Already have a customer account?{" "}
        <Link to={signInPath} style={styles.inlineLink}>
          Sign in here
        </Link>
      </p>
    </form>
  );
};
