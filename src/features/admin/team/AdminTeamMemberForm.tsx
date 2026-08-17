import React, { useState } from "react";

import { radius, spacing } from "../../../design-system";

import { AdminTeamFormActions } from "./components/AdminTeamFormActions";
import { AdminTeamFormDescription } from "./components/AdminTeamFormDescription";
import { AdminTeamFormFields } from "./components/AdminTeamFormFields";
import { AdminTeamFormPreview } from "./components/AdminTeamFormPreview";
import {
  defaultTeamMemberFormValues,
  getTeamMemberFormValues,
} from "./helpers/teamCms.helpers";
import type {
  AdminTeamMember,
  AdminTeamMemberFormValues,
} from "./types/teamCms.types";

type AdminTeamMemberFormProps = {
  initialMember?: AdminTeamMember | null;
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: AdminTeamMemberFormValues) => Promise<void>;
};

export const AdminTeamMemberForm: React.FC<AdminTeamMemberFormProps> = ({
  initialMember,
  isSubmitting = false,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}) => {
  const [values, setValues] = useState<AdminTeamMemberFormValues>(() =>
    initialMember
      ? getTeamMemberFormValues(initialMember)
      : defaultTeamMemberFormValues,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateValue = <Key extends keyof AdminTeamMemberFormValues>(
    key: Key,
    value: AdminTeamMemberFormValues[Key],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextValues: AdminTeamMemberFormValues = {
      ...values,
      name: values.name.trim(),
      role: values.role.trim(),
      description: values.description.trim(),
      imageUrl: values.imageUrl.trim(),
      imageAlt: values.imageAlt.trim() || values.name.trim(),
      sortOrder: Number(values.sortOrder) || 0,
    };

    if (!nextValues.name) {
      setValidationError("Team member name is required.");
      return;
    }

    if (!nextValues.role) {
      setValidationError("Team member role is required.");
      return;
    }

    if (!nextValues.description) {
      setValidationError("Team member description is required.");
      return;
    }

    if (!nextValues.imageUrl) {
      setValidationError("Image URL is required.");
      return;
    }

    setValidationError(null);
    await onSubmit(nextValues);
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {(validationError || error) && (
        <div style={styles.errorBox}>{validationError || error}</div>
      )}

      <AdminTeamFormFields values={values} onValueChange={updateValue} />

      <AdminTeamFormDescription
        value={values.description}
        onChange={(value) => updateValue("description", value)}
      />

      <AdminTeamFormPreview
        imageUrl={values.imageUrl}
        imageAlt={values.imageAlt || values.name}
      />

      <AdminTeamFormActions
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
    gap: spacing.md,
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
