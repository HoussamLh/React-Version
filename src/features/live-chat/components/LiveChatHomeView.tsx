import React from "react";
import { SendHorizontal, X } from "lucide-react";
import {
  TeamAvatars,
  colors,
  radius,
  spacing,
  typography,
} from "../../../design-system";
import { teamAvatars } from "../data/teamAvatars.data";
import { liveChatBrand } from "../data/liveChat.data";
import type { ChatView } from "../types/liveChat.types";
import { LiveChatNav } from "./LiveChatNav";

type LiveChatHomeViewProps = {
  activeView: ChatView;
  onClose: () => void;
  onStartChat: () => void;
  onChangeView: (view: ChatView) => void;
};

export const LiveChatHomeView: React.FC<LiveChatHomeViewProps> = ({
  activeView,
  onClose,
  onStartChat,
  onChangeView,
}) => {
  return (
    <>
      <div style={styles.homeHero}>
        <div style={styles.homeTopRow}>
          <div style={styles.logoText}>{liveChatBrand}</div>

          <TeamAvatars
            avatars={teamAvatars}
            size={64}
            borderColor="#06171d"
            overlap={16}
          />

          <button
            type="button"
            aria-label="Close live chat"
            style={styles.iconButton}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div style={styles.heroCopy}>
          <h3 style={styles.heroTitle}>
            Hi there 👋
            <br />
            How can we help?
          </h3>
        </div>

        <button
          type="button"
          style={styles.sendMessageCard}
          onClick={onStartChat}
        >
          <span>Send a message</span>
          <SendHorizontal size={18} />
        </button>
      </div>

      <div style={styles.emptyBody} />

      <LiveChatNav activeView={activeView} onChangeView={onChangeView} />
    </>
  );
};

const styles = {
  homeHero: {
    backgroundColor: "#06171d",
    padding: spacing["2xl"],
    borderBottom: `1px solid ${colors.border.default}`,
  },

  homeTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing["3xl"],
  },

  logoText: {
    color: colors.accent.green,
    fontWeight: typography.fontWeight.black,
    fontSize: "15px",
    letterSpacing: "-0.02em",
  },

  iconButton: {
    width: "34px",
    height: "34px",
    borderRadius: radius.md,
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  heroCopy: {
    marginBottom: spacing.xl,
  },

  heroTitle: {
    color: colors.text.main,
    fontSize: "28px",
    lineHeight: "38px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
    letterSpacing: "-0.03em",
  },

  sendMessageCard: {
    width: "100%",
    minHeight: "54px",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: colors.text.main,
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${spacing.lg}`,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
  },

  emptyBody: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
};
