import React, { useEffect, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { ServiceCard } from "../components/ServiceCard";
import type { Service } from "../data/services.data";
import { getPublishedServices } from "../api";

export const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsServices = await getPublishedServices();

          if (!isMounted) return;

          setServices(cmsServices);
          setError(null);
        } catch (error) {
          console.error("Could not load CMS services:", error);

          if (!isMounted) return;

          setError("Services could not be loaded right now.");
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
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
      {isLoading && (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Loading services...</p>
        </div>
      )}

      {!isLoading && error && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Services unavailable</h2>
          <p style={styles.stateText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div style={styles.stateBox}>
          <h2 style={styles.stateTitle}>Services coming soon</h2>
          <p style={styles.stateText}>
            New services will be published here soon.
          </p>
        </div>
      )}

      {!isLoading && !error && services.length > 0 && (
        <div className="ds-card-grid services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              {...service}
              hoverAccent={service.hoverAccent ?? "green"}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
    marginBottom: spacing["3xl"],
  },

  stateBox: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    textAlign: "center" as const,
  },

  stateTitle: {
    color: colors.text.main,
    fontSize: "22px",
    lineHeight: "28px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `${spacing.sm} 0 0 0`,
  },
};
