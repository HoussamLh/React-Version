import React from "react";
import { colors, spacing, typography } from "../../../../design-system";
import { ProjectActivityItem } from "./ProjectActivityItem";
import { useProjectActivityTimeline } from "../hooks/useProjectActivityTimeline";

type ProjectActivityTimelineProps = { projectRequestId: string };
export const ProjectActivityTimeline: React.FC<ProjectActivityTimelineProps> = ({ projectRequestId }) => {
  const { activities, isLoading } = useProjectActivityTimeline(projectRequestId);
  return (
    <section style={styles.container}>
      <h3 style={styles.title}>Project Activity</h3>
      {isLoading && <p style={styles.description}>Loading activity...</p>}
      {!isLoading && activities.length === 0 && <p style={styles.description}>No activity yet.</p>}
      <div style={styles.timeline}>{activities.map((activity) => 
        <ProjectActivityItem key={activity.id} activity={activity} />)}</div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { 
    marginTop: spacing.xl, 
    paddingTop: spacing.xl, 
    borderTop: `1px solid ${colors.border.default}`, 
  },
  title: { 
    color: colors.text.main, 
    fontSize: "20px", 
    fontWeight: typography.fontWeight.black, 
    marginBottom: spacing.lg, 
  },
  timeline: { 
    display: "flex" as const, 
    flexDirection: "column" as const, 
    gap: spacing.lg, 
  },
  description: { 
    color: colors.text.muted, 
    fontSize: "14px", 
    margin: 0, 
  },
};