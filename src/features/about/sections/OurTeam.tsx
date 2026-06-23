import React from "react";
import {
  Button,
  Card,
  colors,
  radius,
  SectionHeader,
  spacing,
  typography,
} from "../../../design-system";
import { teamMembers } from "../data/team.data";

type HoverAccent = "green" | "blue" | "purple" | "pink";

const hoverAccents: HoverAccent[] = ["green", "purple", "blue", "pink"];

const accentColors: Record<HoverAccent, string> = {
  green: colors.accent.green,
  blue: colors.accent.blue,
  purple: colors.accent.purple,
  pink: colors.accent.pink,
};

export const OurTeam: React.FC = () => {
  return (
    <section style={styles.container}>
      <div style={styles.headerRow} className="team-header-row">
        <SectionHeader
          badgeText="Our Technical TEAM"
          title="People Behind"
          titleAccent="Devbysam."
          subtitle="A focused technical team combining software engineering, product thinking, and modern digital execution."
          headingAs="h2"
          containerStyle={styles.header}
          textWrapperStyle={styles.textWrapper}
        />

        <div style={styles.headerAction} className="team-header-action">
          <Button to="/contact" style={styles.joinButton}>
            Join the Team
          </Button>
        </div>
      </div>

      <div style={styles.grid} className="team-grid">
        {teamMembers.map((member, index) => {
          const hoverAccent = hoverAccents[index % hoverAccents.length];
          const accentColor = accentColors[hoverAccent];

          return (
            <Card
              key={member.name}
              interactive
              hoverAccent={hoverAccent}
              style={styles.card}
            >
              <div style={styles.imageWrapper} className="team-image-wrapper">
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
        })}
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: `${spacing.section} 0`,
    backgroundColor: colors.background.dark,
    borderTop: `1px solid ${colors.border.default}`,
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.xl,
  },

  header: {
    maxWidth: "680px",
  },

  textWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  },

  headerAction: {
    paddingTop: "52px",
    display: "flex",
    justifyContent: "flex-end",
    flexShrink: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: spacing.lg,
  },

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

  joinButton: {
    borderRadius: radius.sm,
    padding: `14px 28px`,
    fontSize: typography.fontSize.sm,
    whiteSpace: "nowrap" as const,
  },
};
