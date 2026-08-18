export type AdminPricingStatus = "draft" | "published";

export type AdminPricingPlan = {
  id: string;
  name: string;
  label: string;
  price: string;
  suffix: string | null;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  recommended: boolean;
  status: AdminPricingStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminPricingPlanFormValues = {
  name: string;
  label: string;
  price: string;
  suffix: string | null;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  recommended: boolean;
  status: AdminPricingStatus;
  sortOrder: number;
};

export type AdminMaintenancePlan = {
  id: string;
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  recommended: boolean;
  status: AdminPricingStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminMaintenancePlanFormValues = {
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  recommended: boolean;
  status: AdminPricingStatus;
  sortOrder: number;
};

export type AdminEmergencyRestoration = {
  id: string;
  title: string;
  price: string;
  suffix: string;
  text: string;
  status: AdminPricingStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminEmergencyRestorationFormValues = {
  title: string;
  price: string;
  suffix: string;
  text: string;
  status: AdminPricingStatus;
};

export type AdminComparisonRow = {
  id: string;
  feature: string;
  standard: string;
  advanced: string;
  premium: string;
  status: AdminPricingStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminComparisonRowFormValues = {
  feature: string;
  standard: string;
  advanced: string;
  premium: string;
  status: AdminPricingStatus;
  sortOrder: number;
};
