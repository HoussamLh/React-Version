import React from "react";
import { services } from "../data/services.data";
import { ServiceCard } from "../components/ServiceCard";

export const ServicesSection: React.FC = () => {
  return (
    <section style={styles.container}>
      <div style={styles.grid} className="team-grid">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
};

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
