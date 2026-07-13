import React from "react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminPricingStatus } from "../pricingCms.types";
import { AdminPricingStatusBadge } from "./AdminPricingStatusBadge";

type AdminPricingListCardProps = {
  title: string;
  eyebrow?: string;
  price?: string;
  suffix?: string | null;
  description?: string;
  status: AdminPricingStatus;
  recommended?: boolean;
  metaItems?: string[];
  children?: React.ReactNode;
};

export const AdminPricingListCard: React.FC<AdminPricingListCardProps> = ({
  title,
  eyebrow,
  price,
  suffix,
  description,
  status,
  recommended = false,
  metaItems = [],
  children,
}) => {
  return (
    <article style={styles.card}>
      <div style={styles.topRow}>
        <div>
          {eyebrow && (
            <span style={styles.eyebrow} className="mono-text">
              {eyebrow}
            </span>
          )}

          <h3 style={styles.title}>{title}</h3>
        </div>

        <div style={styles.badges}>
          {recommended && <span style={styles.recommended}>Recommended</span>}
          <AdminPricingStatusBadge status={status} />
        </div>
      </div>

      {price && (
        <div style={styles.priceRow}>
          <span style={styles.price}>{price}</span>
          {suffix && <span style={styles.suffix}>{suffix}</span>}
        </div>
      )}

      {description && <p style={styles.description}>{description}</p>}

      {metaItems.length > 0 && (
        <div style={styles.metaList}>
          {metaItems.map((item) => (
            <span key={item} style={styles.metaItem}>
              {item}
            </span>
          ))}
        </div>
      )}

      {children && <div style={styles.content}>{children}</div>}
    </article>
  );
};

const styles = {
  card: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: spacing.lg,
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: spacing.md,
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },

  eyebrow: {
    color: colors.accent.green,
    fontSize: "11px",
    lineHeight: "16px",
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
  },

  title: {
    color: colors.text.main,
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: typography.fontWeight.black,
    margin: `${spacing.xs} 0 0 0`,
  },

  badges: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.xs,
    flexWrap: "wrap" as const,
  },

  recommended: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: radius.pill,
    fontSize: "11px",
    lineHeight: 1,
    fontWeight: typography.fontWeight.black,
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    backgroundColor: "rgba(116, 245, 66, 0.12)",
    border: `1px solid ${colors.accent.green}`,
    color: colors.accent.green,
  },

  priceRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  price: {
    color: colors.text.main,
    fontSize: "30px",
    lineHeight: "34px",
    fontWeight: typography.fontWeight.black,
    letterSpacing: "-0.02em",
  },

  suffix: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    marginBottom: "2px",
  },

  description: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: `0 0 ${spacing.md} 0`,
  },

  metaList: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.pill,
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    padding: `${spacing.xs} ${spacing.sm}`,
  },

  content: {
    marginTop: spacing.md,
  },
};
