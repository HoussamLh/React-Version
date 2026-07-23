export type CustomerProjectStatus =
  | "submitted"
  | "reviewed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type CustomerProjectRequest = {
  id: string;
  customerId: string;

  title: string;
  projectType: string;

  selectedPackage: string;
  packageCategory: string;

  budgetRange: string;
  timeline: string;

  description: string;
  goals: string;

  status: CustomerProjectStatus;

  adminNotes: string;

  createdAt: string;
  updatedAt: string;
};
