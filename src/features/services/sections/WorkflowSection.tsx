import React from "react";
import { ProcessSection } from "../../../shared/sections";
import { workflowSteps } from "../data/workflow.data";

export const WorkflowSection: React.FC = () => {
  return (
    <ProcessSection
      titleStart="Our Technical"
      titleAccent="Workflow."
      subtitle="A structured engineering process that ensures predictable, scalable results."
      steps={workflowSteps}
      gridClassName="workflow-grid"
      cardClassName="workflow-step"
      circleClassName="build-process"
    />
  );
};
