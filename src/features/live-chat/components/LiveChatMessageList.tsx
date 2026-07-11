import React, { useEffect, useRef } from "react";
import { colors, spacing } from "../../../design-system";
import { liveChatProfileCapture } from "../data/liveChat.data";
import type {
  LiveChatExtraChoice,
  LiveChatMessage,
  LiveChatProfileStep,
} from "../types/liveChat.types";
import { hasLiveChatMessageContaining } from "../utils";
import { LiveChatMessageBubble } from "./LiveChatMessageBubble";
import { LiveChatOptionButton } from "./LiveChatOptionButton";
import { LiveChatStateText } from "./LiveChatStateText";
import { LiveChatTypingIndicator } from "./LiveChatTypingIndicator";

type LiveChatMessageListProps = {
  messages: LiveChatMessage[];
  profileStep: LiveChatProfileStep;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  isAssistantTyping: boolean;
  onServiceSelect: (service: string) => void | Promise<void>;
  onExtraChoiceSelect: (choice: LiveChatExtraChoice) => void | Promise<void>;
};

export const LiveChatMessageList: React.FC<LiveChatMessageListProps> = ({
  messages,
  profileStep,
  isLoading,
  isSending,
  error,
  isAssistantTyping,
  onServiceSelect,
  onExtraChoiceSelect,
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
    <div style={styles.chatBody}>
      {isLoading && (
        <LiveChatStateText marginTop>Connecting live chat...</LiveChatStateText>
      )}

      {messages.length > 0 && (
        <div style={styles.messageList}>
          {messages.map((chatMessage) => (
            <LiveChatMessageBubble key={chatMessage.id} message={chatMessage} />
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
  );
};

const styles = {
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
};
