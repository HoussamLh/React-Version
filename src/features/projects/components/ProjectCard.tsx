import React from "react";
import { Card } from "../../../design-system";
import type { Project } from "../data/projects.data";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="ds-card-image ds-zoom-image"
        />
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
