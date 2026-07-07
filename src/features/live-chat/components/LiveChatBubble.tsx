import React, { useState } from "react";
import { createPortal } from "react-dom";
import { colors, radius } from "../../../design-system";
import { liveChatAgent, liveChatTranscript } from "../data/liveChat.data";
import type { ChatView } from "../types/liveChat.types";
import { LiveChatChatView } from "./LiveChatChatView";
import { LiveChatFloatingButton } from "./LiveChatFloatingButton";
import { LiveChatHomeView } from "./LiveChatHomeView";
import { LiveChatMessagesView } from "./LiveChatMessagesView";

export const LiveChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ChatView>("home");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) return;

    setMessage("");
  };

  const handleDownloadTranscript = () => {
    const transcript = `
${liveChatTranscript.title}

${liveChatAgent.name}:
${liveChatAgent.greeting}

Visitor:
${message || "No message sent yet."}
`;

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
              onClose={closeChat}
              onOpenChat={openChatView}
              onChangeView={changeView}
            />
          )}

          {view === "chat" && (
            <LiveChatChatView
              email={email}
              message={message}
              isOptionsOpen={isOptionsOpen}
              isExpanded={isExpanded}
              onBack={openMessagesView}
              onClose={closeChat}
              onToggleOptions={() => setIsOptionsOpen((current) => !current)}
              onToggleExpanded={toggleExpanded}
              onDownloadTranscript={handleDownloadTranscript}
              onEmailChange={setEmail}
              onMessageChange={setMessage}
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
