import type { ReactNode } from "react";
import webImg from "../../../Assets/services/web-dev.png";
import mobileImg from "../../../Assets/services/mobile-app.png";
import backendImg from "../../../Assets/services/backend-img.png";

import { Code, Smartphone, Server, ShieldCheck } from "lucide-react";

export type ServiceIcon = "code" | "smartphone" | "server" | "shield-check";

export type ServiceAccent =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "yellow"
  | "cyan";

export type Service = {
  title: string;
  text: string;
  image?: string | null;
  icon: ReactNode;
  pills?: string[];
  span?: string;
  badge?: string | null;
  monitoring?: boolean;
  hoverAccent?: ServiceAccent;
};

export const services: Service[] = [
  {
    title: "Web Development",
    text: "React, Next.js and TypeScript applications engineered for speed, scalability, and UX excellence.",
    image: webImg,
    icon: <Code size={32} color="var(--accent-green)" />,
    pills: ["REACT", "TYPESCRIPT", "NEXT.JS"],
    span: "span 2",
    hoverAccent: "green",
  },
  {
    title: "Mobile Apps",
    text: "Cross-platform mobile apps with Flutter & React Native.",
    image: mobileImg,
    icon: <Smartphone size={32} color="var(--accent-purple)" />,
    pills: ["FLUTTER", "IOS"],
    span: "span 1",
    hoverAccent: "purple",
  },
  {
    title: "Backend Systems",
    text: "Scalable APIs, microservices, and cloud-native architecture.",
    image: backendImg,
    icon: <Server size={32} color="var(--accent-blue)" />,
    span: "span 2",
    hoverAccent: "blue",
  },
  {
    title: "Maintenance & Support",
    text: "Continuous monitoring, security patches, and iterative improvements to keep your software reliable and secure.",
    icon: <ShieldCheck size={32} color="var(--accent-pink)" />,
    span: "span 1",
    badge: "Proactive",
    monitoring: true,
    hoverAccent: "pink",
  },
];
