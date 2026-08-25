import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";
import type {
  AdminTeamAccent,
  AdminTeamMemberFormValues,
  AdminTeamStatus,
} from "../types/teamCms.types";

const accentOptions: AdminTeamAccent[] = ["green", "purple", "blue", "pink"];
const statusOptions: AdminTeamStatus[] = ["draft", "published"];

type AdminTeamFormFieldsProps = {
  values: AdminTeamMemberFormValues;
  onValueChange: <Key extends keyof AdminTeamMemberFormValues>(
    key: Key,
    value: AdminTeamMemberFormValues[Key],
  ) => void;
};

export const AdminTeamFormFields: React.FC<AdminTeamFormFieldsProps> = ({
  values,
  onValueChange,
}) => {
  return (
    <div style={styles.grid}>
      <label style={styles.field}>
        <span style={styles.label}>Name</span>
        <input
          style={styles.input}
          value={values.name}
          onChange={(event) => onValueChange("name", event.target.value)}
          placeholder="Sam Lahlah"
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Role</span>
        <input
          style={styles.input}
          value={values.role}
          onChange={(event) => onValueChange("role", event.target.value)}
          placeholder="Founder & Software Engineer"
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Image alt</span>
        <input
          style={styles.input}
          value={values.imageAlt}
          onChange={(event) => onValueChange("imageAlt", event.target.value)}
          placeholder="Sam Lahlah"
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Hover accent</span>
        <select
          style={styles.input}
          value={values.hoverAccent}
          onChange={(event) =>
            onValueChange("hoverAccent", event.target.value as AdminTeamAccent)
          }
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
          style={styles.input}
          value={values.status}
          onChange={(event) =>
            onValueChange("status", event.target.value as AdminTeamStatus)
          }
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
          style={styles.input}
          type="number"
          value={values.sortOrder}
          onChange={(event) =>
            onValueChange("sortOrder", Number(event.target.value) || 0)
          }
        />
      </label>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: spacing.md,
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.xs,
  },

  label: {
    color: colors.text.main,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    outline: "none",
  },
};
