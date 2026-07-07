import React from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  SendHorizontal,
  Smile,
  X,
} from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { liveChatAgent } from "../data/liveChat.data";
import type { LiveChatMessage } from "../types/liveChat.types";
import { LiveChatAgentAvatar } from "./LiveChatAgentAvatar";
import { LiveChatMessageBubble } from "./LiveChatMessageBubble";
import { LiveChatOptionsMenu } from "./LiveChatOptionsMenu";

type LiveChatChatViewProps = {
  email: string;
  message: string;
  messages: LiveChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  isOptionsOpen: boolean;
  isExpanded: boolean;
  isAdminTyping: boolean;
  isAdminOnline: boolean;
  onBack: () => void;
  onClose: () => void;
  onToggleOptions: () => void;
  onToggleExpanded: () => void;
  onDownloadTranscript: () => void;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onTypingChange: (isTyping: boolean) => void;
};

export const LiveChatChatView: React.FC<LiveChatChatViewProps> = ({
  email,
  message,
  messages,
  isLoading,
  isSending,
  error,
  isOptionsOpen,
  isExpanded,
  isAdminTyping,
  isAdminOnline,
  onBack,
  onClose,
  onToggleOptions,
  onToggleExpanded,
  onDownloadTranscript,
  onEmailChange,
  onMessageChange,
  onSubmit,
  onTypingChange,
}) => {
  return (
    <>
      <div style={styles.chatHeader}>
        <button
          type="button"
          aria-label="Back to messages"
          style={styles.darkIconButton}
          onClick={onBack}
        >
          <ChevronLeft size={20} />
        </button>

        <div style={styles.agentBlock}>
          <LiveChatAgentAvatar />

          <div>
            <h3 style={styles.agentName}>{liveChatAgent.name}</h3>
            <p style={styles.agentStatus}>
              {isAdminOnline ? "Online" : liveChatAgent.status}
            </p>
          </div>
        </div>

        <div style={styles.chatHeaderActions}>
          <div style={styles.menuWrapper}>
            <button
              type="button"
              aria-label="Open chat options"
              style={styles.darkIconButton}
              onClick={onToggleOptions}
            >
              <MoreHorizontal size={20} />
            </button>

            {isOptionsOpen && (
              <LiveChatOptionsMenu
                isExpanded={isExpanded}
                onToggleExpanded={onToggleExpanded}
                onDownloadTranscript={onDownloadTranscript}
              />
            )}
          </div>

          <button
            type="button"
            aria-label="Close live chat"
            style={styles.darkIconButton}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={styles.feedbackText}>{liveChatAgent.feedbackText}</div>

      <div style={styles.chatBody}>
        <div style={styles.agentMessage}>{liveChatAgent.greeting}</div>

        <div style={styles.messageMeta}>
          {liveChatAgent.name} · {liveChatAgent.previewTime}
        </div>

        {isLoading && <p style={styles.stateText}>Connecting live chat...</p>}

        {messages.length > 0 && (
          <div style={styles.messageList}>
            {messages.map((chatMessage) => (
              <LiveChatMessageBubble
                key={chatMessage.id}
                message={chatMessage}
              />
            ))}
          </div>
        )}

        {isAdminTyping && (
          <div style={styles.typingIndicator}>
            <span style={styles.typingDot} />
            <span style={styles.typingDot} />
            <span style={styles.typingDot} />
          </div>
        )}

        {error && <p style={styles.errorText}>{error}</p>}
      </div>

      <form style={styles.composer} onSubmit={onSubmit}>
        <input
          style={styles.emailInput}
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="email@example.com"
          type="email"
        />

        <div style={styles.composerDivider} />

        <div style={styles.messageInputRow}>
          <input
            style={styles.messageInput}
            value={message}
            onChange={(event) => {
              onMessageChange(event.target.value);
              onTypingChange(Boolean(event.target.value.trim()));
            }}
            placeholder="Message..."
            disabled={isSending}
          />

          <Smile size={18} color={colors.text.muted} />

          <button
            type="submit"
            style={{
              ...styles.roundSendButton,
              opacity: isSending ? 0.55 : 1,
            }}
            disabled={isSending}
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </form>
    </>
  );
};

const styles = {
  chatHeader: {
    height: "58px",
    borderBottom: `1px solid ${colors.border.default}`,
    display: "grid",
    gridTemplateColumns: "36px 1fr auto",
    alignItems: "center",
    gap: spacing.sm,
    padding: `0 ${spacing.md}`,
    backgroundColor: colors.background.card,
  },

  darkIconButton: {
    width: "34px",
    height: "34px",
    borderRadius: radius.md,
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.muted,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  agentBlock: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 0,
  },

  agentName: {
    color: colors.text.main,
    fontSize: "15px",
    lineHeight: "18px",
    margin: 0,
    fontWeight: typography.fontWeight.bold,
  },

  agentStatus: {
    color: colors.text.muted,
    fontSize: "12px",
    lineHeight: "16px",
    margin: 0,
  },

  chatHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },

  menuWrapper: {
    position: "relative" as const,
  },

  feedbackText: {
    textAlign: "center" as const,
    color: colors.text.muted,
    fontSize: "13px",
    padding: `${spacing.md} ${spacing.lg}`,
    borderBottom: `1px solid rgba(255, 255, 255, 0.03)`,
  },

  chatBody: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background.dark,
    overflowY: "auto" as const,
  },

  agentMessage: {
    width: "fit-content",
    maxWidth: "85%",
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: "18px 18px 18px 6px",
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.main,
    fontSize: "14px",
    lineHeight: "20px",
  },

  messageMeta: {
    color: colors.text.muted,
    fontSize: "12px",
    marginTop: "6px",
  },

  messageList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
    marginTop: spacing.lg,
  },

  stateText: {
    color: colors.text.muted,
    fontSize: "13px",
    margin: `${spacing.lg} 0 0 0`,
  },

  errorText: {
    color: colors.accent.yellow,
    fontSize: "13px",
    lineHeight: "18px",
    margin: `${spacing.lg} 0 0 0`,
  },

  composer: {
    margin: spacing.lg,
    border: `2px solid ${colors.accent.pink}`,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    overflow: "hidden",
  },

  emailInput: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.main,
    padding: `${spacing.md} ${spacing.lg}`,
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  },

  composerDivider: {
    height: "1px",
    backgroundColor: colors.border.default,
    margin: `0 ${spacing.lg}`,
  },

  messageInputRow: {
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
  },

  messageInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.main,
    padding: spacing.sm,
    outline: "none",
    fontSize: "14px",
  },

  roundSendButton: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "rgba(147, 220, 92, 0.16)",
    color: colors.accent.green,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  typingIndicator: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: spacing.lg,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: "18px 18px 18px 6px",
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
  },

  typingDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    backgroundColor: colors.text.muted,
    display: "block",
  },
};
