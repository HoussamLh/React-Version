export type AdminProjectRequestType =
  | "website"
  | "mobile_app"
  | "backend_system"
  | "maintenance"
  | "other";

export type AdminProjectRequestPackageCategory =
  | "build_plan"
  | "maintenance_plan"
  | "custom";

export type AdminProjectRequestStatus =
  | "submitted"
  | "reviewed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type AdminProjectRequest = {
  id: string;
  customerId: string;
  
  customerEmail: string;
  customerName: string;
  customerCompany: string;
  customerPhone: string;

  title: string;
  projectType: AdminProjectRequestType;

  selectedPackage: string;
  packageCategory: AdminProjectRequestPackageCategory;

  budgetRange: string;
  timeline: string;

  description: string;
  goals: string;

  status: AdminProjectRequestStatus;
  adminNotes: string;

  createdAt: string;
  updatedAt: string;
};

export type AdminProjectRequestUpdateValues = {
  status: AdminProjectRequestStatus;
  adminNotes: string;
};
