import React from "react";
import { colors, spacing } from "../../../design-system";

type LiveChatStateTextTone = "muted" | "warning";

type LiveChatStateTextProps = {
  children: React.ReactNode;
  tone?: LiveChatStateTextTone;
  marginTop?: boolean;
};

export const LiveChatStateText: React.FC<LiveChatStateTextProps> = ({
  children,
  tone = "muted",
  marginTop = false,
}) => {
  return (
    <p
      style={{
        ...styles.text,
        ...(tone === "warning" ? styles.warning : styles.muted),
        ...(marginTop ? styles.marginTop : {}),
      }}
    >
      {children}
    </p>
  );
};

const styles = {
  text: {
    fontSize: "13px",
    lineHeight: "18px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  muted: {
    color: colors.text.muted,
  },

  warning: {
    color: colors.accent.yellow,
  },

  marginTop: {
    margin: `${spacing.lg} 0 0 0`,
  },
};
