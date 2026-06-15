import React from "react";
import { Label } from "../ui/Label";

export type HeroSectionProps = {
  badgeText: string;
  titleStart: string;
  titleAccent?: string;
  subtitle: string;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  badgeText,
  titleStart,
  titleAccent,
  subtitle,
}) => {
  return (
    <section style={styles.container}>
      <Label text={badgeText} />

      {/* Title */}
      <h1 style={styles.title}>
        {titleStart}
        {titleAccent && (
          <>
            <br />
            <span style={styles.accentText}>{titleAccent}</span>
          </>
        )}
      </h1>

      {/* Subtitle */}
      <p style={styles.subtitle}>{subtitle}</p>
    </section>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
  },

  title: {
    fontSize: "56px",
    fontWeight: 800,
    letterSpacing: "-1.5px",
    color: "var(--text-main)",
    lineHeight: "1.15",
    margin: "0 0 24px 0",
  },

  accentText: {
    color: "var(--accent-green)",
  },

  subtitle: {
    fontSize: "16px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    maxWidth: "640px",
    margin: "0 0 60px 0",
  },
};
