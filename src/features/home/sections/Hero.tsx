import React from "react";
import heroImg from "../../../Assets/heroImg.png";
import {
  AccentText,
  Button,
  colors,
  Heading,
  Label,
  radius,
  shadows,
  spacing,
  Text,
} from "../../../design-system";
import { 
  HeroTerminalCard 
} from "../components/HeroTerminalCard";

export const Hero: React.FC = () => {
  return (
    <section style={styles.heroContainer} 
    className="home-hero">
      {/* Left Column: Copy & CTA */}
      <div style={styles.leftCol} 
      className="home-hero-left">
        <Label text="NEXT-GEN ARCHITECTURE" 
        badgeStyle={styles.badge} />

        <Heading as="h1" variant="hero">
          Engineering The 
          <AccentText>Future</AccentText> 
          of Web Design & Mobile
        </Heading>

        <Text variant="hero">
          We build robust, high-performance digital 
          products for tech-forward founders. 
          Precision-engineered code meets{" "}
          <AccentText>modern</AccentText> 
          corporate minimalism.
        </Text>

        <div style={styles.ctaGroup}>
          <Button to="/pricing" style={styles.primaryLink}>
            View Pricing <span 
            style={{ marginLeft: spacing.sm }}
            >→</span>
          </Button>

          <Button
            to="/contact"
            variant="secondary"
            style={styles.secondaryLink}
            className="mono-text">
            Contact Us
          </Button>
        </div>
      </div>

      {/* Right Column: Visual Terminal Display Hero Image */}
      <div style={styles.rightCol} 
      className="home-hero-visual">
        <div style={styles.mockupContainer} 
        className="home-hero-mockup">
          <div style={styles.imageWindow}>
            <img
              src={heroImg}
              alt="Devbysam Hero Image"
              style={styles.imageRender}
              className="ds-zoom-image"
            />
          </div>

          <HeroTerminalCard />
        </div>
      </div>
    </section>
  );
};

const styles = {
  heroContainer: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: spacing["2xl"],
    alignItems: "center",
    padding: `${spacing["4xl"]} 0`,
  },

  leftCol: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },

  badge: {
    marginBottom: spacing.xl,
  },

  ctaGroup: {
    display: "flex",
    gap: spacing.md,
    flexWrap: "wrap" as const,
  },

  primaryLink: {
    backgroundColor: colors.accent.green,
    color: "#000000",
    border: "none",
    padding: `14px ${spacing.lg}`,
    borderRadius: radius.sm,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "15px",
    boxShadow: "none",
  },

  secondaryLink: {
    color: colors.text.main,
    backgroundColor: "transparent",
    border: `1px solid ${colors.accent.green}`,
    padding: `14px ${spacing.lg}`,
    borderRadius: radius.sm,
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "none",
  },

  rightCol: {
    display: "flex",
    justifyContent: "center",
    position: "relative" as const,
    overflow: "visible",
  },

  mockupContainer: {
    position: "relative" as const,
    width: "100%",
    maxWidth: "500px",
    overflow: "visible",
  },

  imageWindow: {
    width: "100%",
    height: "450px",
    backgroundColor: "#131518",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    boxShadow: shadows.card,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  imageRender: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },
};
