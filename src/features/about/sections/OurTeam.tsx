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
import type { TeamCardAccent } from "../components/TeamMemberCard";
import {
  teamMembers as fallbackTeamMembers,
  type TeamMember,
} from "../data/team.data";
import { getPublishedTeamMembers } from "../api";

const hoverAccents: TeamCardAccent[] = ["green", "purple", "blue", "pink"];

export const OurTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(fallbackTeamMembers);

  useEffect(() => {
    let isMounted = true;

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const cmsMembers = await getPublishedTeamMembers();

          if (!isMounted || cmsMembers.length === 0) return;

          setMembers(cmsMembers);
        } catch (error) {
          console.error("Could not load CMS team members:", error);
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

      <div style={styles.grid} className="ds-grid ds-grid-2">
        {members.map((member, index) => (
          <TeamMemberCard
            key={member.name}
            member={member}
            hoverAccent={
              member.hoverAccent ?? hoverAccents[index % hoverAccents.length]
            }
          />
        ))}
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
};
