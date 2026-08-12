import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentAdminProfile } from "../../auth/adminAuth.service";
import {
  getAdminConversationMessages,
  sendAdminMessage,
  updateConversationStatus,
} from "../services/adminChat.service";
import {
  subscribeToAdminConversationMessages,
  createAdminRealtimeChannel,
} from "../services/adminChat.realtime.service";
import type {
  AdminConversation,
  AdminConversationStatus,
  AdminMessage,
} from "../types/adminChat.types";

const appendUniqueMessage = (
  currentMessages: AdminMessage[],
  nextMessage: AdminMessage,
): AdminMessage[] => {
  const exists = currentMessages.some(
    (message) => message.id === nextMessage.id,
  );

  if (exists) {
    return currentMessages;
  }

  return [...currentMessages, nextMessage];
};

type UseAdminChatOptions = {
  conversation: AdminConversation | null;
  onConversationUpdated: () => void;
};

export const useAdminChat = ({
  conversation,
  onConversationUpdated,
}: UseAdminChatOptions) => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisitorOnline, setIsVisitorOnline] = useState(false);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);

  const realtimeRef = useRef<{
    sendTypingStatus: (isTyping: boolean) => Promise<void>;
    unsubscribe: () => void;
  } | null>(null);

  const conversationId = conversation?.id ?? null;
  const conversationStatus = conversation?.status ?? null;

  /*
   * Load conversation messages.
   */
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

        if (!isMounted) {
          return;
        }

        setMessages(nextMessages);
      } catch {
        if (!isMounted) {
          return;
        }

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

  /*
   * Subscribe to new messages for the selected conversation.
   */
  useEffect(() => {
    if (!conversationId) {
      return;
    }

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

  /*
   * Create realtime presence + typing channel.
   */
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    let isMounted = true;

    void Promise.resolve().then(async () => {
      const adminProfile = await getCurrentAdminProfile();

      if (!isMounted || !adminProfile) {
        return;
      }

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

  /*
   * Visitor typing state.
   */
  const handleTypingChange = useCallback((isTyping: boolean) => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    void realtimeRef.current?.sendTypingStatus(isTyping);

    if (!isTyping) {
      return;
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      void realtimeRef.current?.sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 1500);
  }, []);

  /*
   * Temporary success message.
   */
  const showSuccessMessage = useCallback((message: string) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 2200);
  }, []);

  /*
   * Update conversation status.
   */
  const handleStatusChange = useCallback(
    async (status: AdminConversationStatus) => {
      if (!conversationId || conversationStatus === status) {
        return;
      }

      if (status === "closed") {
        const confirmed = window.confirm(
          "Are you sure you want to close this live chat conversation?",
        );

        if (!confirmed) {
          return;
        }
      }

      setIsUpdatingStatus(true);
      setError("");
      setSuccessMessage("");

      try {
        await updateConversationStatus({
          conversationId,
          status,
        });

        onConversationUpdated();

        showSuccessMessage(`Conversation marked as ${status}.`);
      } catch {
        setError("Could not update conversation status.");
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [
      conversationId,
      conversationStatus,
      onConversationUpdated,
      showSuccessMessage,
    ],
  );

  /*
   * Send admin reply.
   */
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedReply = reply.trim();

      if (!conversationId || !trimmedReply) {
        return;
      }

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
          await updateConversationStatus({
            conversationId,
            status: "open",
          });
        }

        onConversationUpdated();
      } catch {
        setError("Could not send reply.");
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, conversationStatus, onConversationUpdated, reply],
  );

  return {
    messages,
    reply,

    isLoading,
    isSending,
    isUpdatingStatus,

    error,
    successMessage,

    isVisitorOnline,
    isVisitorTyping,

    setReply,

    handleTypingChange,
    handleStatusChange,
    handleSubmit,
  };
};
