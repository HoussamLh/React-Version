import React from "react";
import { HeroSection } from "./HeroSection";
import { IconBox } from "../ui/IconBox";
import { Badge } from "../ui/Badge";

export type FeatureGridItem = {
  title: string;
  text: string;
  icon: React.ReactNode;
  image?: string;
  imageAlt?: string;
  pills?: string[];
  span?: string;
  badge?: string;
  monitoring?: boolean;
};

export type FeatureGridSectionProps = {
  badgeText?: string;
  titleStart?: string;
  titleAccent?: string;
  subtitle?: string;
  headingAs?: "h1" | "h2";

  cards: FeatureGridItem[];

  sectionStyle?: React.CSSProperties;
  heroContainerStyle?: React.CSSProperties;
  gridClassName?: string;
};

export const FeatureGridSection: React.FC<FeatureGridSectionProps> = ({
  badgeText,
  titleStart,
  titleAccent,
  subtitle,
  headingAs = "h2",
  cards,
  sectionStyle,
  heroContainerStyle,
  gridClassName,
}) => {
  const hasHero = badgeText && titleStart && subtitle;

  return (
    <section style={{ ...styles.container, ...sectionStyle }}>
      {hasHero && (
        <HeroSection
          badgeText={badgeText}
          titleStart={titleStart}
          titleAccent={titleAccent}
          subtitle={subtitle}
          headingAs={headingAs}
          containerStyle={heroContainerStyle}
        />
      )}

      <div
        style={styles.grid}
        className={`feature-grid team-grid ${gridClassName || ""}`}
      >
        {cards.map((card) => (
          <FeatureGridCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
};

type FeatureGridCardProps = {
  card: FeatureGridItem;
};

const FeatureGridCard: React.FC<FeatureGridCardProps> = ({ card }) => {
  const avatarStyles = [
    styles.avatarFirst,
    styles.avatarSecond,
    styles.avatarThird,
  ];

  const hasImageAndPills = Boolean(card.image && card.pills?.length);

  return (
    <div
      style={{
        ...styles.card,
        gridColumn: card.span,
      }}
      className="feature-card team-card"
    >
      <div style={styles.iconRow}>
        <div
          style={{
            ...styles.iconGroup,
            gap: card.badge ? "70px" : "12px",
          }}
        >
          <IconBox>{card.icon}</IconBox>

          {card.badge && <Badge label={card.badge} />}
        </div>
      </div>

      <h3 style={styles.cardTitle}>{card.title}</h3>

      <p style={styles.cardText}>{card.text}</p>

      {card.image && (
        <div
          style={{
            ...styles.graphicSide,
            ...(hasImageAndPills ? styles.graphicSideWithPills : {}),
          }}
          className="team-image-wrapper"
        >
          <img
            src={card.image}
            alt={card.imageAlt || card.title}
            style={styles.graphicImage}
            className="team-image"
          />
        </div>
      )}

      {card.pills && (
        <div
          style={{
            ...styles.pillContainer,
            ...(card.image ? styles.pillContainerAfterImage : {}),
          }}
        >
          {card.pills.map((pill) => (
            <span key={pill} style={styles.pill} className="mono-text">
              {pill}
            </span>
          ))}
        </div>
      )}

      {card.monitoring && (
        <div style={styles.monitoringRow}>
          <div style={styles.avatarGroup}>
            {avatarStyles.map((avatarStyle, index) => (
              <div key={index} style={{ ...styles.avatar, ...avatarStyle }} />
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
  container: {
    backgroundColor: "var(--bg-dark)",
    padding: "20px 0",
    marginBottom: "60px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "24px",
  },

  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "24px",
    padding: "32px",
    minHeight: "340px",
    overflow: "hidden",
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "stretch",
    textAlign: "left" as const,
    transition:
      "border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
  },

  iconRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: "28px",
  },

  iconGroup: {
    display: "flex",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: "24px",
    fontWeight: 800,
    color: "var(--text-main)",
    margin: "0 0 14px 0",
    letterSpacing: "-0.5px",
  },

  cardText: {
    fontSize: "15px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    margin: "0 0 28px 0",
    maxWidth: "520px",
  },

  graphicSide: {
    width: "100%",
    height: "220px",
    borderRadius: "18px",
    overflow: "hidden",
    marginTop: "auto",
    border: "1px solid var(--border-color)",
  },

  graphicSideWithPills: {
    marginBottom: "20px",
  },

  graphicImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },

  pillContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    marginTop: "auto",
  },

  pillContainerAfterImage: {
    marginTop: "0",
  },

  pill: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--accent-green)",
    backgroundColor: "rgba(116, 245, 66, 0.08)",
    border: "1px solid rgba(116, 245, 66, 0.2)",
    borderRadius: "999px",
    padding: "6px 10px",
    letterSpacing: "0.8px",
  },

  monitoringRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "auto",
  },

  avatarGroup: {
    display: "flex",
    alignItems: "center",
  },

  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid var(--bg-card)",
    backgroundColor: "var(--accent-green)",
  },

  avatarFirst: {
    backgroundColor: "#74F542",
  },

  avatarSecond: {
    backgroundColor: "#93b5ff",
    marginLeft: "-10px",
  },

  avatarThird: {
    backgroundColor: "#c49bff",
    marginLeft: "-10px",
  },

  monitoringText: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-muted)",
    letterSpacing: "0.8px",
  },
};
