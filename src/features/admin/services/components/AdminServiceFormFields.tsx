import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

import type {
  AdminServiceFormValues,
  ServiceAccent,
  ServiceIcon,
  ServiceSpan,
  ServiceStatus,
} from "../types/servicesCms.types";

type AdminServiceFormFieldsProps = {
  values: AdminServiceFormValues;
  pillsInput: string;
  onPillsInputChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onValueChange: <Key extends keyof AdminServiceFormValues>(
    key: Key,
    value: AdminServiceFormValues[Key],
  ) => void;
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

export const AdminServiceFormFields: React.FC<AdminServiceFormFieldsProps> = ({
  values,
  pillsInput,
  onPillsInputChange,
  onTitleChange,
  onValueChange,
}) => {
  return (
    <>
      <div style={styles.grid}>
        <label style={styles.field}>
          <span style={styles.label}>Title</span>

          <input
            type="text"
            value={values.title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Web Development"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Slug</span>

          <input
            type="text"
            value={values.slug}
            onChange={(event) =>
              onValueChange("slug", createSlug(event.target.value))
            }
            placeholder="web-development"
            style={styles.input}
          />
        </label>

        <label style={styles.fieldLarge}>
          <span style={styles.label}>Text</span>

          <textarea
            value={values.text}
            onChange={(event) => onValueChange("text", event.target.value)}
            placeholder="Short service description shown on the card..."
            style={styles.textarea}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Icon</span>

          <select
            value={values.icon}
            onChange={(event) =>
              onValueChange("icon", event.target.value as ServiceIcon)
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
            onChange={(event) => onValueChange("imageUrl", event.target.value)}
            placeholder="https://..."
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Pills</span>

          <input
            type="text"
            value={pillsInput}
            onChange={(event) => onPillsInputChange(event.target.value)}
            placeholder="REACT, TYPESCRIPT, NEXT.JS"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Card span</span>

          <select
            value={values.span}
            onChange={(event) =>
              onValueChange("span", event.target.value as ServiceSpan)
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
            onChange={(event) => onValueChange("badge", event.target.value)}
            placeholder="Proactive"
            style={styles.input}
          />
        </label>

        <label style={styles.field}>
          <span style={styles.label}>Hover accent</span>

          <select
            value={values.hoverAccent}
            onChange={(event) =>
              onValueChange("hoverAccent", event.target.value as ServiceAccent)
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
              onValueChange("status", event.target.value as ServiceStatus)
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
              onValueChange("sortOrder", Number(event.target.value))
            }
            style={styles.input}
          />
        </label>
      </div>

      <label style={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.monitoring}
          onChange={(event) =>
            onValueChange("monitoring", event.target.checked)
          }
        />

        <span>Show 24/7 monitoring dashboard footer</span>
      </label>
    </>
  );
};

const createSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    color: colors.text.main,
    fontSize: "14px",
  },
};
