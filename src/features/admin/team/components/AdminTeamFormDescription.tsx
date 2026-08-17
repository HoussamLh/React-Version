import React from "react";

import { colors, radius, spacing, typography } from "../../../../design-system";

import type { AdminTeamMemberFormValues } from "../types/teamCms.types";

type AdminTeamFormDescriptionProps = {
  value: AdminTeamMemberFormValues["description"];
  onChange: (value: string) => void;
};

export const AdminTeamFormDescription: React.FC<AdminTeamFormDescriptionProps> = ({
  value,
  onChange,
}) => {
  return (
    <label style={styles.field}>
      <span style={styles.label}>Description</span>
      <textarea
        style={styles.textarea}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Focused on building scalable web platforms..."
      />
    </label>
  );
};

const styles = {
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

  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box" as const,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.dark,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: "14px",
    lineHeight: "22px",
    resize: "vertical" as const,
    outline: "none",
  },
};
