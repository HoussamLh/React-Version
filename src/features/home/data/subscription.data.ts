export type SubscriptionPlan = {
  tier: string;
  price: string;
  title: string;
  description: string;
  features: string[];
  buttonLabel: string;
  featured?: boolean;
};

export const subscriptionPlans: 
SubscriptionPlan[] = [
  {
    tier: "STATIC",
    price: "40",
    title: "Maintenance",
    description:
      "Best for landing pages, portfolio sites, and simple corporate layouts.",
    features: ["24/7 Monitoring", "Style & Layout Fixes", "Fix Within 24-Hour"],
    buttonLabel: "Protect Site",
  },
  {
    tier: "DYNAMIC",
    price: "80",
    title: "Full-Stack",
    description:
      "Best for dynamic web apps featuring databases, payment flows, and user state.",
    features: [
      "Core Maintenance",
      "Database Management",
      "API Connection Fixes",
      "Fix Within 24-Hour",
    ],
    buttonLabel: "Protect App",
    featured: true,
  },
  {
    tier: "ENTERPRISE",
    price: "100",
    title: "Tech Authority",
    description:
      "Best for e-commerce stores, custom SaaS products, and active scale ups.",
    features: [
      "Full-Stack Shield",
      "U-Interface State Fixes",
      "Payment Restorations",
      "4-Hour Emergency Fix",
    ],
    buttonLabel: "Go Enterprise",
  },
];
