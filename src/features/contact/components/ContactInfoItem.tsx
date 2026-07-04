import React from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { contactInfo } from "../data/contactInfo.data";
import { ContactActionRow } from "./ContactActionRow";
import { ContactInfoFooter } from "./ContactInfoFooter";

export const ContactInfoItem: React.FC = () => {
  return (
    <div style={styles.card}>
      <div style={styles.topContent}>
        <div style={styles.topRow}>
          <div style={styles.iconBox}>
            <Mail size={24} />
          </div>

          <span style={styles.badge}>{contactInfo.badge}</span>
        </div>

        <h2 style={styles.title}>{contactInfo.title}</h2>

        <p style={styles.text}>{contactInfo.text}</p>
      </div>

      <div style={styles.middleContent}>
        <ContactActionRow
          href={contactInfo.email.href}
          label={contactInfo.email.label}
          value={contactInfo.email.value}
          icon={<ArrowUpRight size={20} />}
          active
        />

        <ContactActionRow
          href={contactInfo.phone.href}
          label={contactInfo.phone.label}
          value={contactInfo.phone.value}
          icon={<Phone size={20} />}
        />
      </div>

      <ContactInfoFooter location={contactInfo.location} />
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    height: "100%",
    minHeight: "560px",
    boxSizing: "border-box" as const,
    padding: "30px",
    borderRadius: radius.lg,
    backgroundColor: "#15161C",
    border: "1px solid #252731",
    color: colors.text.main,
    display: "flex",
    flexDirection: "column" as const,
  },

  topContent: {
    flexShrink: 0,
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },

  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: radius.lg,
    border: `1px solid ${colors.accent.pink}`,
    color: colors.accent.pink,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  badge: {
    padding: "7px 18px",
    borderRadius: radius.pill,
    border: `1px solid ${colors.accent.pink}`,
    color: colors.accent.pink,
    fontSize: "10px",
    lineHeight: "12px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
  },

  title: {
    fontSize: "28px",
    lineHeight: "34px",
    fontWeight: typography.fontWeight.black,
    color: colors.text.main,
    margin: `0 0 ${spacing.md} 0`,
    letterSpacing: "-0.03em",
    maxWidth: "300px",
  },

  text: {
    fontSize: "15px",
    lineHeight: "24px",
    color: colors.text.muted,
    margin: 0,
    maxWidth: "320px",
  },

  middleContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    gap: spacing.md,
    padding: `${spacing.xl} 0`,
  },
};
