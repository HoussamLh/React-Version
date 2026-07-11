import React from "react";

import type {
  LiveChatAvailabilityMode,
  LiveChatExtraChoice,
  LiveChatMessage,
  LiveChatProfileStep,
} from "../types/liveChat.types";

import { LiveChatComposer } from "./LiveChatComposer";
import { LiveChatChatHeader } from "./LiveChatChatHeader";
import { LiveChatFeedbackBanner } from "./LiveChatFeedbackBanner";
import { LiveChatMessageList } from "./LiveChatMessageList";

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

      <LiveChatFeedbackBanner />

      <LiveChatMessageList
        messages={messages}
        profileStep={profileStep}
        isLoading={isLoading}
        isSending={isSending}
        error={error}
        isAssistantTyping={isAssistantTyping}
        onServiceSelect={onServiceSelect}
        onExtraChoiceSelect={onExtraChoiceSelect}
      />

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
