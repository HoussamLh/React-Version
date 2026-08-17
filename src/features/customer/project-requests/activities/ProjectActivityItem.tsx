import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { ProjectActivity } from "./projectActivity.types";

type Props = { activity: ProjectActivity };
export const ProjectActivityItem: React.FC<Props> = ({ activity }) => (
  <div style={styles.item}>
    <div style={styles.circle}>✓</div>
    <div>
      <h4 style={styles.title}>{activity.type}</h4>
      <p style={styles.description}>{activity.message}</p>
      <span style={styles.date}>{new Date(activity.createdAt).toLocaleString()}</span>
    </div>
  </div>
);
const styles = {
  item: { 
    display: "flex" as const, 
    gap: spacing.md, 
    alignItems: "flex-start", 
  },
  circle: { 
    width: "28px", 
    height: "28px", 
    borderRadius: radius.xl, 
    backgroundColor: colors.accent.green, 
    color: colors.background.dark, 
    display: "flex" as const, 
    alignItems: "center", 
    justifyContent: "center", 
    flexShrink: 0, 
  },
  title: { 
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
