import React from "react";
import { MapPin } from "lucide-react";
import { colors, spacing } from "../../../design-system";

type ContactInfoFooterProps = {
  location: string;
};

export const ContactInfoFooter: React.FC<ContactInfoFooterProps> = ({
  location,
}) => {
  return (
    <div style={styles.bottomContent}>
      <div style={styles.divider} />

      <div style={styles.contactVisual}>
        <span style={{ ...styles.circle, backgroundColor: "#6B6F7B" }} />
        <span
          style={{ ...styles.circle, backgroundColor: colors.accent.pink }}
        />
        <span style={{ ...styles.circle, backgroundColor: colors.text.main }} />
      </div>

      <div style={styles.footerWrapper}>
        <MapPin size={20} />
        <span>{location}</span>
      </div>
    </div>
  );
};

const styles = {
  bottomContent: {
    flexShrink: 0,
  },

  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#252731",
    marginBottom: "26px",
  },

  contactVisual: {
    display: "flex",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  circle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "block",
    marginRight: "-8px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  footerWrapper: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    fontSize: "13px",
    lineHeight: "18px",
    color: colors.text.muted,
    fontFamily: "JetBrains Mono, monospace",
    letterSpacing: "0.02em",
  },
};
