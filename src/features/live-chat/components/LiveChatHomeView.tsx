import React from "react";
import { X } from "lucide-react";
import {
  TeamAvatars,
  colors,
  spacing,
  typography,
} from "../../../design-system";
import { teamAvatars } from "../data/teamAvatars.data";
import { liveChatBrand } from "../data/liveChat.data";
import type { ChatView } from "../types/liveChat.types";
import { LiveChatNav } from "./LiveChatNav";
import { LiveChatIconButton } from "./LiveChatIconButton";
import { LiveChatPrimaryButton } from "./LiveChatPrimaryButton";

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

          <LiveChatIconButton
            ariaLabel="Close live chat"
            variant="main"
            onClick={onClose}
          >
            <X size={18} />
          </LiveChatIconButton>
        </div>

        <div style={styles.heroCopy}>
          <h3 style={styles.heroTitle}>
            Hi there 👋
            <br />
            How can we help?
          </h3>
        </div>

        <LiveChatPrimaryButton variant="card" onClick={onStartChat}>
          Send a message
        </LiveChatPrimaryButton>
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

  emptyBody: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
};
