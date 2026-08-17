import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminProjectFormValues,
  ProjectMediaType,
} from "../types/projectsCms.types";

type AdminProjectMediaFieldsProps = {
  values: AdminProjectFormValues;
  onUpdateValue: <Key extends keyof AdminProjectFormValues>(
    key: Key,
    value: AdminProjectFormValues[Key],
  ) => void;
};

const mediaTypeOptions: ProjectMediaType[] = ["image", "video"];

export const AdminProjectMediaFields: React.FC<
  AdminProjectMediaFieldsProps
> = ({ values, onUpdateValue }) => {
  return (
    <div style={styles.grid}>
      <label style={styles.field}>
        <span style={styles.label}>Media type</span>

        <select
          value={values.mediaType}
          onChange={(event) =>
            onUpdateValue("mediaType", event.target.value as ProjectMediaType)
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
          onChange={(event) => onUpdateValue("imageUrl", event.target.value)}
          placeholder="https://..."
          style={styles.input}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Video URL</span>

        <input
          type="url"
          value={values.videoUrl ?? ""}
          onChange={(event) => onUpdateValue("videoUrl", event.target.value)}
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
            onUpdateValue("videoPosterUrl", event.target.value)
          }
          placeholder="https://..."
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
};
