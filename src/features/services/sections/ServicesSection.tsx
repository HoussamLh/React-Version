import React, { useEffect, useState } from "react";
import { spacing, colors } from "../../../design-system";
import { ServiceCard } from "../components/ServiceCard";
import type { ServiceCardAccent } from "../components/ServiceCard";
import { services as fallbackServices } from "../data/services.data";
import type { Service } from "../data/services.data";
import { getPublishedServices } from "../api";

const hoverAccents: ServiceCardAccent[] = [
  "green",
  "purple",
  "blue",
  "pink",
  "yellow",
  "cyan",
];

export const ServicesSection: React.FC = () => {
  const [displayedServices, setDisplayedServices] =
    useState<Service[]>(fallbackServices);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsServices = await getPublishedServices();

          if (!isMounted || cmsServices.length === 0) return;

          setDisplayedServices(cmsServices);
        } catch (error) {
          console.error("Could not load CMS services:", error);
        }
      })();
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section style={styles.container}>
      <div className="ds-card-grid services-grid">
        {displayedServices.map((service, index) => (
          <ServiceCard
            key={service.title}
            {...service}
            hoverAccent={
              service.hoverAccent ?? hoverAccents[index % hoverAccents.length]
            }
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
