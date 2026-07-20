import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";

type CustomerPasswordFormProps = {
  isSaving?: boolean;
  error?: string;
  successMessage?: string;
  onSubmit: (password: string) => Promise<void>;
};

export const CustomerPasswordForm: React.FC<CustomerPasswordFormProps> = ({
  isSaving = false,
  error,
  successMessage,
  onSubmit,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidationError("");

    if (password.length < 8) {
    setValidationError("Password must be at least 8 characters.");
    return;
    }

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password);

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialCharacter) {
    setValidationError(
    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    );
    return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    await onSubmit(password);

    setPassword("");
    setConfirmPassword("");
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <label style={styles.field}>
        <span style={styles.label}>New Password</span>

        <input
          style={styles.input}
          type="password"
          value={password}
          placeholder="Minimum 8 characters"
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Confirm Password</span>

        <input
          style={styles.input}
          type="password"
          value={confirmPassword}
          placeholder="Repeat password"
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </label>
      <p style={styles.hint}>
        Minimum 8 characters with uppercase, lowercase, number, and special
        character.
      </p>

      {(validationError || error) && (
        <p style={styles.error}>{validationError || error}</p>
      )}

      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <button
        type="submit"
        disabled={isSaving}
        style={{
          ...styles.button,
          ...(isSaving ? styles.disabledButton : {}),
        }}
      >
        {isSaving ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.lg,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
  },

  label: {
    color: colors.text.main,
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "13px 14px",
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

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  error: {
    borderRadius: radius.md,
    border: "1px solid rgba(255,90,90,0.45)",
    backgroundColor: "rgba(255,90,90,0.08)",
    color: "#ff7777",
    padding: spacing.md,
    margin: 0,
    fontSize: "13px",
  },

  success: {
    borderRadius: radius.md,
    border: `1px solid ${colors.accent.green}`,
    backgroundColor: "rgba(116,245,66,0.08)",
    color: colors.accent.green,
    padding: spacing.md,
    margin: 0,
    fontSize: "13px",
  },

  hint: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "18px",
    margin: 0,
  },
};
