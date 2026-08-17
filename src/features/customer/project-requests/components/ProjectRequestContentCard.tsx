import React from "react";
import { colors, spacing } from "../../../../design-system";

type Props = { project: { description: string; goals: string; adminNotes: string } };

export const ProjectRequestContentCard: React.FC<Props> = ({ project }) => (
  <section style={styles.card}>
    <h2 style={styles.heading}>Description</h2>
    <p style={styles.text}>{project.description || "No description provided."}</p>
    <h2 style={styles.heading}>Goals</h2>
    <p style={styles.text}>{project.goals || "No goals provided."}</p>
    <h2 style={styles.heading}>Admin Notes</h2>
    <p style={styles.text}>{project.adminNotes || "No updates yet."}</p>
  </section>
);

const styles = {
  card: {

  },
  heading: { 
    color: colors.text.main, 
    fontSize: "20px", 
    marginBottom: spacing.md, 
  },
  text: { 
    color: colors.text.muted, 
    lineHeight: "24px", 
    margin: `0 0 ${spacing.xl} 0`, 
  },
};
