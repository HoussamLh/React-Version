import React, { useEffect, useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import type {
  CustomerProjectRequestFormValues,
  ProjectRequestPackageCategory,
  ProjectRequestType,
} from "./projectRequests.types";

type CustomerProjectRequestFormProps = {
  initialValues?: Partial<CustomerProjectRequestFormValues>;
  isSubmitting?: boolean;
  error?: string;
  onSubmit: (values: CustomerProjectRequestFormValues) => Promise<void>;
};

const defaultFormValues: CustomerProjectRequestFormValues = {
  title: "",
  projectType: "website",
  selectedPackage: "",
  packageCategory: "custom",
  budgetRange: "",
  timeline: "",
  description: "",
  goals: "",
};

export const CustomerProjectRequestForm: React.FC<
  CustomerProjectRequestFormProps
> = ({ initialValues, isSubmitting = false, error, onSubmit }) => {
  const mergedInitialValues = useMemo<CustomerProjectRequestFormValues>(() => {
    return {
      ...defaultFormValues,
      ...initialValues,
    };
  }, [initialValues]);

  const [title, setTitle] = useState(mergedInitialValues.title);
  const [projectType, setProjectType] = useState<ProjectRequestType>(
    mergedInitialValues.projectType,
  );
  const [selectedPackage, setSelectedPackage] = useState(
    mergedInitialValues.selectedPackage,
  );
  const [packageCategory, setPackageCategory] =
    useState<ProjectRequestPackageCategory>(
      mergedInitialValues.packageCategory,
    );
  const [budgetRange, setBudgetRange] = useState(
    mergedInitialValues.budgetRange,
  );
  const [timeline, setTimeline] = useState(mergedInitialValues.timeline);
  const [description, setDescription] = useState(
    mergedInitialValues.description,
  );
  const [goals, setGoals] = useState(mergedInitialValues.goals);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setTitle(mergedInitialValues.title);
    setProjectType(mergedInitialValues.projectType);
    setSelectedPackage(mergedInitialValues.selectedPackage);
    setPackageCategory(mergedInitialValues.packageCategory);
    setBudgetRange(mergedInitialValues.budgetRange);
    setTimeline(mergedInitialValues.timeline);
    setDescription(mergedInitialValues.description);
    setGoals(mergedInitialValues.goals);
  }, [mergedInitialValues]);

  const validateForm = () => {
    if (!title.trim()) {
      return "Project title is required.";
    }

    if (!description.trim()) {
      return "Project description is required.";
    }

    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextValidationError = validateForm();

    if (nextValidationError) {
      setValidationError(nextValidationError);
      return;
    }

    setValidationError("");

    await onSubmit({
      title,
      projectType,
      selectedPackage,
      packageCategory,
      budgetRange,
      timeline,
      description,
      goals,
    });
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {(validationError || error) && (
        <p style={styles.error}>{validationError || error}</p>
      )}

      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Project title</span>
          <input
            style={styles.input}
            value={title}
            placeholder="Business website redesign"
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Project type</span>
          <select
            style={styles.input}
            value={projectType}
            onChange={(event) =>
              setProjectType(event.target.value as ProjectRequestType)
            }
          >
            <option value="website">Website</option>
            <option value="mobile_app">Mobile app</option>
            <option value="backend_system">Backend system</option>
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Package category</span>
          <select
            style={styles.input}
            value={packageCategory}
            onChange={(event) =>
              setPackageCategory(
                event.target.value as ProjectRequestPackageCategory,
              )
            }
          >
            <option value="custom">Custom</option>
            <option value="build_plan">Build plan</option>
            <option value="maintenance_plan">Maintenance plan</option>
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Selected package</span>
          <input
            style={styles.input}
            value={selectedPackage}
            placeholder="Optional"
            onChange={(event) => setSelectedPackage(event.target.value)}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Budget range</span>
          <input
            style={styles.input}
            value={budgetRange}
            placeholder="Example: £1,000 - £3,000"
            onChange={(event) => setBudgetRange(event.target.value)}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Timeline</span>
          <input
            style={styles.input}
            value={timeline}
            placeholder="Example: 4-6 weeks"
            onChange={(event) => setTimeline(event.target.value)}
          />
        </label>
      </div>

      <label style={styles.field}>
        <span style={styles.label}>Project description</span>
        <textarea
          style={styles.textarea}
          value={description}
          placeholder="Describe what you want to build..."
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Main goals</span>
        <textarea
          style={styles.textarea}
          value={goals}
          placeholder="Example: generate leads, improve conversions, automate bookings..."
          onChange={(event) => setGoals(event.target.value)}
        />
      </label>

      <button
        type="submit"
        style={{
          ...styles.submitButton,
          ...(isSubmitting ? styles.buttonDisabled : {}),
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting request..." : "Submit Project Request"}
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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    boxSizing: "border-box",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `13px ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    lineHeight: "22px",
    resize: "vertical",
  },

  submitButton: {
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
};
