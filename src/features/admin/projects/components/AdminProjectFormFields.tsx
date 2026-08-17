import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminProjectFormValues,
  ProjectCategory,
} from "../types/projectsCms.types";

type AdminProjectFormFieldsProps = {
  values: AdminProjectFormValues;
  tagsInput: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onUpdateValue: <Key extends keyof AdminProjectFormValues>(
    key: Key,
    value: AdminProjectFormValues[Key],
  ) => void;
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

export const AdminProjectFormFields: React.FC<AdminProjectFormFieldsProps> = ({
  values,
  tagsInput,
  onTitleChange,
  onSlugChange,
  onTagsChange,
  onUpdateValue,
}) => {
  return (
    <div style={styles.grid}>
      <label style={styles.field}>
        <span style={styles.label}>Title</span>

        <input
          type="text"
          value={values.title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="CloudArchitect Pro"
          style={styles.input}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Slug</span>

        <input
          type="text"
          value={values.slug}
          onChange={(event) => onSlugChange(event.target.value)}
          placeholder="cloudarchitect-pro"
          style={styles.input}
        />
      </label>

      <label style={styles.fieldLarge}>
        <span style={styles.label}>Text / subtitle</span>

        <textarea
          value={values.text}
          onChange={(event) => onUpdateValue("text", event.target.value)}
          placeholder="Short project description shown on the card..."
          style={styles.textarea}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Category</span>

        <select
          value={values.category}
          onChange={(event) =>
            onUpdateValue("category", event.target.value as ProjectCategory)
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
          onChange={(event) => onTagsChange(event.target.value)}
          placeholder="React, TypeScript, Cloud"
          style={styles.input}
        />
      </label>
    </div>
  );
};

const styles = {
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
};
