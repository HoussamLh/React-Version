export type TrustHoverAccent = "green" | "blue" | "purple";

export type TrustStat = {
  value: string;
  label: string;
};

export type TrustFeature = {
  eyebrow: string;
  title: string;
  text: string;
  color: string;
  hoverAccent: TrustHoverAccent;
};

export const trustStats: TrustStat[] = [
  {
    value: "99.9%",
    label: "UPTIME",
  },
  {
    value: "50+",
    label: "SHIPPED",
  },
];

export const trustFeatures: TrustFeature[] = [
  {
    eyebrow: "Custom Web Apps",
    title: "Custom Web Apps",
    text: "Next.js and React architectures optimized for SEO and conversion.",
    color: "var(--accent-green)",
    hoverAccent: "green",
  },
  {
    eyebrow: "Mobile Solutions",
    title: "Mobile Solutions",
    text: "Native-feel experiences built with Flutter and React Native.",
    color: "var(--accent-blue)",
    hoverAccent: "blue",
  },
  {
    eyebrow: "Backend Systems",
    title: "Backend Systems",
    text: "Robust Node.js and Python APIs built to handle massive traffic.",
    color: "var(--accent-purple)",
    hoverAccent: "purple",
  },
];
