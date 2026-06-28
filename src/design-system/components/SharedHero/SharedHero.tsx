import React from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { Label } from "../Label";
import { AccentText, Heading, Text } from "../Typography";
import { radius, spacing } from "../../tokens";

type HeroAction = {
  label: React.ReactNode;
  to: string;
  variant?: "primary" | "secondary";
  style?: React.CSSProperties;
  className?: string;
};

type HoverAccent = "green" | "blue" | "purple" | "pink" | "yellow" | "cyan";

type SharedHeroProps = {
  badgeText: React.ReactNode;

  titleStart: React.ReactNode;
  titleAccent?: React.ReactNode;
  titleEnd?: React.ReactNode;

  subtitle: React.ReactNode;

  image?: string;
  imageAlt?: string;

  visual?: React.ReactNode;

  actions?: HeroAction[];

  hoverAccent?: HoverAccent;
  className?: string;
  containerStyle?: React.CSSProperties;
};

export const SharedHero: React.FC<SharedHeroProps> = ({
  badgeText,
  titleStart,
  titleAccent,
  titleEnd,
  subtitle,
  image,
  imageAlt = "",
  visual,
  actions,
  hoverAccent = "green",
  className = "",
  containerStyle = {},
}) => {
  const hasVisual = Boolean(visual || image);

  return (
    <section
      style={{
        ...styles.heroContainer,
        ...(!hasVisual ? styles.textOnlyHeroContainer : {}),
        ...containerStyle,
      }}
      className={["ds-hero", className].filter(Boolean).join(" ")}
    >
      {/* Left Column */}
      <div style={styles.leftCol} className="ds-hero-left">
        <Label text={badgeText} badgeStyle={styles.badge} />

        <Heading as="h1" variant="hero">
          {titleStart}
          {titleAccent && (
            <>
              {" "}
              <AccentText>{titleAccent}</AccentText>
            </>
          )}
          {titleEnd && <> {titleEnd}</>}
        </Heading>

        <Text variant="hero">{subtitle}</Text>

        {actions && actions.length > 0 && (
          <div style={styles.ctaGroup}>
            {actions.map((action, index) => (
              <Button
                key={`${action.to}-${index}`}
                to={action.to}
                variant={action.variant ?? "primary"}
                style={action.style}
                className={action.className}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column */}
      {hasVisual && (
        <div style={styles.rightCol} 
        className="ds-hero-visual">
          <div style={styles.mockupContainer} 
          className="ds-hero-visual-inner">
            {visual || (
              <Card
                interactive
                hoverAccent={hoverAccent}
                style={styles.imageWindow}
              >
                <div style={styles.heroMedia}>
                  <img
                    src={image}
                    alt={imageAlt}
                    className="ds-card-image ds-zoom-image"
                    style={styles.imageRender}
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
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

  textOnlyHeroContainer: {
    gridTemplateColumns: "1fr",
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

  heroMedia: {
    width: "100%",
    height: "100%",
    minHeight: "unset",
    marginBottom: 0,
    border: "none",
    borderRadius: radius.lg,
    overflow: "hidden",
  },

  imageWindow: {
    width: "100%",
    height: "450px",
    backgroundColor: "#131518",
    borderRadius: radius.lg,
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
