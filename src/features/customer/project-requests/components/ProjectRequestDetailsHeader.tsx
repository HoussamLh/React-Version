import React from "react";
import { Link } from "react-router-dom";
import { colors, spacing, typography } from "../../../../design-system";
import type { ProjectRequest } from "../types/projectRequests.types";

type Props = { project: ProjectRequest };

export const ProjectRequestDetailsHeader: React.FC<Props> = ({ project }) => (
  <>
    <Link to="/customer/dashboard" style={styles.backLink}>← Back to dashboard</Link>
    <section style={styles.card}>
      <span style={styles.badge}>Customer Project</span>
      <h1 style={styles.title}>{project.title}</h1>
      <p style={styles.subtitle}>
        Created {new Date(project.createdAt).toLocaleDateString()}</p>
    </section>
  </>
);

const styles = {
  card: { 
    backgroundColor: "transparent", 
    padding: 0, 
  },
  backLink: { 
    color: colors.accent.green, 
    textDecoration: "none", 
    display: "inline-flex", 
    marginBottom: spacing.md, 
  },
  badge: { 
    color: colors.accent.green, 
    fontSize: "11px", 
    fontWeight: typography.fontWeight.black, 
    textTransform: "uppercase" as const, 
  },
  title: { 
    color: colors.text.main, 
    fontSize: "36px", 
    margin: `${spacing.md} 0`, 
  },
  subtitle: { 
    color: colors.text.muted, 
    margin: 0, 
  },
};
