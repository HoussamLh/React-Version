import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { AdminProjectForm } from "./AdminProjectForm";
import type { AdminProjectFormValues } from "../types/projectsCms.types";

type AdminProjectFormPanelProps = {
  mode: "create" | "edit";
  initialValues?: AdminProjectFormValues;
  error: string | null;
  isSubmitting: boolean;
  projectId: string;
  onCancel: () => void;
  onSubmit: (values: AdminProjectFormValues) => void | Promise<void>;
};

export const AdminProjectFormPanel: React.FC<AdminProjectFormPanelProps> = ({
  mode,
  initialValues,
  error,
  isSubmitting,
  projectId,
  onCancel,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            {isEditMode ? "Edit project" : "Create project"}
          </h2>

          <p style={styles.description}>
            {isEditMode
              ? "Update project content, media, layout, tags, and publish status."
              : "Add a new project card to the CMS. Draft projects stay hidden from the public projects page."}
          </p>
        </div>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <AdminProjectForm
        key={isEditMode ? "edit-project" : "create-project"}
        initialValues={initialValues}
        submitLabel={isEditMode ? "Save Changes" : "Create Project"}
        isSubmitting={isSubmitting}
        projectId={projectId}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </div>
  );
};

const styles = {
  panel: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
  },

  header: {
    marginBottom: spacing.lg,
  },

  title: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  description: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },

  errorBox: {
    border: `1px solid rgba(255, 193, 7, 0.35)`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 193, 7, 0.08)",
    padding: spacing.lg,
    color: colors.accent.yellow,
    fontSize: "14px",
    marginBottom: spacing.lg,
  },
};
