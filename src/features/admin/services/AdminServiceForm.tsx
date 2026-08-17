import React, { useState } from "react";

import { colors, radius, spacing } from "../../../design-system";

import { AdminServiceFormActions } from "./components/AdminServiceFormActions";
import { AdminServiceFormFields } from "./components/AdminServiceFormFields";
import { AdminServiceFormPreview } from "./components/AdminServiceFormPreview";

import type { AdminServiceFormValues } from "./types/servicesCms.types";

type AdminServiceFormProps = {
  initialValues?: AdminServiceFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: AdminServiceFormValues) => void | Promise<void>;
};

const defaultServiceFormValues: AdminServiceFormValues = {
  title: "",
  slug: "",
  text: "",

  icon: "code",
  imageUrl: null,

  pills: [],

  span: "span 1",
  badge: null,
  monitoring: false,

  hoverAccent: "green",

  status: "draft",
  sortOrder: 0,
};

const createSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const parsePillsInput = (value: string) => {
  return value
    .split(",")
    .map((pill) => pill.trim())
    .filter(Boolean);
};

const getNullableTextValue = (value: string) => {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
};

export const AdminServiceForm: React.FC<AdminServiceFormProps> = ({
  initialValues,
  submitLabel,
  isSubmitting = false,
  onCancel,
  onSubmit,
}) => {
  const [values, setValues] = useState<AdminServiceFormValues>(
    initialValues ?? defaultServiceFormValues,
  );

  const [pillsInput, setPillsInput] = useState(values.pills.join(", "));
  const [hasEditedSlug, setHasEditedSlug] = useState(Boolean(values.slug));
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateValue = <Key extends keyof AdminServiceFormValues>(
    key: Key,
    nextValue: AdminServiceFormValues[Key],
  ) => {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: nextValue,
    }));
  };

  const handleTitleChange = (nextTitle: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      title: nextTitle,
      slug: hasEditedSlug ? currentValues.slug : createSlug(nextTitle),
    }));
  };

  const handleSlugChange = (nextSlug: string) => {
    setHasEditedSlug(true);
    updateValue("slug", createSlug(nextSlug));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextValues: AdminServiceFormValues = {
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      text: values.text.trim(),
      imageUrl: getNullableTextValue(values.imageUrl ?? ""),
      pills: parsePillsInput(pillsInput),
      badge: getNullableTextValue(values.badge ?? ""),
      sortOrder: Number(values.sortOrder) || 0,
    };

    if (!nextValues.title) {
      setValidationError("Service title is required.");
      return;
    }

    if (!nextValues.slug) {
      setValidationError("Service slug is required.");
      return;
    }

    if (!nextValues.text) {
      setValidationError("Service text is required.");
      return;
    }

    setValidationError(null);

    await onSubmit(nextValues);
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {validationError && <div style={styles.errorBox}>{validationError}</div>}

      <AdminServiceFormFields
        values={values}
        pillsInput={pillsInput}
        onPillsInputChange={setPillsInput}
        onTitleChange={handleTitleChange}
        onValueChange={(key, value) => {
          if (key === "slug") {
            handleSlugChange(String(value));
            return;
          }

          updateValue(key, value);
        }}
      />

      <AdminServiceFormPreview
        imageUrl={values.imageUrl}
        title={values.title}
      />

      <AdminServiceFormActions
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
    border: `1px solid rgba(255, 193, 7, 0.35)`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 193, 7, 0.08)",
    color: colors.accent.yellow,
    padding: spacing.md,
    fontSize: "13px",
  },
};
