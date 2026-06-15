import type { FeatureGridItem } from "../../../shared/sections/FeatureGridSection";

import coreAboutImg from "../../../Assets/coreAbout.png";
import backendImg from "../../../Assets/services/backend-img.png";

import { Code, Smartphone, Server, RefreshCcw } from "lucide-react";

export const coreDomains: FeatureGridItem[] = [
  {
    title: "Complex Web Applications",
    text: "Engineering high-performance, scalable web platforms with clean architecture, modern frontend systems, and maintainable codebases.",
    icon: <Code size={32} color="var(--accent-green)" />,
    image: coreAboutImg,
    imageAlt: "Complex web application architecture",
    pills: ["REACT", "TYPESCRIPT", "ARCHITECTURE"],
    span: "span 2",
  },
  {
    title: "Native & Cross-Platform",
    text: "Building mobile-first digital experiences with responsive interfaces and cross-platform delivery in mind.",
    icon: <Smartphone size={32} color="var(--accent-green)" />,
    pills: ["MOBILE", "UI/UX"],
    span: "span 1",
  },
  {
    title: "Backend Systems",
    text: "Designing reliable APIs, database structures, authentication flows, and cloud-ready backend logic.",
    icon: <Server size={32} color="var(--accent-green)" />,
    pills: ["APIS", "DATABASES"],
    span: "span 1",
  },
  {
    title: "Legacy Modernization",
    text: "Refactoring outdated systems into cleaner, faster, and more maintainable digital products ready for future growth.",
    icon: <RefreshCcw size={32} color="var(--accent-green)" />,
    image: backendImg,
    imageAlt: "Backend modernization and infrastructure",
    pills: ["REFACTORING", "SCALABILITY", "MAINTENANCE"],
    span: "span 2",
  },
];
