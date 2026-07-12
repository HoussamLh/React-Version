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

export type ComparisonRow = {
  feature: string;
  standard: string;
  advanced: string;
  premium: string;
};

export type EmergencyRestoration = {
  title: string;
  price: string;
  suffix: string;
  text: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Basic",
    label: "Foundation",
    price: "£499",
    description:
      "A focused single-page build for validating an idea or launching a clean digital presence.",
    features: [
      "Single page",
      "Static architecture",
      "Mobile responsive",
      "Contact section",
    ],
    ctaLabel: "Start Building",
    ctaTo: "/contact",
  },
  {
    name: "Standard",
    label: "Growth",
    price: "£1,499",
    description:
      "A multi-page website for small businesses that need stronger structure and content depth.",
    features: [
      "Up to 5 pages",
      "Reusable sections",
      "CMS-ready structure",
      "Performance basics",
    ],
    ctaLabel: "Select Plan",
    ctaTo: "/contact",
  },
  {
    name: "Advanced",
    label: "Pro Engineering",
    price: "£3,499",
    description:
      "A custom web app package for businesses that need authentication, data, and scalable logic.",
    features: [
      "Custom web app",
      "Auth and database",
      "API development",
      "Speed optimization",
    ],
    ctaLabel: "Get Advanced",
    ctaTo: "/contact",
    recommended: true,
  },
  {
    name: "Premium",
    label: "Scale",
    price: "£8,499",
    description:
      "A production-grade platform for advanced workflows, integrations, and technical systems.",
    features: [
      "Microservices planning",
      "Real-time features",
      "Infrastructure setup",
      "Technical documentation",
    ],
    ctaLabel: "Contact Sales",
    ctaTo: "/contact",
  },
  {
    name: "Diamond",
    label: "Elite",
    price: "Custom",
    description:
      "A fully tailored engagement for complex platforms, white-label systems, and long-term delivery.",
    features: [
      "Enterprise white-label",
      "Dedicated delivery plan",
      "Priority support",
      "Custom architecture",
    ],
    ctaLabel: "Book Session",
    ctaTo: "/contact",
  },
];

export const maintenancePlans: MaintenancePlan[] = [
  {
    name: "Static Maintenance",
    price: "£40",
    suffix: "/mo",
    description:
      "For static websites that need essential monitoring, minor updates, and peace of mind.",
    features: [
      "SSL monitoring",
      "Minor content updates",
      "Monthly health check",
    ],
    ctaLabel: "Choose Static",
    ctaTo: "/contact",
  },
  {
    name: "Dynamic Maintenance",
    price: "£80",
    suffix: "/mo",
    description:
      "For dynamic websites or apps that need database, CMS, and dependency care.",
    features: ["Patch management", "CMS checks", "Performance review"],
    ctaLabel: "Choose Dynamic",
    ctaTo: "/contact",
    recommended: true,
  },
  {
    name: "Enterprise Maintenance",
    price: "£100",
    suffix: "/mo",
    description:
      "For production systems that require stronger technical monitoring and priority handling.",
    features: ["Priority support", "Security checks", "Technical audits"],
    ctaLabel: "Choose Enterprise",
    ctaTo: "/contact",
  },
];

export const comparisonRows: ComparisonRow[] = [
  {
    feature: "CI/CD pipeline setup",
    standard: "Optional",
    advanced: "Included",
    premium: "Included",
  },
  {
    feature: "Database integration",
    standard: "Basic",
    advanced: "Included",
    premium: "Advanced",
  },
  {
    feature: "API development",
    standard: "Optional",
    advanced: "Included",
    premium: "Advanced",
  },
  {
    feature: "Testing coverage",
    standard: "Basic",
    advanced: "Strong",
    premium: "Full",
  },
  {
    feature: "Technical documentation",
    standard: "Basic",
    advanced: "Included",
    premium: "Detailed",
  },
];

export const emergencyRestoration: EmergencyRestoration = {
  title: "Emergency Restoration",
  price: "£150",
  suffix: "one-time",
  text: "For already-broken websites, urgent fixes, failed deployments, or recovery work that needs immediate technical attention.",
};
