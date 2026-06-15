import React from "react";
import { IconBox } from "../../../shared/ui/IconBox";
import { Badge } from "../../../shared/ui/Badge";
import type { Service } from "../data/services.data";

type ServiceCardProps = Service;

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  text,
  image,
  icon,
  pills,
  span,
  badge,
  monitoring,
}) => {
  const avatarStyles = [
    styles.avatarFirst,
    styles.avatarSecond,
    styles.avatarThird,
  ];

  return (
    <div style={{ ...styles.card, gridColumn: span }} className="team-card">
      {/* Icon + Badge */}
      <div style={styles.iconRow}>
        <div
          style={{
            ...styles.iconGroup,
            gap: badge ? "70px" : "12px",
          }}
        >
          <IconBox>{icon}</IconBox>

          {badge && <Badge label={badge} />}
        </div>
      </div>

      <h3 style={styles.cardTitle}>{title}</h3>

      <p style={styles.cardText}>{text}</p>

      {image && (
        <div style={styles.graphicSide} className="team-image-wrapper">
          <img
            src={image}
            style={styles.graphicImage}
            className="team-image"
            alt={title}
          />
        </div>
      )}

      {pills && (
        <div style={styles.pillContainer}>
          {pills.map((pill) => (
            <span key={pill} style={styles.pill} className="mono-text">
              {pill}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Monitoring Section */}
      {monitoring && (
        <div style={styles.monitoringRow}>
          <div style={styles.avatarGroup}>
            {avatarStyles.map((avatarStyle, index) => (
              <div
                key={index}
                style={{
                  ...styles.avatar,
                  ...avatarStyle,
                }}
              />
            ))}
          </div>

          <span style={styles.monitoringText} className="mono-text">
            24/7 Monitoring Dashboard
          </span>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    transition:
      "transform 0.35s ease,border-color 0.35s ease,box-shadow 0.35s ease",
  },

  iconRow: {
    marginBottom: "10px",
  },

  iconGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  cardTitle: {
    fontSize: "25px",
    fontWeight: 700,
    color: "var(--text-main)",
    margin: "0 0 10px 0",
  },

  cardText: {
    fontSize: "13px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 8px 0",
  },

  graphicSide: {
    width: "100%",
    height: "220px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border-color)",
    marginBottom: "10px",
  },

  graphicImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transition: "transform .5s ease",
  },

  pillContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
  },

  pill: {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--text-main)",
    border: "1px solid var(--border-color)",
    padding: "4px 12px",
    borderRadius: "12px",
  },

  monitoringRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "25px",
    marginTop: "25px",
  },

  avatarGroup: {
    display: "flex",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid var(--bg-card)",
    marginLeft: "-10px",
  },

  avatarFirst: {
    marginLeft: "0",
    backgroundColor: "var(--text-muted)",
  },

  avatarSecond: {
    backgroundColor: "var(--accent-green)",
  },

  avatarThird: {
    backgroundColor: "var(--text-main)",
  },

  monitoringText: {
    fontSize: "12px",
    color: "var(--text-main)",
  },
};
