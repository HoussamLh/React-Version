import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { useAdminPricingPlanForm } from "../hooks/useAdminPricingPlanForm";
import type {
  AdminPricingPlan,
  AdminPricingPlanFormValues,
  AdminPricingStatus,
} from "../types/pricingCms.types";

type AdminPricingPlanFormProps = {
  initialPlan?: AdminPricingPlan | null;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: AdminPricingPlanFormValues) => Promise<void>;
};

export const AdminPricingPlanForm: React.FC<AdminPricingPlanFormProps> = ({
  initialPlan,
  isSubmitting = false,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const form = useAdminPricingPlanForm(initialPlan, onSubmit);
  const { 
    name, 
    setName, 
    label, 
    setLabel, 
    price, 
    setPrice, 
    suffix, 
    setSuffix, 
    description, 
    setDescription, 
    featuresInput, 
    setFeaturesInput, 
    ctaLabel, 
    setCtaLabel, 
    ctaTo, 
    setCtaTo, 
    recommended, 
    setRecommended, 
    status, 
    setStatus, 
    sortOrder, 
    setSortOrder, 
    validationError, 
    handleSubmit 
  } = form;

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {(validationError || error) && (
        <div style={styles.errorBox}>{validationError || error}</div>
      )}

      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Plan name</span>
          <input
            style={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Advanced"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Label</span>
          <input
            style={styles.input}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Pro Engineering"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Price</span>
          <input
            style={styles.input}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="£3,499"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Suffix</span>
          <input
            style={styles.input}
            value={suffix}
            onChange={(event) => setSuffix(event.target.value)}
            placeholder="/mo or leave empty"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>CTA label</span>
          <input
            style={styles.input}
            value={ctaLabel}
            onChange={(event) => setCtaLabel(event.target.value)}
            placeholder="Get Advanced"
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>CTA link</span>
          <input
            style={styles.input}
            value={ctaTo}
            onChange={(event) => setCtaTo(event.target.value)}
            placeholder="/contact"
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

      <label style={styles.field}>
        <span style={styles.label}>Description</span>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="A custom web app package for businesses..."
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Features</span>
        <textarea
          style={styles.textarea}
          value={featuresInput}
          onChange={(event) => setFeaturesInput(event.target.value)}
          placeholder="Custom web app, Auth and database, API development"
        />
        <span style={styles.helpText}>Separate features with commas.</span>
      </label>

      <label style={styles.checkboxField}>
        <input
          type="checkbox"
          checked={recommended}
          onChange={(event) => setRecommended(event.target.checked)}
        />
        <span>Mark as recommended</span>
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

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing.md,
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xs,
  },

  label: {
    color: colors.text.main,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  input: {
    width: "100%",
    boxSizing: "border-box" as const,
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
    minHeight: "96px",
    boxSizing: "border-box" as const,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    lineHeight: "22px",
    resize: "vertical" as const,
    outline: "none",
  },

  helpText: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "18px",
  },

  checkboxField: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
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
