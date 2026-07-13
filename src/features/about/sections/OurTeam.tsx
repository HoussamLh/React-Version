import React, { useEffect, useState } from "react";
import {
  Button,
  colors,
  SectionHeader,
  spacing,
  radius,
  typography,
} from "../../../design-system";
import { TeamMemberCard } from "../components/TeamMemberCard";
import type { TeamMember } from "../data/team.data";
import { getPublishedTeamMembers } from "../api";

export const OurTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsMembers = await getPublishedTeamMembers();

          if (!isMounted) return;

          setMembers(cmsMembers);
          setError(null);
        } catch (error) {
          console.error("Could not load CMS team members:", error);

          if (!isMounted) return;

          setError("Team members could not be loaded right now.");
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
      <div style={styles.headerRow} className="ds-grid ds-grid-2">
        <SectionHeader
          badgeText="Our Technical TEAM"
          title="People Behind"
          titleAccent="Devbysam."
          subtitle="A focused technical team combining software engineering, product thinking, and modern digital execution."
          headingAs="h2"
          containerStyle={styles.header}
          textWrapperStyle={styles.textWrapper}
        />

        <div style={styles.headerAction}>
          <Button to="/contact" style={styles.joinButton}>
            Join the Team
          </Button>
        </div>
      </div>

      {isLoading && (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Loading team members...</p>
        </div>
      )}

      {!isLoading && error && (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>Team unavailable</h3>
          <p style={styles.stateText}>{error}</p>
        </div>
      )}

      {!isLoading && !error && members.length === 0 && (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>Team coming soon</h3>
          <p style={styles.stateText}>
            Published team members will appear here soon.
          </p>
        </div>
      )}

      {!isLoading && !error && members.length > 0 && (
        <div style={styles.grid} className="ds-grid ds-grid-2">
          {members.map((member) => (
            <TeamMemberCard
              key={member.name}
              member={member}
              hoverAccent={member.hoverAccent ?? "green"}
            />
          ))}
        </div>
      )}
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
    alignItems: "flex-start",
    gap: spacing.xl,
    marginBottom: spacing["3xl"],
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
    gap: spacing.lg,
  },

  joinButton: {
    borderRadius: radius.sm,
    padding: `14px 28px`,
    fontSize: typography.fontSize.sm,
    whiteSpace: "nowrap" as const,
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
