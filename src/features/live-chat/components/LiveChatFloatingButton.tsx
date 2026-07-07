import React from "react";
import { MessageSquareCode, X } from "lucide-react";
import { colors } from "../../../design-system";

type LiveChatFloatingButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export const LiveChatFloatingButton: React.FC<LiveChatFloatingButtonProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Close live chat" : "Open live chat"}
      className={!isOpen ? "ds-float-subtle" : undefined}
      style={styles.bubble}
      onClick={onClick}
    >
      {isOpen ? <X size={24} /> : <MessageSquareCode size={24} />}
    </button>
  );
};

const styles = {
  bubble: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(147, 220, 92, 0.28)",
    pointerEvents: "auto" as const,
  },
};
