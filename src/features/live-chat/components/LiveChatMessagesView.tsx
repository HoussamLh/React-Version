import React from "react";
import { X } from "lucide-react";
import { colors, spacing, typography } from "../../../design-system";
import { liveChatAgent } from "../data/liveChat.data";
import type { ChatView, LiveChatMessage } from "../types/liveChat.types";
import { LiveChatMessagePreviewCard } from "./LiveChatMessagePreviewCard";
import { LiveChatNav } from "./LiveChatNav";
import { formatLiveChatTime } from "../utils";
import { LiveChatIconButton } from "./LiveChatIconButton";
import { LiveChatStateText } from "./LiveChatStateText";
import { LiveChatPrimaryButton } from "./LiveChatPrimaryButton";

type LiveChatMessagesViewProps = {
  activeView: ChatView;
  latestMessage: LiveChatMessage | null;
  isLoading: boolean;
  error: string | null;
  isAdminTyping: boolean;
  isAdminOnline: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  onChangeView: (view: ChatView) => void;
};

export const LiveChatMessagesView: React.FC<LiveChatMessagesViewProps> = ({
  activeView,
  latestMessage,
  isLoading,
  error,
  isAdminOnline,
  isAdminTyping,
  onClose,
  onOpenChat,
  onChangeView,
}) => {
  const previewText = isAdminTyping
    ? `${liveChatAgent.name} is typing...`
    : latestMessage
      ? latestMessage.senderType === "visitor"
        ? `You: ${latestMessage.body}`
        : latestMessage.body
      : liveChatAgent.greeting;

  const previewTime = latestMessage
    ? formatLiveChatTime(latestMessage.createdAt)
    : liveChatAgent.previewTime;

  return (
    <>
      <div style={styles.lightHeader}>
        <h3 style={styles.messagesTitle}>Messages</h3>

        <LiveChatIconButton
          ariaLabel="Close live chat"
          style={styles.closeButton}
          onClick={onClose}
        >
          <X size={18} />
        </LiveChatIconButton>
      </div>

      <div style={styles.messagesBody}>
        {isLoading && (
          <LiveChatStateText>Connecting live chat...</LiveChatStateText>
        )}

        {error && <LiveChatStateText tone="warning">{error}</LiveChatStateText>}

        <LiveChatMessagePreviewCard
          previewText={previewText}
          previewTime={previewTime}
          isAdminOnline={isAdminOnline}
          onClick={onOpenChat}
        />

        <LiveChatPrimaryButton variant="pill" onClick={onOpenChat}>
          Send us a message
        </LiveChatPrimaryButton>
      </div>

      <LiveChatNav activeView={activeView} onChangeView={onChangeView} />
    </>
  );
};

const styles = {
  lightHeader: {
    position: "relative" as const,
    minHeight: "58px",
    borderBottom: `1px solid ${colors.border.default}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${spacing.lg}`,
  },

  messagesTitle: {
    color: colors.text.main,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },

  closeButton: {
    position: "absolute" as const,
    right: spacing.lg,
  },

  messagesBody: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background.dark,
    display: "flex",
    flexDirection: "column" as const,
  },
};
