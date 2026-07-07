import { useCallback, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured } from "../../../lib/supabase";
import {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      } catch {
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

  const sendMessage = useCallback(
    async (body: string) => {
      const trimmedBody = body.trim();

      if (!trimmedBody || !conversationId) return;

      setIsSending(true);
      setError(null);

      try {
        const nextMessage = await sendVisitorMessage({
          conversationId,
          body: trimmedBody,
        });

        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, nextMessage),
        );
      } catch {
        setError("Message could not be sent. Please try again.");
      } finally {
        setIsSending(false);
      }
    },
    [conversationId],
  );

  const latestMessage = useMemo(() => {
    return messages[messages.length - 1] ?? null;
  }, [messages]);

  return {
    visitorId,
    conversation,
    conversationId,
    messages,
    latestMessage,
    isLoading,
    isSending,
    error,
    sendMessage,
  };
};
