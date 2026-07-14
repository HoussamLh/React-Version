export type ProjectRequestType =
  | "website"
  | "mobile_app"
  | "backend_system"
  | "maintenance"
  | "other";

export type ProjectRequestPackageCategory =
  | "build_plan"
  | "maintenance_plan"
  | "custom";

export type ProjectRequestStatus =
  | "submitted"
  | "reviewed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type CustomerProjectRequest = {
  id: string;
  customerId: string;

  title: string;
  projectType: ProjectRequestType;

  selectedPackage: string;
  packageCategory: ProjectRequestPackageCategory;

  budgetRange: string;
  timeline: string;

  description: string;
  goals: string;

  status: ProjectRequestStatus;
  adminNotes: string;

  createdAt: string;
  updatedAt: string;
};

export type CustomerProjectRequestFormValues = {
  title: string;
  projectType: ProjectRequestType;

  selectedPackage: string;
  packageCategory: ProjectRequestPackageCategory;

  budgetRange: string;
  timeline: string;

  description: string;
  goals: string;
};
