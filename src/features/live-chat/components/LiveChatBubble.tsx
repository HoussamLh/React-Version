import React, { useState } from "react";
import { createPortal } from "react-dom";
import { colors, radius } from "../../../design-system";
import { useLiveChat } from "../hooks/useLiveChat";
import { liveChatTranscript } from "../data/liveChat.data";

import {
  buildLiveChatTranscript,
  getLiveChatMessagePlaceholder,
  isLiveChatComposerDisabledForStep,
} from "../utils";

import type {
  ChatView,
  LiveChatExtraChoice,
} from "../types/liveChat.types";

import { LiveChatChatView } from "./LiveChatChatView";
import { LiveChatFloatingButton } from "./LiveChatFloatingButton";
import { LiveChatHomeView } from "./LiveChatHomeView";
import { LiveChatMessagesView } from "./LiveChatMessagesView";


export const LiveChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ChatView>("home");
  const [message, setMessage] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    profileStep,
    chatMode,
    messages,
    latestMessage,
    isLoading,
    isSending,
    error,
    isAdminTyping,
    isAgentTyping,
    sendMessage,
    sendTypingStatus,
    selectServiceOption,
    selectExtraChoice,
  } = useLiveChat(isOpen, isOpen && view === "chat");

  const messagePlaceholder = getLiveChatMessagePlaceholder(profileStep);
  const isProfileCaptureActive = profileStep !== "ready";

  const isComposerDisabled =
    isSending ||
    isAgentTyping ||
    isLiveChatComposerDisabledForStep(profileStep);

  const closeChat = () => {
    setIsOpen(false);
    setView("home");
    setIsOptionsOpen(false);
  };

  const openChatView = () => {
    setView("chat");
    setIsOptionsOpen(false);
  };

  const openMessagesView = () => {
    setView("messages");
    setIsOptionsOpen(false);
  };

  const changeView = (nextView: ChatView) => {
    setView(nextView);
    setIsOptionsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen((current) => !current);
    setView("home");
    setIsOptionsOpen(false);
  };

  const toggleExpanded = () => {
    setIsExpanded((current) => !current);
    setIsOptionsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sent = await sendMessage(message);

    if (sent) {
      setMessage("");
      sendTypingStatus(false);
    }
  };

  const handleMessageChange = (nextMessage: string) => {
    setMessage(nextMessage);

    if (!isProfileCaptureActive) {
      sendTypingStatus(Boolean(nextMessage.trim()));
    }
  };

  const handleMessageBlur = () => {
    if (!isProfileCaptureActive) {
      sendTypingStatus(false);
    }
  };

  const handleServiceSelect = async (service: string) => {
    await selectServiceOption(service);
  };

  const handleExtraChoiceSelect = async (choice: LiveChatExtraChoice) => {
    await selectExtraChoice(choice);
  };

  const handleDownloadTranscript = () => {
    const transcript = buildLiveChatTranscript(messages);

    const blob = new Blob([transcript], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = liveChatTranscript.fileName;
    link.click();

    URL.revokeObjectURL(url);
    setIsOptionsOpen(false);
  };

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="devbysam-live-chat-root" style={styles.wrapper}>
      {isOpen && (
        <div
          className={
            isExpanded
              ? "devbysam-live-chat-popup devbysam-live-chat-popup-expanded"
              : "devbysam-live-chat-popup"
          }
          style={{
            ...styles.popup,
            ...(isExpanded ? styles.popupExpanded : {}),
          }}
        >
          {view === "home" && (
            <LiveChatHomeView
              activeView={view}
              onClose={closeChat}
              onStartChat={openChatView}
              onChangeView={changeView}
            />
          )}

          {view === "messages" && (
            <LiveChatMessagesView
              activeView={view}
              latestMessage={latestMessage}
              isLoading={isLoading}
              error={error}
              isAdminOnline={isAdminTyping || isAgentTyping}
              isAdminTyping={isAdminTyping}
              onClose={closeChat}
              onOpenChat={openChatView}
              onChangeView={changeView}
            />
          )}

          {view === "chat" && (
            <LiveChatChatView
              message={message}
              messagePlaceholder={messagePlaceholder}
              profileStep={profileStep}
              chatMode={chatMode}
              messages={messages}
              isLoading={isLoading}
              isSending={isSending}
              isComposerDisabled={isComposerDisabled}
              error={error}
              isAssistantTyping={
                isAgentTyping || (!isProfileCaptureActive && isAdminTyping)
              }
              isOptionsOpen={isOptionsOpen}
              isExpanded={isExpanded}
              onBack={openMessagesView}
              onClose={closeChat}
              onToggleOptions={() => setIsOptionsOpen((current) => !current)}
              onToggleExpanded={toggleExpanded}
              onDownloadTranscript={handleDownloadTranscript}
              onMessageChange={handleMessageChange}
              onMessageBlur={handleMessageBlur}
              onServiceSelect={handleServiceSelect}
              onExtraChoiceSelect={handleExtraChoiceSelect}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      )}

      <LiveChatFloatingButton isOpen={isOpen} onClick={toggleChat} />
    </div>,
    document.body,
  );
};

const styles = {
  wrapper: {
    position: "fixed" as const,
    right: "32px",
    bottom: "32px",
    zIndex: 2147483647,
    pointerEvents: "none" as const,
  },

  popup: {
    position: "absolute" as const,
    right: 0,
    bottom: "76px",
    width: "400px",
    height: "704px",
    maxWidth: "calc(100vw - 32px)",
    maxHeight: "calc(100vh - 120px)",
    borderRadius: radius["2xl"],
    backgroundColor: colors.background.dark,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 24px 70px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    pointerEvents: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
  },

  popupExpanded: {
    width: "720px",
    height: "760px",
    maxWidth: "calc(100vw - 64px)",
    maxHeight: "calc(100vh - 80px)",
  },
};
