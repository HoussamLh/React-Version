import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { CustomerProfile } from "../../auth/customerAuth.types";

type CustomerProfileFormProps = {
  profile: CustomerProfile;
  isSaving?: boolean;
  error?: string;
  successMessage?: string;
  onSubmit: (values: {
    fullName: string;
    companyName: string;
    phone: string;
  }) => Promise<void>;
};

export const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({
  profile,
  isSaving = false,
  error,
  successMessage,
  onSubmit,
}) => {
const [fullName, setFullName] = useState(() => profile.fullName);
const [companyName, setCompanyName] = useState(() => profile.companyName);
const [phone, setPhone] = useState(() => profile.phone);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      fullName,
      companyName,
      phone,
    });
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <label style={styles.field}>
        <span style={styles.label}>Full name</span>

        <input
          style={styles.input}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Company name</span>

        <input
          style={styles.input}
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Phone</span>

        <input
          style={styles.input}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>

      {error && <p style={styles.error}>{error}</p>}

      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <button
        type="submit"
        disabled={isSaving}
        style={{
          ...styles.button,
          ...(isSaving ? styles.disabledButton : {}),
        }}
      >
        {isSaving ? "Saving..." : "Save Profile"}
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
    letterSpacing: "0.08em",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: "13px 14px",
    fontSize: "14px",
    outline: "none",
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
};
