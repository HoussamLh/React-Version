import React, { useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminComparisonRow,
  AdminComparisonRowFormValues,
  AdminPricingStatus,
} from "../pricingCms.types";

type AdminComparisonRowFormProps = {
  initialRow?: AdminComparisonRow | null;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: AdminComparisonRowFormValues) => Promise<void>;
};

const defaultComparisonRowValues: AdminComparisonRowFormValues = {
  feature: "",
  standard: "",
  advanced: "",
  premium: "",
  status: "draft",
  sortOrder: 0,
};

export const AdminComparisonRowForm: React.FC<AdminComparisonRowFormProps> = ({
  initialRow,
  isSubmitting = false,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const initialValues = useMemo<AdminComparisonRowFormValues>(() => {
    if (!initialRow) {
      return defaultComparisonRowValues;
    }

    return {
      feature: initialRow.feature,
      standard: initialRow.standard,
      advanced: initialRow.advanced,
      premium: initialRow.premium,
      status: initialRow.status,
      sortOrder: initialRow.sortOrder,
    };
  }, [initialRow]);

  const [feature, setFeature] = useState(initialValues.feature);
  const [standard, setStandard] = useState(initialValues.standard);
  const [advanced, setAdvanced] = useState(initialValues.advanced);
  const [premium, setPremium] = useState(initialValues.premium);
  const [status, setStatus] = useState<AdminPricingStatus>(
    initialValues.status,
  );
  const [sortOrder, setSortOrder] = useState(String(initialValues.sortOrder));
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!feature.trim()) {
      setValidationError("Feature name is required.");
      return;
    }

    if (!standard.trim()) {
      setValidationError("Standard value is required.");
      return;
    }

    if (!advanced.trim()) {
      setValidationError("Advanced value is required.");
      return;
    }

    if (!premium.trim()) {
      setValidationError("Premium value is required.");
      return;
    }

    setValidationError(null);

    await onSubmit({
      feature: feature.trim(),
      standard: standard.trim(),
      advanced: advanced.trim(),
      premium: premium.trim(),
      status,
      sortOrder: Number(sortOrder) || 0,
    });
  };

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
