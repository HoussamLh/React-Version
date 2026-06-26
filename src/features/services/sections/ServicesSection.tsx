import React from "react";
import { spacing, colors } from "../../../design-system";
import { ServiceCard } from "../components/ServiceCard";
import type { ServiceCardAccent } from "../components/ServiceCard";
import { services } from "../data/services.data";

const hoverAccents: ServiceCardAccent[] = ["green", "purple", "blue", "pink"];

export const ServicesSection: React.FC = () => {
  return (
    <section style={styles.container}>
      <div className="ds-card-grid services-grid">
        {services.map((service, index) => (
          <ServiceCard
            key={service.title}
            {...service}
            hoverAccent={hoverAccents[index % hoverAccents.length]}
          />
        ))}
      </div>
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    marginBottom: spacing["3xl"],
  },
};
