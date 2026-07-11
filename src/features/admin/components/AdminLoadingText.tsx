import React from "react";
import { colors, spacing } from "../../../design-system";

type AdminLoadingTextProps = {
  children: React.ReactNode;
  padded?: boolean;
};

export const AdminLoadingText: React.FC<AdminLoadingTextProps> = ({
  children,
  padded = false,
}) => {
  return (
    <p
      style={{
        ...styles.text,
        ...(padded ? styles.padded : {}),
      }}
    >
      {children}
    </p>
  );
};

const styles = {
  text: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  },

  padded: {
    padding: spacing.lg,
  },
};
