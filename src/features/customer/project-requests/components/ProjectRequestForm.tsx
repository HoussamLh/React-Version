import React from "react";
import { radius, colors, spacing, typography } from "../../../../design-system";
import { ProjectRequestFormFields } from "./ProjectRequestFormFields";
import { useCustomerProjectRequestForm } from "../hooks/useCustomerProjectRequestForm";
import type { ProjectRequestFormValues } from "../types/projectRequests.types";

type CustomerProjectRequestFormProps = {
  initialValues?: Partial<ProjectRequestFormValues>;
  isSubmitting?: boolean;
  error?: string;
  onSubmit: (values: ProjectRequestFormValues) => Promise<void>;
};

export const CustomerProjectRequestForm: React.FC<CustomerProjectRequestFormProps> = ({
  initialValues,
  isSubmitting = false,
  error,
  onSubmit,
}) => {
  const form = useCustomerProjectRequestForm(initialValues);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await form.submit(onSubmit);
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {(form.validationError || error) && (
        <p style={styles.error}>{form.validationError || error}</p>
      )}
      <ProjectRequestFormFields {...form} />
      <button
        type="submit"
        style={{ ...styles.submitButton, ...(isSubmitting ? styles.buttonDisabled : {}) }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting request..." : "Submit Project Request"}
      </button>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: { 
    display: "flex" as const, 
    flexDirection: "column" as const, 
    gap: spacing.lg, 
  },
  submitButton: { 
    border: "none", 
    borderRadius: radius.md, 
    backgroundColor: colors.accent.green, 
    color: colors.background.dark, 
    padding: "13px 18px", 
    fontWeight: typography.fontWeight.black, 
    cursor: "pointer", 
  },
  buttonDisabled: { 
    opacity: 0.55, 
    cursor: "not-allowed", 
  },
  error: { 
    color: "#ff7777", 
    fontSize: "13px", 
    margin: 0, 
  },
};
