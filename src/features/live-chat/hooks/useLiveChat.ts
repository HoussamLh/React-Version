import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured } from "../../../lib/supabase";
import {
  createLiveChatRealtimeChannel,
  ensureAnonymousVisitor,
  getConversationMessages,
  getOrCreateOpenConversation,
  sendVisitorMessage,
  subscribeToConversationMessages,
  upsertVisitorProfile,
} from "../services/liveChat.service";
import type {
  LiveChatConversation,
  LiveChatMessage,
  LiveChatPresenceState,
} from "../types/liveChat.types";

const appendUniqueMessage = (
  currentMessages: LiveChatMessage[],
  nextMessage: LiveChatMessage,
) => {
  const exists = currentMessages.some(
    (message) => message.id === nextMessage.id,
  );

  if (exists) {
    return currentMessages;
  }

  return [...currentMessages, nextMessage];
};

export const useLiveChat = (enabled: boolean) => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<LiveChatConversation | null>(
    null,
  );
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [presence, setPresence] = useState<LiveChatPresenceState[]>([]);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typingTimeoutRef = useRef<number | null>(null);
  const realtimeRef = useRef<{
    sendTypingStatus: (isTyping: boolean) => Promise<void>;
    unsubscribe: () => void;
  } | null>(null);

  const conversationId = conversation?.id ?? null;

  useEffect(() => {
    if (!enabled || conversationId) return;

    let isMounted = true;

    const initialiseLiveChat = async () => {
      if (!isSupabaseConfigured) {
        setError("Live chat is not configured yet.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextVisitorId = await ensureAnonymousVisitor();

        await upsertVisitorProfile(nextVisitorId);

        const nextConversation =
          await getOrCreateOpenConversation(nextVisitorId);

        const nextMessages = await getConversationMessages(nextConversation.id);

        if (!isMounted) return;

        setVisitorId(nextVisitorId);
        setConversation(nextConversation);
        setMessages(nextMessages);
      } catch (error) {
        console.error("Live chat init failed:", error);

        if (!isMounted) return;

        setError("Live chat could not connect. Please try again later.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialiseLiveChat();

    return () => {
      isMounted = false;
    };
  }, [enabled, conversationId]);

  useEffect(() => {
    if (!enabled || !conversationId) return;

    const unsubscribe = subscribeToConversationMessages({
      conversationId,
      onMessage: (nextMessage) => {
        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, nextMessage),
        );
      },
    });

    return unsubscribe;
  }, [enabled, conversationId]);

  useEffect(() => {
    if (!enabled || !conversationId || !visitorId) return;

    const realtime = createLiveChatRealtimeChannel({
      conversationId,
      visitorId,
      onTypingChange: (payload) => {
        if (payload.role !== "admin") return;

        setIsAdminTyping(payload.isTyping);
      },
      onPresenceChange: setPresence,
    });

    realtimeRef.current = realtime;

    return () => {
      realtime.unsubscribe();
      realtimeRef.current = null;
      setPresence([]);
      setIsAdminTyping(false);
    };
  }, [enabled, conversationId, visitorId]);

  const sendMessage = useCallback(
    async (body: string): Promise<boolean> => {
      const trimmedBody = body.trim();

      if (!trimmedBody) {
        return false;
      }

      if (!conversationId) {
        setError("Live chat is still connecting. Please try again.");
        return false;
      }

      setIsSending(true);
      setError(null);

      try {
        await realtimeRef.current?.sendTypingStatus(false);

        const nextMessage = await sendVisitorMessage({
          conversationId,
          body: trimmedBody,
        });

        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, nextMessage),
        );

        return true;
      } catch (error) {
        console.error("Live chat send failed:", error);

        setError("Message could not be sent. Please try again.");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId],
  );

  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    realtimeRef.current?.sendTypingStatus(isTyping);

    if (!isTyping) return;

    typingTimeoutRef.current = window.setTimeout(() => {
      realtimeRef.current?.sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1500);
  }, []);

  const latestMessage = useMemo(() => {
    return messages[messages.length - 1] ?? null;
  }, [messages]);

  const isVisitorOnline = Boolean(
    visitorId && presence.some((item) => item.userId === visitorId),
  );

  const isAdminOnline = presence.some((item) => item.role === "admin");

  return {
    visitorId,
    conversation,
    conversationId,
    messages,
    latestMessage,
    presence,
    isVisitorOnline,
    isAdminOnline,
    isAdminTyping,
    isLoading,
    isSending,
    error,
    sendMessage,
    sendTypingStatus,
  };
};
