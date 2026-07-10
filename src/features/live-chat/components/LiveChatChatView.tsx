import React, { useEffect, useRef } from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  SendHorizontal,
  Smile,
  X,
} from "lucide-react";

import { 
  colors, 
  radius, 
  spacing, 
  typography 
} from "../../../design-system";

import { 
  liveChatAgent, 
  liveChatProfileCapture 
} from "../data/liveChat.data";

import type {
  LiveChatAvailabilityMode,
  LiveChatExtraChoice,
  LiveChatMessage,
  LiveChatProfileStep,
} from "../types/liveChat.types";

import { hasLiveChatMessageContaining } from "../utils";

import { LiveChatAgentAvatar } from "./LiveChatAgentAvatar";
import { LiveChatMessageBubble } from "./LiveChatMessageBubble";
import { LiveChatOptionsMenu } from "./LiveChatOptionsMenu";

type LiveChatChatViewProps = {
  message: string;
  messagePlaceholder: string;
  profileStep: LiveChatProfileStep;
  chatMode: LiveChatAvailabilityMode;
  messages: LiveChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  isComposerDisabled: boolean;
  error: string | null;
  isOptionsOpen: boolean;
  isExpanded: boolean;
  isAssistantTyping: boolean;
  onBack: () => void;
  onClose: () => void;
  onToggleOptions: () => void;
  onToggleExpanded: () => void;
  onDownloadTranscript: () => void;
  onMessageChange: (value: string) => void;
  onMessageBlur: () => void;
  onServiceSelect: (service: string) => void | Promise<void>;
  onExtraChoiceSelect: (choice: LiveChatExtraChoice) => void | Promise<void>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export const LiveChatChatView: React.FC<LiveChatChatViewProps> = ({
  message,
  messagePlaceholder,
  profileStep,
  chatMode,
  messages,
  isLoading,
  isSending,
  isComposerDisabled,
  error,
  isOptionsOpen,
  isExpanded,
  isAssistantTyping,
  onBack,
  onClose,
  onToggleOptions,
  onToggleExpanded,
  onDownloadTranscript,
  onMessageChange,
  onMessageBlur,
  onServiceSelect,
  onExtraChoiceSelect,
  onSubmit,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const hasServicePrompt =
    hasLiveChatMessageContaining(messages, "How may I help you today") ||
    hasLiveChatMessageContaining(messages, "What service are you contacting");

  const hasExtraChoicePrompt = hasLiveChatMessageContaining(
    messages,
    "anything else",
  );

  const shouldShowServiceOptions =
    profileStep === "service" && !isAssistantTyping && hasServicePrompt;

  const shouldShowExtraChoiceOptions =
    profileStep === "extra_choice" &&
    !isAssistantTyping &&
    hasExtraChoicePrompt;

  const statusText =
    chatMode === "online" ? "Online now" : "Offline — leave a message";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [
    messages.length,
    isAssistantTyping,
    shouldShowServiceOptions,
    shouldShowExtraChoiceOptions,
  ]);

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
            <p
              style={{
                ...styles.agentStatus,
                color:
                  chatMode === "online"
                    ? colors.accent.green
                    : colors.text.muted,
              }}
            >
              {statusText}
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

        {isAssistantTyping && (
          <div style={styles.typingIndicator}>
            <span className="typing-dot-delay-1" style={styles.typingDot} />
            <span className="typing-dot-delay-2" style={styles.typingDot} />
            <span style={styles.typingDot} />
          </div>
        )}

        {shouldShowServiceOptions && (
          <div style={styles.optionGroup}>
            {liveChatProfileCapture.serviceOptions.map((service) => (
              <button
                key={service}
                type="button"
                style={styles.optionButton}
                onClick={() => onServiceSelect(service)}
                disabled={isSending}
              >
                {service}
              </button>
            ))}
          </div>
        )}

        {shouldShowExtraChoiceOptions && (
          <div style={styles.optionGroup}>
            <button
              type="button"
              style={styles.optionButton}
              onClick={() => onExtraChoiceSelect("yes")}
              disabled={isSending}
            >
              Yes, add more details
            </button>

            <button
              type="button"
              style={styles.optionButton}
              onClick={() => onExtraChoiceSelect("no")}
              disabled={isSending}
            >
              No, that’s everything
            </button>
          </div>
        )}

        {error && <p style={styles.errorText}>{error}</p>}

        <div ref={bottomRef} />
      </div>

      <form style={styles.composer} onSubmit={onSubmit}>
        <div style={styles.messageInputRow}>
          <input
            id="visitor-chat-message"
            name="visitor-chat-message"
            aria-label="Message"
            autoComplete="off"
            style={styles.messageInput}
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            onBlur={onMessageBlur}
            placeholder={messagePlaceholder}
            disabled={isComposerDisabled}
          />

          <Smile size={18} color={colors.text.muted} />

          <button
            type="submit"
            style={{
              ...styles.roundSendButton,
              opacity: isSending || isComposerDisabled ? 0.55 : 1,
            }}
            disabled={isComposerDisabled}
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

  messageList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
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

  optionGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
    marginTop: spacing.lg,
    alignItems: "flex-start",
  },

  optionButton: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    color: colors.text.main,
    padding: `10px ${spacing.md}`,
    fontSize: "13px",
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    textAlign: "left" as const,
  },

  composer: {
    margin: spacing.lg,
    border: `2px solid ${colors.accent.pink}`,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    overflow: "hidden",
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
    animation: "liveChatTypingDot 1.4s infinite ease-in-out both",
  },
};
