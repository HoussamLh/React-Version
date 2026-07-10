import React, { useEffect, useRef } from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  X,
} from "lucide-react";

import { 
  colors, 
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
import { LiveChatIconButton } from "./LiveChatIconButton";
import { LiveChatStateText } from "./LiveChatStateText";
import { LiveChatTypingIndicator } from "./LiveChatTypingIndicator";
import { LiveChatOptionButton } from "./LiveChatOptionButton";
import { LiveChatComposer } from "./LiveChatComposer";

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
        <LiveChatIconButton ariaLabel="Back to messages" onClick={onBack}>
          <ChevronLeft size={20} />
        </LiveChatIconButton>

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
            <LiveChatIconButton
              ariaLabel="Open chat options"
              onClick={onToggleOptions}
            >
              <MoreHorizontal size={20} />
            </LiveChatIconButton>

            {isOptionsOpen && (
              <LiveChatOptionsMenu
                isExpanded={isExpanded}
                onToggleExpanded={onToggleExpanded}
                onDownloadTranscript={onDownloadTranscript}
              />
            )}
          </div>

          <LiveChatIconButton ariaLabel="Close live chat" onClick={onClose}>
            <X size={18} />
          </LiveChatIconButton>
        </div>
      </div>

      <div style={styles.feedbackText}>{liveChatAgent.feedbackText}</div>

      <div style={styles.chatBody}>
        {isLoading && (
          <LiveChatStateText marginTop>
            Connecting live chat...
          </LiveChatStateText>
        )}

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

        {isAssistantTyping && <LiveChatTypingIndicator />}

        {shouldShowServiceOptions && (
          <div style={styles.optionGroup}>
            {liveChatProfileCapture.serviceOptions.map((service) => (
              <LiveChatOptionButton
                key={service}
                disabled={isSending}
                onClick={() => onServiceSelect(service)}
              >
                {service}
              </LiveChatOptionButton>
            ))}
          </div>
        )}

        {shouldShowExtraChoiceOptions && (
          <div style={styles.optionGroup}>
            <LiveChatOptionButton
              disabled={isSending}
              onClick={() => onExtraChoiceSelect("yes")}
            >
              Yes, add more details
            </LiveChatOptionButton>

            <LiveChatOptionButton
              disabled={isSending}
              onClick={() => onExtraChoiceSelect("no")}
            >
              No, that’s everything
            </LiveChatOptionButton>
          </div>
        )}

        {error && (
          <LiveChatStateText tone="warning" marginTop>
            {error}
          </LiveChatStateText>
        )}

        <div ref={bottomRef} />
      </div>

      <LiveChatComposer
        message={message}
        messagePlaceholder={messagePlaceholder}
        isSending={isSending}
        isComposerDisabled={isComposerDisabled}
        onMessageChange={onMessageChange}
        onMessageBlur={onMessageBlur}
        onSubmit={onSubmit}
      />
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

  optionGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.sm,
    marginTop: spacing.lg,
    alignItems: "flex-start",
  },
}
