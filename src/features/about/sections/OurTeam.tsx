import React from "react";
import { HeroSection } from "../../../shared/sections";
import { Button } from "../../../shared/ui/Button";
import { teamMembers } from "../data/team.data";

export const OurTeam: React.FC = () => {
  return (
    <section style={styles.container}>
      <div style={styles.headerRow} className="team-header-row">
        <HeroSection
          badgeText="THE TEAM"
          titleStart="The People Behind"
          titleAccent="Devbysam."
          subtitle="A focused technical team combining software engineering, product thinking, and modern digital execution."
          headingAs="h2"
          containerStyle={styles.header}
        />

        <div style={styles.headerAction} className="team-header-action">
          <Button to="/contact" style={styles.joinButton}>
            Join the Team
          </Button>
        </div>
      </div>

      <div style={styles.grid} className="team-grid">
        {teamMembers.map((member) => (
          <article key={member.name} style={styles.card} className="team-card">
            <div style={styles.imageWrapper} className="team-image-wrapper">
              <img
                src={member.image}
                alt={member.imageAlt}
                style={styles.image}
                className="team-image"
              />
            </div>

            <div style={styles.content}>
              <p style={styles.role} className="mono-text">
                {member.role}
              </p>

              <h3 style={styles.name}>{member.name}</h3>

              <p style={styles.description}>{member.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const styles = {
  container: {
    padding: "100px 0",
    backgroundColor: "var(--bg-dark)",
    borderTop: "1px solid var(--border-color)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "32px",
  },

  header: {
    maxWidth: "680px",
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
    gap: "24px",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    overflow: "hidden",
    transition:
      "border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
  },

  imageWrapper: {
    width: "100%",
    height: "320px",
    overflow: "hidden",
    backgroundColor: "#111",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
    transition: "transform 0.5s ease",
  },

  content: {
    padding: "32px",
  },

  role: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    color: "var(--accent-green)",
    margin: "0 0 12px 0",
    textTransform: "uppercase" as const,
  },

  name: {
    fontSize: "24px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 12px 0",
    letterSpacing: "-0.5px",
  },

  description: {
    fontSize: "15px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: 0,
  },

  joinButton: {
    borderRadius: "8px",
    padding: "14px 28px",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
};
