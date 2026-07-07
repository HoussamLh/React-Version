import React from "react";
import { Home, MessageSquare } from "lucide-react";
import { colors } from "../../../design-system";
import type { ChatView } from "../types/liveChat.types";

type LiveChatNavProps = {
  activeView: ChatView;
  onChangeView: (view: ChatView) => void;
};

export const LiveChatNav: React.FC<LiveChatNavProps> = ({
  activeView,
  onChangeView,
}) => {
  return (
    <div style={styles.bottomNav}>
      <button
        type="button"
        style={styles.navButton}
        onClick={() => onChangeView("home")}
      >
        <Home
          size={22}
          color={activeView === "home" ? colors.accent.pink : colors.text.muted}
        />

        <span
          style={{
            ...styles.navLabel,
            color:
              activeView === "home" ? colors.accent.pink : colors.text.muted,
          }}
        >
          Home
        </span>
      </button>

      <button
        type="button"
        style={styles.navButton}
        onClick={() => onChangeView("messages")}
      >
        <MessageSquare
          size={22}
          color={
            activeView === "messages" ? colors.accent.pink : colors.text.muted
          }
        />

        <span
          style={{
            ...styles.navLabel,
            color:
              activeView === "messages"
                ? colors.accent.pink
                : colors.text.muted,
          }}
        >
          Messages
        </span>
      </button>
    </div>
  );
};

const styles = {
  bottomNav: {
    height: "78px",
    borderTop: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  navButton: {
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
  },

  navLabel: {
    fontSize: "13px",
  },
};
