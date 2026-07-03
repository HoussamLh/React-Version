import React from "react";
import { MessageCircle } from "lucide-react";
import {
  AccentText,
  Button,
  colors,
  radius,
  spacing,
  typography,
} from "../../../design-system";

import SupportAgent from "../../../Assets/about/SupportAgent.png";
import JackHImg from "../../../Assets/about/JackHImg.png";
import ShannonRImg from "../../../Assets/about/ShannonRImg.png";

const teamAvatars = [
  {
    src: SupportAgent,
    alt: "Support Agent",
  },
  {
    src: JackHImg,
    alt: "DevBySam developer",
  },
  {
    src: ShannonRImg,
    alt: "DevBySam consultant",
  },
];

export const CTASection: React.FC = () => {
  return (
    <section style={styles.container} className="ds-section">
      <div style={styles.card}>
        <div style={styles.overlay} />

        <div style={styles.content}>
          <div style={styles.avatarGroup}>
            {teamAvatars.map((avatar) => (
              <img
                key={avatar.alt}
                src={avatar.src}
                alt={avatar.alt}
                style={styles.avatar}
              />
            ))}
          </div>

          <h2 style={styles.title}>
            Prefer a real-time <AccentText>conversation?</AccentText>
          </h2>

          <p style={styles.text}>
            Use live chat for quick technical questions, project triage, or to
            discuss the right package before starting your project.
          </p>

          <Button to="/contact">
            <span style={styles.buttonInner}>
              <MessageCircle size={18} />
              Launch Live Session
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: colors.background.dark,
  },

  card: {
    position: "relative" as const,
    overflow: "hidden",
    borderRadius: radius["2xl"],
    border: `1px solid ${colors.border.default}`,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    padding: `${spacing["4xl"]} ${spacing.xl}`,
    textAlign: "center" as const,
  },

  overlay: {
    position: "absolute" as const,
    inset: 0,
    background:
      "radial-gradient(circle at top, rgba(147, 220, 92, 0.12), transparent 45%)",
    pointerEvents: "none" as const,
  },

  content: {
    position: "relative" as const,
    zIndex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: spacing.lg,
  },

  avatarGroup: {
    display: "flex",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },

  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: `4px solid ${colors.background.card}`,
    objectFit: "cover" as const,
    backgroundColor: colors.background.card,
    marginLeft: "-12px",
  },

  title: {
    fontSize: "40px",
    lineHeight: "48px",
    fontWeight: typography.fontWeight.black,
    color: colors.text.main,
    margin: 0,
  },

  text: {
    maxWidth: "680px",
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.relaxed,
    color: colors.text.muted,
    margin: 0,
  },

  buttonInner: {
    display: "inline-flex",
    alignItems: "center",
    gap: spacing.sm,
  },
};
