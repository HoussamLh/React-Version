import React, { useMemo, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import type {
  AdminProjectFormValues,
  ProjectAccent,
  ProjectCategory,
  ProjectMediaType,
  ProjectSpan,
  ProjectStatus,
} from "./projectsCms.types";

type AdminProjectFormProps = {
  initialValues?: AdminProjectFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: AdminProjectFormValues) => void | Promise<void>;
};

const categoryOptions: ProjectCategory[] = [
  "web",
  "mobile",
  "backend",
  "branding",
  "fullstack",
  "saas",
  "uiux",
];

const mediaTypeOptions: ProjectMediaType[] = ["image", "video"];

const spanOptions: ProjectSpan[] = ["span 4", "span 6", "span 8", "span 12"];

const accentOptions: ProjectAccent[] = [
  "green",
  "blue",
  "purple",
  "pink",
  "yellow",
  "cyan",
];

const statusOptions: ProjectStatus[] = ["draft", "published"];

const defaultProjectFormValues: AdminProjectFormValues = {
  title: "",
  slug: "",
  text: "",

  category: "web",
  tags: [],

  mediaType: "image",
  imageUrl: null,
  videoUrl: null,
  videoPosterUrl: null,

  span: "span 6",
  imageHeight: "320px",
  hoverAccent: "green",

  demoUrl: null,
  githubUrl: null,

  featured: false,
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

const parseTagsInput = (value: string) => {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getNullableTextValue = (value: string) => {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
};

export const AdminProjectForm: React.FC<AdminProjectFormProps> = ({
  initialValues,
  submitLabel,
  isSubmitting = false,
  onCancel,
  onSubmit,
}) => {
  const [values, setValues] = useState<AdminProjectFormValues>(
    initialValues ?? defaultProjectFormValues,
  );

  const [tagsInput, setTagsInput] = useState(values.tags.join(", "));
  const [hasEditedSlug, setHasEditedSlug] = useState(Boolean(values.slug));
  const [validationError, setValidationError] = useState<string | null>(null);

  const mediaPreview = useMemo(() => {
    if (values.mediaType === "video") {
      return values.videoPosterUrl ?? values.imageUrl;
    }

    return values.imageUrl ?? values.videoPosterUrl;
  }, [values.imageUrl, values.mediaType, values.videoPosterUrl]);

  const updateValue = <Key extends keyof AdminProjectFormValues>(
    key: Key,
    nextValue: AdminProjectFormValues[Key],
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

    const nextValues: AdminProjectFormValues = {
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      text: values.text.trim(),
      tags: parseTagsInput(tagsInput),
      imageUrl: getNullableTextValue(values.imageUrl ?? ""),
      videoUrl: getNullableTextValue(values.videoUrl ?? ""),
      videoPosterUrl: getNullableTextValue(values.videoPosterUrl ?? ""),
      demoUrl: getNullableTextValue(values.demoUrl ?? ""),
      githubUrl: getNullableTextValue(values.githubUrl ?? ""),
      imageHeight: values.imageHeight.trim() || "320px",
      sortOrder: Number(values.sortOrder) || 0,
    };

    if (!nextValues.title) {
      setValidationError("Project title is required.");
      return;
    }

    if (!nextValues.slug) {
      setValidationError("Project slug is required.");
      return;
    }

    if (!nextValues.text) {
      setValidationError("Project text is required.");
      return;
    }

    if (nextValues.mediaType === "image" && !nextValues.imageUrl) {
      setValidationError("Image URL is required when media type is image.");
      return;
    }

    if (nextValues.mediaType === "video" && !nextValues.videoUrl) {
      setValidationError("Video URL is required when media type is video.");
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
            placeholder="CloudArchitect Pro"
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
            placeholder="cloudarchitect-pro"
            style={styles.input}
          />
        </label>

        <label style={styles.fieldLarge}>
          <span style={styles.label}>Text / subtitle</span>
          <textarea
            value={values.text}
            onChange={(event) => updateValue("text", event.target.value)}
            placeholder="Short project description shown on the card..."
            style={styles.textarea}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Category</span>
          <select
            value={values.category}
            onChange={(event) =>
              updateValue("category", event.target.value as ProjectCategory)
            }
            style={styles.input}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Tags / pills</span>
          <input
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="React, TypeScript, Cloud"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Media type</span>
          <select
            value={values.mediaType}
            onChange={(event) =>
              updateValue("mediaType", event.target.value as ProjectMediaType)
            }
            style={styles.input}
          >
            {mediaTypeOptions.map((mediaType) => (
              <option key={mediaType} value={mediaType}>
                {mediaType}
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
          <span style={styles.label}>Video URL</span>
          <input
            type="url"
            value={values.videoUrl ?? ""}
            onChange={(event) => updateValue("videoUrl", event.target.value)}
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Video poster URL</span>
          <input
            type="url"
            value={values.videoPosterUrl ?? ""}
            onChange={(event) =>
              updateValue("videoPosterUrl", event.target.value)
            }
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Card span</span>
          <select
            value={values.span}
            onChange={(event) =>
              updateValue("span", event.target.value as ProjectSpan)
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
          <span style={styles.label}>Image height</span>
          <input
            type="text"
            value={values.imageHeight}
            onChange={(event) => updateValue("imageHeight", event.target.value)}
            placeholder="320px"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Hover accent</span>
          <select
            value={values.hoverAccent}
            onChange={(event) =>
              updateValue("hoverAccent", event.target.value as ProjectAccent)
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
          <span style={styles.label}>Demo URL</span>
          <input
            type="url"
            value={values.demoUrl ?? ""}
            onChange={(event) => updateValue("demoUrl", event.target.value)}
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>GitHub URL</span>
          <input
            type="url"
            value={values.githubUrl ?? ""}
            onChange={(event) => updateValue("githubUrl", event.target.value)}
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Status</span>
          <select
            value={values.status}
            onChange={(event) =>
              updateValue("status", event.target.value as ProjectStatus)
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
          checked={values.featured}
          onChange={(event) => updateValue("featured", event.target.checked)}
        />
        <span>Feature this project</span>
      </label>

      {mediaPreview && (
        <div style={styles.previewBox}>
          <span style={styles.previewLabel}>Media preview</span>
          <img src={mediaPreview} alt={values.title} style={styles.preview} />
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
