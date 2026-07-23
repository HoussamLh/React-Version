import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { CustomerProjectRequest } from "../types/customerProjects.types";

type ProjectActivityTimelineProps = {
  project: CustomerProjectRequest;
};

export const ProjectActivityTimeline: React.FC<
  ProjectActivityTimelineProps
> = ({ project }) => {
  const activities = [
    {
      title: "Project request submitted",
      description: "Your project request was successfully submitted.",
      date: project.createdAt,
      completed: true,
    },

    {
      title: "Project reviewed",
      description:
        project.status === "submitted"
          ? "Waiting for DevBySam review."
          : "DevBySam reviewed your project request.",
      date: project.updatedAt,
      completed: project.status !== "submitted",
    },

    {
      title: "Development started",
      description:
        project.status === "in_progress"
          ? "Your project is currently being worked on."
          : "Development has not started yet.",
      date: project.updatedAt,
      completed:
        project.status === "in_progress" || project.status === "completed",
    },

    {
      title: "Project completed",
      description:
        project.status === "completed"
          ? "Your project has been completed."
          : "Project completion pending.",
      date: project.updatedAt,
      completed: project.status === "completed",
    },
  ];

  return (
    <section style={styles.container}>
      <h3 style={styles.title}>Project Activity</h3>

      <div style={styles.timeline}>
        {activities.map((activity) => (
          <div key={activity.title} style={styles.item}>
            <div
              style={{
                ...styles.circle,
                ...(activity.completed ? styles.completedCircle : {}),
              }}
            >
              {activity.completed ? "✓" : ""}
            </div>

            <div>
              <h4 style={styles.activityTitle}>{activity.title}</h4>

              <p style={styles.description}>{activity.description}</p>

              <span style={styles.date}>
                {new Date(activity.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
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
    display: "flex",
    flexDirection: "column",
    gap: spacing.lg,
  },

  item: {
    display: "flex",
    gap: spacing.md,
    alignItems: "flex-start",
  },

  circle: {
    width: "28px",
    height: "28px",
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    border: `1px solid ${colors.border.default}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.muted,
    flexShrink: 0,
  },

  completedCircle: {
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    borderColor: colors.accent.green,
  },

  activityTitle: {
    color: colors.text.main,
    fontSize: "15px",
    margin: 0,
    fontWeight: typography.fontWeight.bold,
  },

  description: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: `${spacing.xs} 0`,
  },

  date: {
    color: colors.text.muted,
    fontSize: "12px",
  },
};
