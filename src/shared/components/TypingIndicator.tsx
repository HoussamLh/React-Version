import React from "react";
import { colors, spacing } from "../../design-system";

type TypingIndicatorProps = {
  label?: string;
  marginTop?: boolean;
};

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  label = "Typing",
  marginTop = false,
}) => {
  return (
    <div
      aria-label={label}
      role="status"
      style={{
        ...styles.wrapper,
        ...(marginTop ? styles.marginTop : {}),
      }}
    >
      <span className="typing-dot-delay-1" style={styles.dot} />
      <span className="typing-dot-delay-2" style={styles.dot} />
      <span style={styles.dot} />
    </div>
  );
};

const styles = {
  wrapper: {
    width: "fit-content",
    minWidth: "54px",
    minHeight: "34px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: `0 ${spacing.md}`,
    borderRadius: "18px 18px 18px 6px",
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 8px 22px rgba(0, 0, 0, 0.22)",
  },

  marginTop: {
    marginTop: spacing.lg,
  },

  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: colors.text.muted,
    display: "block",
    animation: "liveChatTypingDot 1.4s infinite ease-in-out both",
  },
};
