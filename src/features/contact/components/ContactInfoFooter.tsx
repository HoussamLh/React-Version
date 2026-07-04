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
    <>
      <div style={styles.avatarGroup}>
        <span
          style={{ ...styles.avatar, backgroundColor: colors.text.muted }}
        />
        <span
          style={{ ...styles.avatar, backgroundColor: colors.accent.pink }}
        />
        <span style={{ ...styles.avatar, backgroundColor: colors.text.main }} />
      </div>

      <span style={styles.locationText} className="mono-text">
        <MapPin size={18} />
        {location}
      </span>
    </>
  );
};

const styles = {
  avatarGroup: {
    display: "flex",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    border: `2px solid ${colors.background.card}`,
    marginLeft: "-10px",
  },

  locationText: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    fontSize: "12px",
    color: colors.text.main,
  },
};
