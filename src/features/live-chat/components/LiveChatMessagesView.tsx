import React from "react";
import { SendHorizontal, X } from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { liveChatAgent } from "../data/liveChat.data";
import type { ChatView, LiveChatMessage } from "../types/liveChat.types";
import { LiveChatAgentAvatar } from "./LiveChatAgentAvatar";
import { LiveChatNav } from "./LiveChatNav";
import { formatLiveChatTime } from "../utils";
import { LiveChatIconButton } from "./LiveChatIconButton";

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
        {isLoading && <p style={styles.stateText}>Connecting live chat...</p>}

        {error && <p style={styles.errorText}>{error}</p>}

        <button
          type="button"
          style={styles.messagePreview}
          onClick={onOpenChat}
        >
          <LiveChatAgentAvatar />

          <div style={styles.previewContent}>
            <div style={styles.previewTopRow}>
              <div style={styles.agentInfo}>
                <span style={styles.previewName}>{liveChatAgent.name}</span>

                <span
                  style={{
                    ...styles.onlineStatus,
                    color: isAdminOnline
                      ? colors.accent.green
                      : colors.text.muted,
                  }}
                >
                  {isAdminOnline ? "Online" : "Offline"}
                </span>
              </div>

              <span style={styles.previewTime}>{previewTime}</span>
            </div>

            <p style={styles.previewText}>{previewText}</p>
          </div>
        </button>

        <button
          type="button"
          style={styles.primaryMessageButton}
          onClick={onOpenChat}
        >
          <span>Send us a message</span>
          <SendHorizontal size={18} />
        </button>
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

  stateText: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  errorText: {
    color: colors.accent.yellow,
    fontSize: "13px",
    lineHeight: "18px",
    margin: `0 0 ${spacing.sm} 0`,
  },

  messagePreview: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    padding: `${spacing.md} 0`,
    borderBottom: `1px solid ${colors.border.default}`,
    cursor: "pointer",
    textAlign: "left" as const,
  },

  previewContent: {
    flex: 1,
    minWidth: 0,
  },

  previewTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  agentInfo: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 0,
  },

  previewName: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
  },

  onlineStatus: {
    fontSize: "11px",
  },

  previewTime: {
    color: colors.text.muted,
    fontSize: "12px",
  },

  previewText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: "4px 0 0 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },

  primaryMessageButton: {
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: spacing.xl,
    border: "none",
    borderRadius: radius.md,
    backgroundColor: colors.accent.pink,
    color: colors.text.main,
    padding: "13px 22px",
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
  },
};
