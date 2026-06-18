import React from "react";
import { 
  colors, 
  radius, 
  spacing, 
  typography 
} from "../../components/tokens";
import { Button } from "../Button";
import { Card } from "../Card";
import { 
  Heading, 
  Text 
} from "../Typography";

type CTAAction = {
  label: React.ReactNode;
  to: string;
};

type CallToActionProps = {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;

  containerStyle?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
  headingStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
};

export const CallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  containerStyle,
  cardStyle,
  headingStyle,
  subtitleStyle,
}) => {
  return (
    <section style={{ ...styles.container, ...containerStyle }}>
      <Card
        style={{ ...styles.card, ...cardStyle }}
        className="call-to-action-card"
      >
        <div style={styles.gridOverlay} />

        <div style={styles.content}>
          <Heading
            as="h2"
            variant="section"
            style={{ ...styles.heading, ...headingStyle }}
          >
            {title}
          </Heading>

          <Text
            variant="body"
            style={{ ...styles.subheading, ...subtitleStyle }}
          >
            {subtitle}
          </Text>

          <div style={styles.btnGroup}>
            <Button to={primaryAction.to} style={styles.primaryButton}>
              {primaryAction.label}
            </Button>

            {secondaryAction && (
              <Button
                to={secondaryAction.to}
                variant="secondary"
                style={styles.secondaryButton}
                className="mono-text"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
};

const styles = {
  container: {
    padding: `${spacing["4xl"]} 0 120px 0`,
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },

  card: {
    borderRadius: radius["3xl"],
    padding: `${spacing["4xl"]} ${spacing["2xl"]}`,
    position: "relative" as const,
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  gridOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "radial-gradient(rgba(147, 181, 255, 0.45) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    opacity: 0.4,
    maskImage:
      "linear-gradient(to bottom, transparent, rgba(0,0,0,1) 50%, transparent)",
    WebkitMaskImage:
      "linear-gradient(to bottom, transparent, rgba(0,0,0,1) 50%, transparent)",
    pointerEvents: "none" as const,
  },

  content: {
    position: "relative" as const,
    zIndex: 2,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    maxWidth: "680px",
  },

  heading: {
    fontSize: "44px",
    fontWeight: typography.fontWeight.black,
    letterSpacing: "-1.5px",
    margin: `0 0 20px 0`,
    lineHeight: typography.lineHeight.tight,
  },

  subheading: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.relaxed,
    margin: `0 0 ${spacing["2xl"]} 0`,
    maxWidth: "580px",
  },

  btnGroup: {
    display: "flex",
    gap: spacing.md,
    flexWrap: "wrap" as const,
    justifyContent: "center",
  },

  primaryButton: {
    fontSize: typography.fontSize.lg,
    padding: `${spacing.md} ${spacing.xl}`,
  },

  secondaryButton: {
    fontSize: typography.fontSize.lg,
    padding: `${spacing.md} ${spacing.xl}`,
  },
};
