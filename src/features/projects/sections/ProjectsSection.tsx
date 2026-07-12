import React, { useEffect, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { ProjectCard } from "../components";
import type { Project } from "../data/projects.data";
import { getPublishedProjects } from "../services";

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsProjects = await getPublishedProjects();

          if (!isMounted) return;

          setProjects(cmsProjects);
          setError(null);
        } catch (error) {
          console.error("Could not load CMS projects:", error);

          if (!isMounted) return;

          setError("Projects could not be loaded right now.");
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      })();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section style={styles.container}>
      {isLoading && (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Loading projects...</p>
        </div>
      )}

      {!isLoading && error && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Projects unavailable</h2>
          <p style={styles.stateText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Projects coming soon</h2>
          <p style={styles.stateText}>
            New selected work will be published here soon.
          </p>
        </div>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="ds-card-grid" style={styles.grid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id ?? project.slug ?? project.title}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    marginBottom: spacing["3xl"],
  },

  grid: {
    gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
  },

  stateBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  stateTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
