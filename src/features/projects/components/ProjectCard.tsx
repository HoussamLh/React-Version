import React from "react";
import {
  Card,
  colors,
  spacing,
  typography,
} from "../../../design-system";
import type { Project } from "../data/projects.data";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const isVideoProject = project.mediaType === "video";

  return (
    <Card
      interactive
      hoverAccent={project.hoverAccent}
      className="ds-card-stack"
      style={{ gridColumn: project.span }}
    >
      <div
        className="ds-card-media"
        style={{
          height: project.imageHeight,
          marginBottom: "24px",
          position: "relative",
        }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="ds-card-image ds-zoom-image"
          />
        ) : (
          <div style={styles.mediaPlaceholder}>No media preview</div>
        )}

        {isVideoProject && <span style={styles.videoBadge}>Video</span>}
      </div>

      <div>
        <h3 className="ds-card-title">{project.title}</h3>

        <p className="ds-card-text">{project.text}</p>
      </div>

      <div className="ds-pill-row" style={{ marginTop: "24px" }}>
        {project.tags.map((tag) => (
          <span key={tag} className="ds-pill mono-text">
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
};

const styles = {
  mediaPlaceholder: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.muted,
    fontSize: "13px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  videoBadge: {
    position: "absolute" as const,
    right: spacing.md,
    top: spacing.md,
    borderRadius: "999px",
    backgroundColor: "rgba(0, 0, 0, 0.62)",
    color: colors.text.main,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    border: `1px solid ${colors.border.default}`,
  },
};
