import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { useAdminComparisonRowForm } from "../hooks/useAdminComparisonRowForm";
import type {
  AdminComparisonRow,
  AdminComparisonRowFormValues,
  AdminPricingStatus,
} from "../types/pricingCms.types";

type AdminComparisonRowFormProps = {
  initialRow?: AdminComparisonRow | null;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: AdminComparisonRowFormValues) => Promise<void>;
};

export const AdminComparisonRowForm: React.FC<AdminComparisonRowFormProps> = ({
  initialRow,
  isSubmitting = false,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const form = useAdminComparisonRowForm(initialRow, onSubmit);
  const { feature, setFeature, standard, setStandard, advanced, setAdvanced, premium, setPremium, status, setStatus, sortOrder, setSortOrder, validationError, handleSubmit } = form;

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {(validationError || error) && (
        <div style={styles.errorBox}>{validationError || error}</div>
      )}

      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Feature</span>
          <input
            style={styles.input}
            value={feature}
            onChange={(event) => setFeature(event.target.value)}
            placeholder="API development"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Standard</span>
          <input
            style={styles.input}
            value={standard}
            onChange={(event) => setStandard(event.target.value)}
            placeholder="Optional"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Advanced</span>
          <input
            style={styles.input}
            value={advanced}
            onChange={(event) => setAdvanced(event.target.value)}
            placeholder="Included"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Premium</span>
          <input
            style={styles.input}
            value={premium}
            onChange={(event) => setPremium(event.target.value)}
            placeholder="Advanced"
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

        <label style={styles.field}>
          <span style={styles.label}>Sort order</span>
          <input
            style={styles.input}
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
        </label>
      </div>

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
