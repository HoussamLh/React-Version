import React from "react";
import { spacing } from "../../../../design-system";
import type { AdminProject } from "../types/projectsCms.types";
import { AdminProjectCard } from "./AdminProjectCard";

type AdminProjectGridProps = {
  projects: AdminProject[];
  isDeletingProjectId: string | null;
  onEdit: (project: AdminProject) => void;
  onDelete: (project: AdminProject) => void;
};

export const AdminProjectGrid: React.FC<AdminProjectGridProps> = ({
  projects,
  isDeletingProjectId,
  onEdit,
  onDelete,
}) => {
  return (
    <div style={styles.projectGrid}>
      {projects.map((project) => (
        <AdminProjectCard
          key={project.id}
          project={project}
          isDeleting={isDeletingProjectId === project.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const styles = {
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
  },
};
