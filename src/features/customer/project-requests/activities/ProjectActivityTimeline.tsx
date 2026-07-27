import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { colors, radius, spacing, typography } from "../../../../design-system";
import { getProjectActivities } from "./projectActivity.services";
import type { ProjectActivity }  from "./projectActivity.types";

type ProjectActivityTimelineProps = {
  projectRequestId: string;
};

export const ProjectActivityTimeline: React.FC<
  ProjectActivityTimelineProps
> = ({ projectRequestId }) => {
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadActivities = async () => {
      try {
        const result = await getProjectActivities(projectRequestId);

        if (!mounted) {
          return;
        }

        setActivities(result);
      } catch (error) {
        console.error("Could not load project activities:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadActivities();

    return () => {
      mounted = false;
    };
  }, [projectRequestId]);

    useEffect(() => {
      if (!supabase) {
        return;
      }

      const client = supabase;

      const channel = client
        .channel(`project-activities-${projectRequestId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "project_activities",
            filter: `project_request_id=eq.${projectRequestId}`,
          },
          (payload) => {
            const row = payload.new as {
              id: string;
              project_request_id: string;
              type: string;
              message: string;
              created_at: string;
            };

            const newActivity: ProjectActivity = {
              id: row.id,
              projectRequestId: row.project_request_id,
              type: row.type,
              message: row.message,
              createdAt: row.created_at,
            };

            setActivities((current) => {
              const exists = current.some((item) => item.id === newActivity.id);

              if (exists) {
                return current;
              }

              return [...current, newActivity];
            });
          },
        )
        .subscribe();

      return () => {
        void client.removeChannel(channel);
      };
    }, [projectRequestId]);

  return (
    <section style={styles.container}>
      <h3 style={styles.title}>Project Activity</h3>

      {isLoading && <p style={styles.description}>Loading activity...</p>}

      {!isLoading && activities.length === 0 && (
        <p style={styles.description}>No activity yet.</p>
      )}

      <div style={styles.timeline}>
        {activities.map((activity) => (
          <div key={activity.id} style={styles.item}>
            <div style={styles.circle}>✓</div>

            <div>
              <h4 style={styles.activityTitle}>{activity.type}</h4>

              <p style={styles.description}>{activity.message}</p>

              <span style={styles.date}>
                {new Date(activity.createdAt).toLocaleString()}
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
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
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
