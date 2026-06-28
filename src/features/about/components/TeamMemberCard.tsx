import React from "react";
import {
  Card,
  colors,
  radius,
  spacing,
  typography,
} from "../../../design-system";
import type { TeamMember } from "../data/team.data";

export type TeamCardAccent = "green" | "blue" | "purple" | "pink";

type TeamMemberCardProps = {
  member: TeamMember;
  hoverAccent: TeamCardAccent;
};

const accentColors: Record<TeamCardAccent, string> = {
  green: colors.accent.green,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  pink: colors.accent.pink,
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  hoverAccent,
}) => {
  const accentColor = accentColors[hoverAccent];

  return (
    <Card interactive hoverAccent={hoverAccent} style={styles.card}>
      <div style={styles.imageWrapper} className="ds-image-hover-frame">
        <img
          src={member.image}
          alt={member.imageAlt}
          style={styles.image}
          className="ds-zoom-image"
        />
      </div>

      <div style={styles.content}>
        <p
          style={{
            ...styles.role,
            color: accentColor,
          }}
          className="mono-text"
        >
          {member.role}
        </p>

        <h3 style={styles.name}>{member.name}</h3>

        <p style={styles.description}>{member.description}</p>
      </div>
    </Card>
  );
};

const styles = {
  card: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
  },

  imageWrapper: {
    width: "100%",
    height: "320px",
    overflow: "hidden",
    backgroundColor: "#111111",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },

  content: {
    padding: spacing.xl,
  },

  role: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "1.2px",
    margin: `0 0 ${spacing.md} 0`,
    textTransform: "uppercase" as const,
  },

  name: {
    fontSize: "24px",
    fontWeight: typography.fontWeight.extraBold,
    color: colors.text.main,
    margin: `0 0 ${spacing.md} 0`,
    letterSpacing: "-0.5px",
  },

  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.muted,
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
  },
};
