export type WorkflowStep = {
  number: string;
  title: string;
  description: string;
};

export const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    title: "Discovery",
    description: "Understanding requirements and constraints.",
  },
  {
    number: "02",
    title: "Architecture",
    description: "Designing scalable system architecture.",
  },
  {
    number: "03",
    title: "Development",
    description: "Agile implementation with CI/CD pipelines.",
  },
  {
    number: "04",
    title: "Deployment",
    description: "Zero-downtime production releases.",
  },
];
