import React from "react";
import webImg from "../../Assets/services/web-dev.png";
import mobileImg from "../../Assets/services/mobile-app.png";
import backendImg from "../../Assets/services/backend-img.png";

import { Code, Smartphone, Server, ShieldCheck } from "lucide-react";
import { ServiceCard } from "./components/ServiceCard";

export const ServicesSection: React.FC = () => {
  return (
    <section style={styles.container}>
      <div style={styles.grid} className="team-grid">
        {services.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
    </section>
  );
};

/* =======================
   DATA LAYER
======================= */

const services = [
  {
    title: "Web Development",
    text: "React, Next.js and TypeScript applications engineered for speed, scalability, and UX excellence.",
    image: webImg,
    icon: <Code size={32} color="var(--accent-green)" />,
    pills: ["REACT", "TYPESCRIPT", "NEXT.JS"],
    span: "span 2",
  },
  {
    title: "Mobile Apps",
    text: "Cross-platform mobile apps with Flutter & React Native.",
    image: mobileImg,
    icon: <Smartphone size={32} color="var(--accent-green)" />,
    pills: ["FLUTTER", "IOS"],
    span: "span 1",
  },
  {
    title: "Backend Systems",
    text: "Scalable APIs, microservices, and cloud-native architecture.",
    image: backendImg,
    icon: <Server size={32} color="var(--accent-green)" />,
    span: "span 2",
  },
  {
    title: "Maintenance & Support",
    text: "Continuous monitoring, security patches, and iterative improvements to keep your software reliable and secure.",
    icon: <ShieldCheck size={32} color="var(--accent-green)" />,
    span: "span 1",

    badge: "Proactive",

    monitoring: true,
  },
];

/* =======================
   INLINE STYLES
======================= */

const styles = {
  container: {
    backgroundColor: "var(--bg-dark)",
    padding: "20px 0",
    marginBottom: "60px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "24px",
  },
};
