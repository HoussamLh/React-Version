import React from "react";

import { spacing } from "../../../../design-system";
import { useAdminProjectForm } from "../hooks/useAdminProjectForm";
import type { AdminProjectFormValues } from "../types/projectsCms.types";
import { AdminProjectFormActions } from "./AdminProjectFormActions";
import { AdminProjectFormFields } from "./AdminProjectFormFields";
import { AdminProjectFormMediaPreview } from "./AdminProjectFormMediaPreview";
import { AdminProjectMediaFields } from "./AdminProjectMediaFields";
import { AdminProjectSettingsFields } from "./AdminProjectSettingsFields";

type AdminProjectFormProps = {
  initialValues?: AdminProjectFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: AdminProjectFormValues) => void | Promise<void>;
};

export const AdminProjectForm: React.FC<AdminProjectFormProps> = ({
  initialValues,
  submitLabel,
  isSubmitting = false,
  onCancel,
  onSubmit,
}) => {
  const {
    values,
    tagsInput,
    validationError,
    mediaPreview,
    updateValue,
    handleTitleChange,
    handleSlugChange,
    handleSubmit,
    setTagsInput,
  } = useAdminProjectForm({
    initialValues,
    isSubmitting,
    onSubmit,
  });

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {validationError && <div style={styles.errorBox}>{validationError}</div>}

      <AdminProjectFormFields
        values={values}
        tagsInput={tagsInput}
        onTitleChange={handleTitleChange}
        onSlugChange={handleSlugChange}
        onTagsChange={setTagsInput}
        onUpdateValue={updateValue}
      />

      <AdminProjectMediaFields values={values} onUpdateValue={updateValue} />

      <AdminProjectSettingsFields values={values} onUpdateValue={updateValue} />

      <AdminProjectFormMediaPreview
        mediaPreview={mediaPreview}
        title={values.title}
      />

      <AdminProjectFormActions
        submitLabel={submitLabel}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.lg,
  },

  errorBox: {
    border: "1px solid rgba(255, 193, 7, 0.35)",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 193, 7, 0.08)",
    color: "#ffc107",
    padding: spacing.md,
    fontSize: "13px",
  },
};
