import React from "react";
import { ProcessSection } from "../../shared/sections";
import { buildProcessSteps } from "./data/buildProcess.data";

export const BuildProcess: React.FC = () => {
  return (
    <ProcessSection
      titleStart="Our Build Process"
      subtitle="We follow a rigorous, methodology-driven approach to ensure every line of code serves your strategic business objectives."
      steps={buildProcessSteps}
      gridClassName="workflow-grid"
      cardClassName="workflow-step"
      circleClassName="build-process"
    />
  );
};
