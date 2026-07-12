export type PricingPlan = {
  name: string;
  label: string;
  price: string;
  suffix?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  recommended?: boolean;
};

export type MaintenancePlan = {
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  recommended?: boolean;
};

export type EmergencyRestoration = {
  title: string;
  price: string;
  suffix: string;
  text: string;
};

export type ComparisonRow = {
  feature: string;
  standard: string;
  advanced: string;
  premium: string;
};
