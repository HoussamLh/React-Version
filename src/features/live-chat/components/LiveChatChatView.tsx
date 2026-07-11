import React, { useEffect, useRef } from "react";

import { 
  colors, 
  spacing, 
} from "../../../design-system";

import { 
  liveChatAgent, 
  liveChatProfileCapture 
} from "../data/liveChat.data";

import { LiveChatChatHeader } from "./LiveChatChatHeader";

import type {
  LiveChatAvailabilityMode,
  LiveChatExtraChoice,
  LiveChatMessage,
  LiveChatProfileStep,
} from "../types/liveChat.types";

import { hasLiveChatMessageContaining } from "../utils";

import { LiveChatMessageBubble } from "./LiveChatMessageBubble";
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
      <LiveChatChatHeader
        chatMode={chatMode}
        isOptionsOpen={isOptionsOpen}
        isExpanded={isExpanded}
        onBack={onBack}
        onClose={onClose}
        onToggleOptions={onToggleOptions}
        onToggleExpanded={onToggleExpanded}
        onDownloadTranscript={onDownloadTranscript}
      />

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
