import React from "react";
import { Code, Server, ShieldCheck, Smartphone } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../../design-system";
import type { AdminService } from "../types/servicesCms.types";

type AdminServiceCardProps = {
  service: AdminService;
  isDeleting: boolean;
  onEdit: (service: AdminService) => void;
  onDelete: (service: AdminService) => void;
};

const serviceIconMap: Record<AdminService["icon"], React.ReactNode> = {
  code: <Code size={22} />,
  smartphone: <Smartphone size={22} />,
  server: <Server size={22} />,
  "shield-check": <ShieldCheck size={22} />,
};

const getServiceStatusStyle = (status: AdminService["status"]) => {
  if (status === "published") {
    return styles.publishedBadge;
  }

  return styles.draftBadge;
};

export const AdminServiceCard: React.FC<AdminServiceCardProps> = ({
  service,
  isDeleting,
  onEdit,
  onDelete,
}) => {
  return (
    <article style={styles.serviceCard}>
      {service.imageUrl ? (
        <div style={styles.mediaWrap}>
          <img
            src={service.imageUrl}
            alt={service.title}
            style={styles.mediaImage}
          />
        </div>
      ) : (
        <div style={styles.noMediaBox}>No image</div>
      )}

      <div style={styles.serviceContent}>
        <div style={styles.serviceTopRow}>
          <div style={styles.serviceTitleWrap}>
            <span style={styles.iconBox}>{serviceIconMap[service.icon]}</span>

            <div>
              <h2 style={styles.serviceTitle}>{service.title}</h2>

              <p style={styles.serviceSlug}>/{service.slug}</p>
            </div>
          </div>

          <span
            style={{
              ...styles.statusBadge,
              ...getServiceStatusStyle(service.status),
            }}
          >
            {service.status}
          </span>
        </div>

        <p style={styles.serviceText}>{service.text}</p>

        <div style={styles.metaGrid}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Icon</span>
            <span style={styles.metaValue}>{service.icon}</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Layout</span>
            <span style={styles.metaValue}>{service.span}</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Accent</span>

            <span style={styles.metaValue}>{service.hoverAccent}</span>
          </div>

          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Order</span>
            <span style={styles.metaValue}>{service.sortOrder}</span>
          </div>
        </div>

        <div style={styles.pillRow}>
          {service.pills.map((pill) => (
            <span key={pill} style={styles.pill}>
              {pill}
            </span>
          ))}
        </div>

        <div style={styles.flagRow}>
          {service.badge && (
            <span style={styles.flagBadge}>{service.badge}</span>
          )}

          {service.monitoring && (
            <span style={styles.monitoringBadge}>24/7 Monitoring</span>
          )}
        </div>

        <div style={styles.cardActions}>
          <button
            type="button"
            style={styles.editButton}
            onClick={() => onEdit(service)}
          >
            Edit
          </button>

          <button
            type="button"
            style={{
              ...styles.deleteButton,
              ...(isDeleting ? styles.disabledButton : {}),
            }}
            disabled={isDeleting}
            onClick={() => onDelete(service)}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
};

const styles = {
  serviceCard: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.xl,
    backgroundColor: colors.background.dark,
    overflow: "hidden",
  },

  mediaWrap: {
    height: "180px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  mediaImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },

  noMediaBox: {
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.muted,
    fontSize: "13px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  serviceContent: {
    padding: spacing.lg,
  },

  serviceTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  serviceTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    minWidth: 0,
  },

  iconBox: {
    width: "42px",
    height: "42px",
    borderRadius: radius.md,
    backgroundColor: "rgba(116, 245, 66, 0.1)",
    color: colors.accent.green,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  serviceTitle: {
    color: colors.text.main,
    fontSize: "17px",
    lineHeight: "22px",
    margin: 0,
    fontWeight: typography.fontWeight.bold,
  },

  serviceSlug: {
    color: colors.text.muted,
    fontSize: "12px",
    margin: "4px 0 0 0",
  },

  statusBadge: {
    borderRadius: "999px",
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase" as const,
  },

  publishedBadge: {
    color: colors.accent.green,
    backgroundColor: "rgba(116, 245, 66, 0.1)",
    border: `1px solid rgba(116, 245, 66, 0.35)`,
  },

  draftBadge: {
    color: colors.text.muted,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: `1px solid ${colors.border.default}`,
  },

  serviceText: {
    color: colors.text.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: `${spacing.md} 0`,
  },

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: spacing.sm,
  },

  metaItem: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    padding: spacing.sm,
  },

  metaLabel: {
    display: "block",
    color: colors.text.muted,
    fontSize: "11px",
    marginBottom: "4px",
  },

  metaValue: {
    color: colors.text.main,
    fontSize: "12px",
    fontWeight: typography.fontWeight.bold,
  },

  pillRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  pill: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: "999px",
    color: colors.text.muted,
    padding: "5px 9px",
    fontSize: "11px",
  },

  flagRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  flagBadge: {
    border: `1px solid rgba(196, 155, 255, 0.35)`,
    borderRadius: "999px",
    backgroundColor: "rgba(196, 155, 255, 0.08)",
    color: colors.accent.purple,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },

  monitoringBadge: {
    border: `1px solid rgba(147, 181, 255, 0.35)`,
    borderRadius: "999px",
    backgroundColor: "rgba(147, 181, 255, 0.08)",
    color: colors.accent.blue,
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: typography.fontWeight.bold,
  },

  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.border.default}`,
  },

  editButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  deleteButton: {
    border: `1px solid rgba(255, 90, 90, 0.45)`,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 90, 90, 0.08)",
    color: "#ff7777",
    padding: `${spacing.sm} ${spacing.md}`,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
  },

  disabledButton: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
