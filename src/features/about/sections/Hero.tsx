import React from "react";
import heroImage from "../../../Assets/heroAbout.png";
import {
  AccentText,
  Card,
  Heading,
  Label,
  radius,
  shadows,
  spacing,
  Text,
} from "../../../design-system";

export const Hero: React.FC = () => {
  return (
    <section style={styles.container} className="about-hero">
      {/* Left Column */}
      <div style={styles.content} className="about-hero-content">
        <Label
          text="ENGINEERED FOR TECHNICAL AUTHORITY"
          badgeStyle={styles.badge}
        />

        <Heading as="h1" variant="hero" style={styles.heading}>
          Architecting the Future of <AccentText>Digital Commerce.</AccentText>
        </Heading>

        <Text variant="hero" style={styles.subtitle}>
          Devbysam, we engineer scalable, resilient systems that empower
          enterprise stakeholders and forward-thinking founders to lead their
          industries with confidence.
        </Text>
      </div>

      {/* Right Column */}
      <div style={styles.visual} className="home-hero-visual">
        <Card
          interactive
          hoverAccent="blue"
          style={styles.imageCard}>
          <img
            src={heroImage}
            alt="Data Center Server Infrastructure"
            style={styles.image}
            className="ds-zoom-image"
          />
        </Card>
      </div>
    </section>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: spacing["3xl"],
    alignItems: "center",
    padding: `${spacing["4xl"]} 0 60px 0`,
  },

  content: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },

  badge: {
    marginBottom: spacing.xl,
  },

  heading: {
    maxWidth: "760px",
  },

  subtitle: {
    maxWidth: "620px",
    marginBottom: 0,
  },

  visual: {
    display: "flex",
    justifyContent: "center",
  },

  imageCard: {
    width: "100%",
    maxWidth: "520px",
    height: "420px",
    borderRadius: radius["2xl"],
    overflow: "hidden",
    boxShadow: shadows.card,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },
};
