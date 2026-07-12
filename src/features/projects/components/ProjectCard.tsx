import React from "react";
import { Card, colors, spacing, typography } from "../../../design-system";
import type { Project } from "../data/projects.data";

type ProjectCardProps = {
  project: Project;
  onPlayVideo?: (project: Project) => void;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPlayVideo,
}) => {
  const isVideoProject = project.mediaType === "video" && project.videoUrl;

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

        {isVideoProject && (
          <button
            type="button"
            style={styles.playButton}
            onClick={() => onPlayVideo?.(project)}
          >
            ▶ Play Demo
          </button>
        )}
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

  playButton: {
    position: "absolute" as const,
    left: spacing.md,
    bottom: spacing.md,
    border: "1px solid rgba(255, 255, 255, 0.22)",
    borderRadius: "999px",
    backgroundColor: "rgba(0, 0, 0, 0.66)",
    color: colors.text.main,
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
    backdropFilter: "blur(10px)",
  },
};
