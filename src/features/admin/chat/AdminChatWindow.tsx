import React, { useEffect, useRef, useState } from "react";
import { colors, radius, spacing, typography } from "../../../design-system";
import { getCurrentAdminProfile } from "../auth/adminAuth.service";
import {
  createAdminRealtimeChannel,
  getAdminConversationMessages,
  sendAdminMessage,
  subscribeToAdminConversationMessages,
  updateConversationStatus,
} from "./adminChat.service";
import type { AdminConversation, AdminMessage } from "./adminChat.types";
import { AdminMessageBubble } from "./AdminMessageBubble";
import { AdminMessageComposer } from "./AdminMessageComposer";
type AdminChatWindowProps = {
  conversation: AdminConversation | null;
  onConversationUpdated: () => void;
};
const appendUniqueMessage = (
  currentMessages: AdminMessage[],
  nextMessage: AdminMessage,
) => {
  const exists = currentMessages.some(
    (message) => message.id === nextMessage.id,
  );
  if (exists) {
    return currentMessages;
  }
  return [...currentMessages, nextMessage];
};
export const AdminChatWindow: React.FC<AdminChatWindowProps> = ({
  conversation,
  onConversationUpdated,
}) => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [isVisitorOnline, setIsVisitorOnline] = useState(false);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const realtimeRef = useRef<{
    sendTypingStatus: (isTyping: boolean) => Promise<void>;
    unsubscribe: () => void;
  } | null>(null);
  const conversationId = conversation?.id ?? null;
  const conversationStatus = conversation?.status ?? null;
  useEffect(() => {
    let isMounted = true;
    void Promise.resolve().then(async () => {
      if (!conversationId) {
        if (isMounted) {
          setMessages([]);
          setReply("");
          setError("");
        }
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const nextMessages = await getAdminConversationMessages(conversationId);
        if (!isMounted) return;
        setMessages(nextMessages);
      } catch {
        if (!isMounted) return;
        setError("Could not load messages.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [conversationId]);
  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = subscribeToAdminConversationMessages({
      conversationId,
      onMessage: (nextMessage) => {
        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, nextMessage),
        );
        onConversationUpdated();
      },
    });
    return unsubscribe;
  }, [conversationId, onConversationUpdated]);
  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;
    void Promise.resolve().then(async () => {
      const adminProfile = await getCurrentAdminProfile();
      if (!isMounted || !adminProfile) return;
      const realtime = createAdminRealtimeChannel({
        conversationId,
        adminId: adminProfile.id,
        onVisitorTypingChange: setIsVisitorTyping,
        onPresenceChange: setIsVisitorOnline,
      });
      realtimeRef.current = realtime;
    });
    return () => {
      isMounted = false;
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      realtimeRef.current?.unsubscribe();
      realtimeRef.current = null;
      setIsVisitorOnline(false);
      setIsVisitorTyping(false);
    };
  }, [conversationId]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isVisitorTyping]);
  const handleTypingChange = (isTyping: boolean) => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    void realtimeRef.current?.sendTypingStatus(isTyping);
    if (!isTyping) return;
    typingTimeoutRef.current = window.setTimeout(() => {
      void realtimeRef.current?.sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1500);
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedReply = reply.trim();
    if (!conversationId || !trimmedReply) return;
    setIsSending(true);
    setError("");
    try {
      await realtimeRef.current?.sendTypingStatus(false);
      const nextMessage = await sendAdminMessage({
        conversationId,
        body: trimmedReply,
      });
      setMessages((currentMessages) =>
        appendUniqueMessage(currentMessages, nextMessage),
      );
      setReply("");
      if (conversationStatus !== "open") {
        await updateConversationStatus({ conversationId, status: "open" });
      }
      onConversationUpdated();
    } catch {
      setError("Could not send reply.");
    } finally {
      setIsSending(false);
    }
  };
  if (!conversation) {
    return (
      <section style={styles.emptyState}>
        {" "}
        <h2 style={styles.emptyTitle}>Select a conversation</h2>{" "}
        <p style={styles.emptyText}>
          {" "}
          Choose a visitor conversation from the inbox to view messages and
          reply.{" "}
        </p>{" "}
      </section>
    );
  }
  const visitorLabel =
    conversation.visitorName ??
    conversation.visitorEmail ??
    `Visitor ${conversation.visitorId.slice(0, 8)}`;
  return (
    <section style={styles.window}>
      {" "}
      <header style={styles.header}>
        {" "}
        <div>
          {" "}
          <h2 style={styles.title}>{visitorLabel}</h2>{" "}
          <p style={styles.status}>
            {" "}
            {isVisitorOnline ? "Visitor online" : "Visitor offline"}{" "}
            {isVisitorTyping ? " · typing..." : ""}{" "}
          </p>{" "}
        </div>{" "}
        <span style={styles.badge}>{conversation.status}</span>{" "}
      </header>{" "}
      <div style={styles.body}>
        {" "}
        {isLoading && <p style={styles.stateText}>Loading messages...</p>}{" "}
        {messages.map((message) => (
          <AdminMessageBubble key={message.id} message={message} />
        ))}{" "}
        {isVisitorTyping && (
          <div style={styles.typingIndicator}>
            {" "}
            <span
              className="typing-dot-delay-1"
              style={styles.typingDot}
            />{" "}
            <span className="typing-dot-delay-2" style={styles.typingDot} />{" "}
            <span style={styles.typingDot} />{" "}
          </div>
        )}{" "}
        {error && <p style={styles.error}>{error}</p>}{" "}
        <div ref={bottomRef} />{" "}
      </div>{" "}
      <AdminMessageComposer
        value={reply}
        isSending={isSending}
        onChange={setReply}
        onTypingChange={handleTypingChange}
        onSubmit={handleSubmit}
      />{" "}
    </section>
  );
};
const styles = {
  window: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    backgroundColor: colors.background.dark,
  },
  header: {
    height: "72px",
    borderBottom: `1px solid ${colors.border.default}`,
    padding: `0 ${spacing.lg}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.text.main,
    fontSize: "18px",
    fontWeight: typography.fontWeight.black,
    margin: 0,
  },
  status: { color: colors.text.muted, fontSize: "13px", margin: "4px 0 0 0" },
  badge: {
    color: colors.accent.green,
    border: `1px solid ${colors.accent.green}`,
    borderRadius: radius.pill,
    padding: "6px 10px",
    fontSize: "11px",
    textTransform: "uppercase" as const,
  },
  body: {
    flex: 1,
    overflowY: "auto" as const,
    padding: spacing.lg,
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing.md,
  },
  stateText: { color: colors.text.muted, fontSize: "14px", margin: 0 },
  error: { color: colors.accent.yellow, fontSize: "13px", margin: 0 },
  typingIndicator: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: "5px",
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
  emptyState: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    textAlign: "center" as const,
  },
  emptyTitle: {
    color: colors.text.main,
    fontSize: "24px",
    margin: `0 0 ${spacing.sm} 0`,
  },
  emptyText: {
    color: colors.text.muted,
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
    maxWidth: "360px",
  },
};
