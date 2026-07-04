import React from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import {
  ExceptionalCard,
  colors,
  radius,
  spacing,
  typography,
} from "../../../design-system";
import { contactInfo } from "../data/contactInfo.data";
import { ContactActionRow } from "./ContactActionRow";
import { ContactInfoFooter } from "./ContactInfoFooter";

export const ContactInfoItem: React.FC = () => {
  return (
    <ExceptionalCard
      icon={<Mail size={28} />}
      badge={contactInfo.badge}
      title={contactInfo.title}
      text={contactInfo.text}
      accent="pink"
      style={styles.card}
      titleStyle={styles.title}
      textStyle={styles.text}
      bodyStyle={styles.middleContent}
      footer={<ContactInfoFooter location={contactInfo.location} />}
    >
      <ContactActionRow
        href={contactInfo.email.href}
        label={contactInfo.email.label}
        value={contactInfo.email.value}
        icon={<ArrowUpRight size={24} />}
        active
      />

      <ContactActionRow
        href={contactInfo.phone.href}
        label={contactInfo.phone.label}
        value={contactInfo.phone.value}
        icon={<Phone size={24} />}
      />
    </ExceptionalCard>
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
