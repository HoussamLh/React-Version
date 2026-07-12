import React, { useEffect, useState } from "react";
import { colors, spacing } from "../../../design-system";
import { ProjectCard } from "../components";
import { projects as fallbackProjects } from "../data/projects.data";
import type { Project } from "../data/projects.data";
import { getPublishedProjects } from "../services";

export const ProjectsSection: React.FC = () => {
  const [displayedProjects, setDisplayedProjects] =
    useState<Project[]>(fallbackProjects);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsProjects = await getPublishedProjects();

          if (!isMounted || cmsProjects.length === 0) return;

          setDisplayedProjects(cmsProjects);
        } catch (error) {
          console.error("Could not load CMS projects:", error);
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
      <div className="ds-card-grid" style={styles.grid}>
        {displayedProjects.map((project) => (
          <ProjectCard
            key={project.id ?? project.slug ?? project.title}
            project={project}
          />
        ))}
      </div>
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
};
