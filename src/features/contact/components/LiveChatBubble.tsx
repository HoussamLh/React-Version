import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  Download,
  Home,
  Maximize2,
  MessageSquare,
  MessageSquareCode,
  MoreHorizontal,
  SendHorizontal,
  Smile,
  X,
} from "lucide-react";
import { colors, radius, spacing, typography } from "../../../design-system";

type ChatView = "home" | "messages" | "chat";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message.trim()) return;

    setMessage("");
  };

  const handleDownloadTranscript = () => {
    const transcript = `
DevBySam Chat Transcript

Sam:
Hello, how can I help you?

Visitor:
${message || "No message sent yet."}
`;

    const blob = new Blob([transcript], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "devbysam-chat-transcript.txt";
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
            <>
              <div style={styles.homeHero}>
                <div style={styles.homeTopRow}>
                  <div style={styles.logoText}>DevBySam</div>

                  <div style={styles.avatarGroup}>
                    <span
                      style={{
                        ...styles.avatar,
                        backgroundColor: colors.accent.pink,
                      }}
                    >
                      S
                    </span>

                    <span
                      style={{
                        ...styles.avatar,
                        backgroundColor: colors.accent.green,
                      }}
                    >
                      D
                    </span>

                    <span
                      style={{
                        ...styles.avatar,
                        backgroundColor: colors.accent.blue,
                      }}
                    >
                      A
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="Close live chat"
                    style={styles.iconButton}
                    onClick={closeChat}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={styles.heroCopy}>
                  <h3 style={styles.heroTitle}>
                    Hi there 👋
                    <br />
                    How can we help?
                  </h3>
                </div>

                <button
                  type="button"
                  style={styles.sendMessageCard}
                  onClick={() => {
                    setView("chat");
                    setIsOptionsOpen(false);
                  }}
                >
                  <span>Send a message</span>
                  <SendHorizontal size={18} />
                </button>
              </div>

              <div style={styles.emptyBody} />

              <LiveChatNav activeView={view} onChangeView={setView} />
            </>
          )}

          {view === "messages" && (
            <>
              <div style={styles.lightHeader}>
                <h3 style={styles.messagesTitle}>Messages</h3>

                <button
                  type="button"
                  aria-label="Close live chat"
                  style={styles.darkIconButton}
                  onClick={closeChat}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={styles.messagesBody}>
                <button
                  type="button"
                  style={styles.messagePreview}
                  onClick={() => {
                    setView("chat");
                    setIsOptionsOpen(false);
                  }}
                >
                  <span
                    style={{
                      ...styles.previewAvatar,
                      backgroundColor: colors.accent.pink,
                    }}
                  >
                    S
                  </span>

                  <div style={styles.previewContent}>
                    <div style={styles.previewTopRow}>
                      <span style={styles.previewName}>Sam</span>
                      <span style={styles.previewTime}>1m</span>
                    </div>

                    <p style={styles.previewText}>Hello, how can I help you?</p>
                  </div>
                </button>

                <button
                  type="button"
                  style={styles.primaryMessageButton}
                  onClick={() => {
                    setView("chat");
                    setIsOptionsOpen(false);
                  }}
                >
                  <span>Send us a message</span>
                  <SendHorizontal size={18} />
                </button>
              </div>

              <LiveChatNav activeView={view} onChangeView={setView} />
            </>
          )}

          {view === "chat" && (
            <>
              <div style={styles.chatHeader}>
                <button
                  type="button"
                  aria-label="Back to messages"
                  style={styles.darkIconButton}
                  onClick={() => {
                    setView("messages");
                    setIsOptionsOpen(false);
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <div style={styles.agentBlock}>
                  <span
                    style={{
                      ...styles.previewAvatar,
                      backgroundColor: colors.accent.pink,
                    }}
                  >
                    S
                  </span>

                  <div>
                    <h3 style={styles.agentName}>Sam</h3>
                    <p style={styles.agentStatus}>Active 45m ago</p>
                  </div>
                </div>

                <div style={styles.chatHeaderActions}>
                  <div style={styles.menuWrapper}>
                    <button
                      type="button"
                      aria-label="Open chat options"
                      style={styles.darkIconButton}
                      onClick={() => setIsOptionsOpen((current) => !current)}
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {isOptionsOpen && (
                      <div style={styles.optionsMenu}>
                        <button
                          type="button"
                          style={styles.optionButton}
                          onClick={() => {
                            setIsExpanded((current) => !current);
                            setIsOptionsOpen(false);
                          }}
                        >
                          <Maximize2 size={16} style={styles.optionIcon} />
                          <span>
                            {isExpanded ? "Collapse window" : "Expand window"}
                          </span>
                        </button>

                        <button
                          type="button"
                          style={styles.optionButton}
                          onClick={handleDownloadTranscript}
                        >
                          <Download size={16} style={styles.optionIcon} />
                          <span>Download transcript</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="Close live chat"
                    style={styles.darkIconButton}
                    onClick={closeChat}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div style={styles.feedbackText}>
                Ask us anything, or share your feedback.
              </div>

              <div style={styles.chatBody}>
                <div style={styles.agentMessage}>
                  Hello, how can I help you?
                </div>

                <div style={styles.messageMeta}>Sam · 1m</div>
              </div>

              <form style={styles.composer} onSubmit={handleSubmit}>
                <input
                  style={styles.emailInput}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@example.com"
                  type="email"
                />

                <div style={styles.composerDivider} />

                <div style={styles.messageInputRow}>
                  <input
                    style={styles.messageInput}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Message..."
                  />

                  <Smile size={18} color={colors.text.muted} />

                  <button type="submit" style={styles.roundSendButton}>
                    <SendHorizontal size={18} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        aria-label="Open live chat"
        className={!isOpen ? "ds-float-subtle" : undefined}
        style={styles.bubble}
        onClick={() => {
          setIsOpen((current) => !current);
          setView("home");
          setIsOptionsOpen(false);
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquareCode size={24} />}
      </button>
    </div>,
    document.body,
  );
};

type LiveChatNavProps = {
  activeView: ChatView;
  onChangeView: (view: ChatView) => void;
};

const LiveChatNav: React.FC<LiveChatNavProps> = ({
  activeView,
  onChangeView,
}) => {
  return (
    <div style={styles.bottomNav}>
      <button
        type="button"
        style={styles.navButton}
        onClick={() => onChangeView("home")}
      >
        <Home
          size={22}
          color={activeView === "home" ? colors.accent.pink : colors.text.muted}
        />

        <span
          style={{
            ...styles.navLabel,
            color:
              activeView === "home" ? colors.accent.pink : colors.text.muted,
          }}
        >
          Home
        </span>
      </button>

      <button
        type="button"
        style={styles.navButton}
        onClick={() => onChangeView("messages")}
      >
        <MessageSquare
          size={22}
          color={
            activeView === "messages" ? colors.accent.pink : colors.text.muted
          }
        />

        <span
          style={{
            ...styles.navLabel,
            color:
              activeView === "messages"
                ? colors.accent.pink
                : colors.text.muted,
          }}
        >
          Messages
        </span>
      </button>
    </div>
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

  bubble: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: colors.accent.green,
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(147, 220, 92, 0.28)",
    pointerEvents: "auto" as const,
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

  homeHero: {
    backgroundColor: "#06171d",
    padding: spacing["2xl"],
    borderBottom: `1px solid ${colors.border.default}`,
  },

  homeTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing["3xl"],
  },

  logoText: {
    color: colors.accent.green,
    fontWeight: typography.fontWeight.black,
    fontSize: "15px",
    letterSpacing: "-0.02em",
  },

  avatarGroup: {
    display: "flex",
    alignItems: "center",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: `2px solid #06171d`,
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: typography.fontWeight.black,
    marginLeft: "-8px",
  },

  iconButton: {
    width: "34px",
    height: "34px",
    borderRadius: radius.md,
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
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

  heroCopy: {
    marginBottom: spacing.xl,
  },

  heroTitle: {
    color: colors.text.main,
    fontSize: "28px",
    lineHeight: "38px",
    margin: 0,
    fontWeight: typography.fontWeight.black,
    letterSpacing: "-0.03em",
  },

  sendMessageCard: {
    width: "100%",
    minHeight: "54px",
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    backgroundColor: colors.text.main,
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${spacing.lg}`,
    fontWeight: typography.fontWeight.bold,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
  },

  emptyBody: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },

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

  messagesBody: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background.dark,
    display: "flex",
    flexDirection: "column" as const,
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

  previewAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    color: colors.background.dark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: typography.fontWeight.black,
    flexShrink: 0,
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

  previewName: {
    color: colors.text.main,
    fontSize: "14px",
    fontWeight: typography.fontWeight.bold,
  },

  previewTime: {
    color: colors.text.muted,
    fontSize: "12px",
  },

  previewText: {
    color: colors.text.muted,
    fontSize: "14px",
    margin: "4px 0 0 0",
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

  bottomNav: {
    height: "78px",
    borderTop: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.card,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  },

  navButton: {
    border: "none",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: "pointer",
  },

  navLabel: {
    fontSize: "13px",
  },

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

  optionsMenu: {
    position: "absolute" as const,
    top: "40px",
    right: 0,
    width: "210px",
    padding: "8px",
    borderRadius: radius.md,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.35)",
    zIndex: 20,
  },

  optionButton: {
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    color: colors.text.main,
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    padding: "10px 12px",
    borderRadius: radius.sm,
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left" as const,
  },

  optionIcon: {
    color: colors.accent.pink,
    flexShrink: 0,
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
};
