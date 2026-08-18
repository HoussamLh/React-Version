import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { useAdminEmergencyRestorationForm } from "../hooks/useAdminEmergencyRestorationForm";
import type {
  AdminEmergencyRestoration,
  AdminEmergencyRestorationFormValues,
  AdminPricingStatus,
} from "../types/pricingCms.types";

type AdminEmergencyRestorationFormProps = {
  initialRestoration?: AdminEmergencyRestoration | null;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: AdminEmergencyRestorationFormValues) => Promise<void>;
};

export const AdminEmergencyRestorationForm: React.FC<AdminEmergencyRestorationFormProps> = ({
  initialRestoration,
  isSubmitting = false,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const form = useAdminEmergencyRestorationForm(initialRestoration, onSubmit);
  const { title, setTitle, price, setPrice, suffix, setSuffix, text, setText, status, setStatus, validationError, handleSubmit } = form;

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {(validationError || error) && (
        <div style={styles.errorBox}>{validationError || error}</div>
      )}

      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Title</span>
          <input
            style={styles.input}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Emergency Restoration"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Price</span>
          <input
            style={styles.input}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="£150"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Suffix</span>
          <input
            style={styles.input}
            value={suffix}
            onChange={(event) => setSuffix(event.target.value)}
            placeholder="one-time"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Status</span>
          <select
            style={styles.input}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AdminPricingStatus)
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label style={styles.field}>
        <span style={styles.label}>Text</span>
        <textarea
          style={styles.textarea}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="For already-broken websites, urgent fixes, failed deployments..."
        />
      </label>

      <div style={styles.actions}>
        <button type="button" style={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>

        <button
          type="submit"
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.md,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing.md,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.xs,
  },

  label: {
    color: colors.text.main,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    lineHeight: "22px",
    resize: "vertical",
    outline: "none",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  cancelButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  submitButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
  },

  errorBox: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: spacing.md,
    fontSize: "14px",
    lineHeight: "22px",
  },
};
