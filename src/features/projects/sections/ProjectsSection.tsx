import React from "react";
import { colors, spacing } from "../../../design-system";
import { ProjectCard } from "../components";
import { projects } from "../data/projects.data";

export const ProjectsSection: React.FC = () => {
  return (
    <section style={styles.container}>
      <div className="ds-card-grid" style={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
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
