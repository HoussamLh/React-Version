import React from "react";
import { colors, spacing, typography } from "../../../../design-system";
import type { ProjectRequest } from "../types/projectRequests.types";

type Props = { project: ProjectRequest };

export const ProjectRequestInfoCard: React.FC<Props> = ({ project }) => (
  <section style={styles.card}>
    <h2 style={styles.heading}>Project Information</h2>
    <Detail label="Project Type" value={project.projectType} />
    <Detail label="Package" value={project.selectedPackage} />
    <Detail label="Category" value={project.packageCategory} />
    <Detail label="Budget" value={project.budgetRange} />
    <Detail label="Timeline" value={project.timeline} />
  </section>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={styles.detail}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value || "Not provided"}</span>
  </div>
);

const styles = {
  card: { backgroundColor: "inherit" },
  heading: { 
    color: colors.text.main, 
    fontSize: "20px", 
    marginBottom: spacing.md, 
  },
  detail: { 
    display: "flex" as const, 
    justifyContent: "space-between", 
    padding: `${spacing.sm} 0`, 
    borderBottom: `1px solid ${colors.border.default}`, 
  },
  label: { color: colors.text.muted },
  value: { 
    color: colors.text.main, 
    fontWeight: typography.fontWeight.bold, 
  },
};
