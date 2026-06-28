import React from "react";
import { CTASection, HeroSection, ProjectsSection } from "../features/projects";

export const Projects: React.FC = () => {
  return (
    <div className="ds-page">
      <HeroSection />
      <ProjectsSection />
      <CTASection />
    </div>
  );
};
