import React, { useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";

type ContactActionRowProps = {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  active?: boolean;
};

const ContactActionRow: React.FC<ContactActionRowProps> = ({
  href,
  label,
  value,
  icon,
  active = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        ...styles.actionRow,
        ...(isHovered ? styles.actionRowHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.rowContent}>
        <span
          style={{
            ...styles.statusDot,
            ...(active || isHovered ? styles.statusDotActive : {}),
          }}
        />

        <div style={styles.rowText}>
          <p style={styles.rowLabel}>{label}</p>

          <p
            style={{
              ...styles.rowValue,
              ...(isHovered ? styles.rowValueHover : {}),
            }}
          >
            {value}
          </p>
        </div>
      </div>

      <span
        style={{
          ...styles.rowIcon,
          ...(isHovered ? styles.rowIconHover : {}),
        }}
      >
        {icon}
      </span>
    </a>
  );
};

export const ContactInfoItem: React.FC = () => {
  return (
    <div style={styles.card}>
      <div style={styles.topContent}>
        <div style={styles.topRow}>
          <div style={styles.iconBox}>
            <Mail size={24} />
          </div>
          <span style={styles.badge}>Contact Details</span>
        </div>

        <h2 style={styles.title}>Give us a call</h2>

        <p style={styles.text}>
          Reach out to us via email or phone, and we'll get back to you as soon as possible. 
          We look forward to hearing from you!
        </p>
      </div>

      <div style={styles.middleContent}>
        <ContactActionRow
          href="mailto:contact@devbysam.co.uk"
          label="Email our team"
          value="contact@devbysam.co.uk"
          icon={<ArrowUpRight size={20} />}
          active
        />

        <ContactActionRow
          href="tel:07777920892"
          label="Call Our Team"
          value="0 77 77 92 08 92"
          icon={<Phone size={20} />}
        />
      </div>

      <div style={styles.bottomContent}>
        <div style={styles.divider} />

        <div style={styles.contactVisual}>
          <span 
          style={{ ...styles.circle, 
          backgroundColor: "#6B6F7B" 
          }} />
          <span
            style={{ ...styles.circle, 
              backgroundColor: colors.accent.pink 
            }}/>
          <span
            style={{ ...styles.circle, 
              backgroundColor: colors.text.main 
            }}/>
        </div>

        <div style={styles.footerWrapper}>
          <MapPin size={20} />
          <span>United Kingdom / Remote</span>
        </div>
      </div>
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
    padding: "8px 12px",
    borderRadius: radius.sm,
    border: `1px solid ${colors.accent.pink}`,
    color: colors.accent.pink,
    fontSize: "12px",
    lineHeight: "12px",
    fontWeight: typography.fontWeight.bold,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
  },

  title: {
    fontSize: "24px",
    lineHeight: "36px",
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

  actionRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: "rgba(26, 28, 36, 0.5)",
    border: "1px solid transparent",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },

  actionRowHover: {
    borderColor: "rgba(255, 155, 196, 0.3)",
    backgroundColor: "#1A1C24",
  },

  rowContent: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    minWidth: 0,
  },

  rowText: {
    minWidth: 0,
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#6B6F7B",
    flexShrink: 0,
    transition: "all 0.3s ease",
  },

  statusDotActive: {
    backgroundColor: colors.accent.pink,
    boxShadow: "0 0 8px rgba(255, 155, 196, 0.5)",
  },

  rowLabel: {
    fontSize: "11px",
    color: "#6B6F7B",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontWeight: typography.fontWeight.bold,
    margin: `0 0 4px 0`,
  },

  rowValue: {
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: typography.fontWeight.bold,
    color: "#d1d5db",
    margin: 0,
    transition: "color 0.3s ease",
    wordBreak: "break-word" as const,
  },

  rowValueHover: {
    color: colors.text.main,
  },

  rowIcon: {
    color: "#6B6F7B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "color 0.3s ease",
  },

  rowIconHover: {
    color: colors.accent.pink,
  },

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
