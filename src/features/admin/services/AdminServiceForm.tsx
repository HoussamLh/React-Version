import React, { useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import type {
  AdminServiceFormValues,
  ServiceAccent,
  ServiceIcon,
  ServiceSpan,
  ServiceStatus,
} from "./servicesCms.types";

type AdminServiceFormProps = {
  initialValues?: AdminServiceFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: AdminServiceFormValues) => void | Promise<void>;
};

const iconOptions: ServiceIcon[] = [
  "code",
  "smartphone",
  "server",
  "shield-check",
];

const spanOptions: ServiceSpan[] = ["span 1", "span 2"];

const accentOptions: ServiceAccent[] = [
  "green",
  "blue",
  "purple",
  "pink",
  "yellow",
  "cyan",
];

const statusOptions: ServiceStatus[] = ["draft", "published"];

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

      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Title</span>
          <input
            type="text"
            value={values.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Web Development"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Slug</span>
          <input
            type="text"
            value={values.slug}
            onChange={(event) => {
              setHasEditedSlug(true);
              updateValue("slug", createSlug(event.target.value));
            }}
            placeholder="web-development"
            style={styles.input}
          />
        </label>

        <label style={styles.fieldLarge}>
          <span style={styles.label}>Text</span>
          <textarea
            value={values.text}
            onChange={(event) => updateValue("text", event.target.value)}
            placeholder="Short service description shown on the card..."
            style={styles.textarea}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Icon</span>
          <select
            value={values.icon}
            onChange={(event) =>
              updateValue("icon", event.target.value as ServiceIcon)
            }
            style={styles.input}
          >
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Image URL</span>
          <input
            type="url"
            value={values.imageUrl ?? ""}
            onChange={(event) => updateValue("imageUrl", event.target.value)}
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Pills</span>
          <input
            type="text"
            value={pillsInput}
            onChange={(event) => setPillsInput(event.target.value)}
            placeholder="REACT, TYPESCRIPT, NEXT.JS"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Card span</span>
          <select
            value={values.span}
            onChange={(event) =>
              updateValue("span", event.target.value as ServiceSpan)
            }
            style={styles.input}
          >
            {spanOptions.map((span) => (
              <option key={span} value={span}>
                {span}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Badge</span>
          <input
            type="text"
            value={values.badge ?? ""}
            onChange={(event) => updateValue("badge", event.target.value)}
            placeholder="Proactive"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Hover accent</span>
          <select
            value={values.hoverAccent}
            onChange={(event) =>
              updateValue("hoverAccent", event.target.value as ServiceAccent)
            }
            style={styles.input}
          >
            {accentOptions.map((accent) => (
              <option key={accent} value={accent}>
                {accent}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Status</span>
          <select
            value={values.status}
            onChange={(event) =>
              updateValue("status", event.target.value as ServiceStatus)
            }
            style={styles.input}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Sort order</span>
          <input
            type="number"
            value={values.sortOrder}
            onChange={(event) =>
              updateValue("sortOrder", Number(event.target.value))
            }
            style={styles.input}
          />
        </label>
      </div>

      <label style={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.monitoring}
          onChange={(event) => updateValue("monitoring", event.target.checked)}
        />
        <span>Show 24/7 monitoring dashboard footer</span>
      </label>

      {values.imageUrl && (
        <div style={styles.previewBox}>
          <span style={styles.previewLabel}>Image preview</span>
          <img
            src={values.imageUrl}
            alt={values.title}
            style={styles.preview}
          />
        </div>
      )}

      <div style={styles.actions}>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          style={{
            ...styles.primaryButton,
            ...(isSubmitting ? styles.disabledButton : {}),
          }}
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
    gap: spacing.lg,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: spacing.md,
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },

  fieldLarge: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
  },

  label: {
    color: colors.text.muted,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  input: {
    width: "100%",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  },

  textarea: {
    width: "100%",
    minHeight: "92px",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    outline: "none",
    fontSize: "14px",
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    color: colors.text.main,
    fontSize: "14px",
  },

  previewBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.background.dark,
  },

  previewLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "12px",
    marginBottom: spacing.sm,
  },

  preview: {
    width: "100%",
    maxHeight: "220px",
    borderRadius: radius.md,
    objectFit: "cover" as const,
    display: "block",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  primaryButton: {
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    padding: `${spacing.sm} ${spacing.lg}`,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  secondaryButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.lg}`,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
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
