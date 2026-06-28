import React from "react";
import heroImg from "../../../Assets/heroImg.png";
import {
  AccentText,
  Card,
  radius,
  spacing,
  SharedHero,
} from "../../../design-system";
import { HeroTerminalCard } from "../components/HeroTerminalCard";

export const Hero: React.FC = () => {
  return (
    <SharedHero
      badgeText="NEXT-GEN ARCHITECTURE"
      titleStart="Engineering The"
      titleAccent="Future"
      titleEnd="of Web Design"
      subtitle={
        <>
          We build robust, high-performance digital products for tech-forward
          founders. Precision-engineered code meets{" "}
          <AccentText>Modern</AccentText> corporate minimalism.
        </>
      }
      actions={[
        {
          label: (
            <>
              View Pricing
              <span style={{ marginLeft: spacing.sm }}>→</span>
            </>
          ),
          to: "/pricing",
        },
        {
          label: "Contact Us",
          to: "/contact",
          variant: "secondary",
        },
      ]}
      visual={
        <>
          <Card interactive 
          hoverAccent="green" 
          style={styles.imageWindow}>
            <div style={styles.heroMedia}>
              <img
                src={heroImg}
                alt="Devbysam Hero Image"
                className="ds-card-image ds-zoom-image"
                style={styles.imageRender}
              />
            </div>
          </Card>
          <HeroTerminalCard />
        </>
      }
    />
  );
};

const styles = {
  imageWindow: {
    width: "100%",
    height: "450px",
    backgroundColor: "#131518",
    borderRadius: radius.lg,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heroMedia: {
    width: "100%",
    height: "100%",
    minHeight: "unset",
    marginBottom: 0,
    border: "none",
    borderRadius: radius.lg,
    overflow: "hidden",
  },

  imageRender: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    display: "block",
  },
};
