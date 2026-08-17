import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminProjectFormValues,
  ProjectAccent,
  ProjectSpan,
  ProjectStatus,
} from "../types/projectsCms.types";

type AdminProjectSettingsFieldsProps = {
  values: AdminProjectFormValues;
  onUpdateValue: <Key extends keyof AdminProjectFormValues>(
    key: Key,
    value: AdminProjectFormValues[Key],
  ) => void;
};

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

export const AdminProjectSettingsFields: React.FC<
  AdminProjectSettingsFieldsProps
> = ({ values, onUpdateValue }) => {
  return (
    <>
      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Card span</span>

          <select
            value={values.span}
            onChange={(event) =>
              onUpdateValue("span", event.target.value as ProjectSpan)
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
            onChange={(event) =>
              onUpdateValue("imageHeight", event.target.value)
            }
            placeholder="320px"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Hover accent</span>

          <select
            value={values.hoverAccent}
            onChange={(event) =>
              onUpdateValue("hoverAccent", event.target.value as ProjectAccent)
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
            onChange={(event) => onUpdateValue("demoUrl", event.target.value)}
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>GitHub URL</span>

          <input
            type="url"
            value={values.githubUrl ?? ""}
            onChange={(event) => onUpdateValue("githubUrl", event.target.value)}
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Status</span>

          <select
            value={values.status}
            onChange={(event) =>
              onUpdateValue("status", event.target.value as ProjectStatus)
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
              onUpdateValue("sortOrder", Number(event.target.value))
            }
            style={styles.input}
          />
        </label>
      </div>

      <label style={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(event) => onUpdateValue("featured", event.target.checked)}
        />

        <span>Feature this project</span>
      </label>
    </>
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

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    color: colors.text.main,
    fontSize: "14px",
  },
};
