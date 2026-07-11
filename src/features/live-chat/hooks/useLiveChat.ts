import { useCallback, useMemo, useRef, useState } from "react";
import { liveChatProfileCapture } from "../data/liveChat.data";
import {
  sendSystemMessage,
  updateVisitorProfile,
} from "../services/liveChat.service";
import type {
  LiveChatConversation,
  LiveChatMessage,
  LiveChatPresenceState,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";
import {
  appendUniqueLiveChatMessage,
  getUkBusinessAvailability,
  initialLiveChatVisitorProfile,
  wait,
} from "../utils";
import { useLiveChatChoiceHandlers } from "./useLiveChatChoiceHandlers";
import { useLiveChatConversationRunner } from "./useLiveChatConversationRunner";
import { useLiveChatInitialisation } from "./useLiveChatInitialisation";
import { useLiveChatMessageSender } from "./useLiveChatMessageSender";
import { useLiveChatMessagesSubscription } from "./useLiveChatMessagesSubscription";
import { useLiveChatProfileCapture } from "./useLiveChatProfileCapture";
import { useLiveChatRealtime } from "./useLiveChatRealtime";

export const useLiveChat = (
  enabled: boolean,
  shouldRunConversationFlow: boolean,
) => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [visitorProfile, setVisitorProfile] = useState<LiveChatVisitorProfile>(
    initialLiveChatVisitorProfile,
  );
  const [conversation, setConversation] = useState<LiveChatConversation | null>(
    null,
  );
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [presence, setPresence] = useState<LiveChatPresenceState[]>([]);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typingTimeoutRef = useRef<number | null>(null);

  const conversationId = conversation?.id ?? null;
  const profileStep = visitorProfile.onboardingStep;
  const chatMode = visitorProfile.chatMode ?? getUkBusinessAvailability();
  const isOfflineMode = chatMode === "offline";

  const updateLocalProfile = useCallback(
    (nextValues: Partial<LiveChatVisitorProfile>) => {
      setVisitorProfile((currentProfile) => ({
        ...currentProfile,
        ...nextValues,
      }));
    },
    [],
  );

  useLiveChatInitialisation({
    enabled,
    conversationId,
    setVisitorId,
    setVisitorProfile,
    setConversation,
    setMessages,
    setIsLoading,
    setError,
  });

  const { sendRealtimeTypingStatus } = useLiveChatRealtime({
    enabled,
    conversationId,
    visitorId,
    setPresence,
    setIsAdminTyping,
  });

  useLiveChatMessagesSubscription({
    enabled,
    conversationId,
    setMessages,
  });

  const sendPromptWithTyping = useCallback(
    async (body: string) => {
      if (!conversationId) return;

      setIsAgentTyping(true);

      await wait(liveChatProfileCapture.typingDelayMs);

      const nextMessage = await sendSystemMessage({
        conversationId,
        body,
      });

      setMessages((currentMessages) =>
        appendUniqueLiveChatMessage(currentMessages, nextMessage),
      );

      setIsAgentTyping(false);
    },
    [conversationId],
  );

  const saveConversationStep = useCallback(
    async (nextStep: LiveChatVisitorProfile["onboardingStep"]) => {
      if (!visitorId) return;

      await updateVisitorProfile({
        visitorId,
        onboardingStep: nextStep,
      });

      updateLocalProfile({
        onboardingStep: nextStep,
      });
    },
    [updateLocalProfile, visitorId],
  );

  useLiveChatConversationRunner({
    enabled,
    shouldRunConversationFlow,
    visitorId,
    conversationId,
    profileStep,
    chatMode,
    messages,
    visitorProfile,
    sendPromptWithTyping,
    saveConversationStep,
    setIsAgentTyping,
    setError,
  });

  const captureProfileValue = useLiveChatProfileCapture({
    visitorId,
    conversationId,
    profileStep,
    isOfflineMode,
    contactExtraDetails: visitorProfile.contactExtraDetails,
    updateLocalProfile,
    setMessages,
    setIsSending,
    setError,
  });

  const { selectServiceOption, selectExtraChoice } = useLiveChatChoiceHandlers({
    visitorId,
    conversationId,
    profileStep,
    updateLocalProfile,
    setMessages,
    setIsSending,
    setError,
  });

  const clearReadyTypingStatus = useCallback(async () => {
    await sendRealtimeTypingStatus(false);
  }, [sendRealtimeTypingStatus]);

  const sendReadyMessage = useLiveChatMessageSender({
    conversationId,
    clearTypingStatus: clearReadyTypingStatus,
    setMessages,
    setIsSending,
    setError,
  });

  const sendMessage = useCallback(
    async (body: string): Promise<boolean> => {
      const trimmedBody = body.trim();

      if (!trimmedBody) {
        return false;
      }

      if (profileStep !== "ready") {
        return captureProfileValue(trimmedBody);
      }

      return sendReadyMessage(trimmedBody);
    },
    [captureProfileValue, profileStep, sendReadyMessage],
  );

  const sendTypingStatus = useCallback(
    (isTyping: boolean) => {
      if (profileStep !== "ready") {
        return;
      }

      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      void sendRealtimeTypingStatus(isTyping);

      if (!isTyping) return;

      typingTimeoutRef.current = window.setTimeout(() => {
        void sendRealtimeTypingStatus(false);
        typingTimeoutRef.current = null;
      }, 1500);
    },
    [profileStep, sendRealtimeTypingStatus],
  );

  const latestMessage = useMemo(() => {
    return messages[messages.length - 1] ?? null;
  }, [messages]);

  const isVisitorOnline = Boolean(
    visitorId && presence.some((item) => item.userId === visitorId),
  );

  const isAdminOnline = presence.some((item) => item.role === "admin");

  return {
    visitorId,
    visitorProfile,
    profileStep,
    chatMode,
    conversation,
    conversationId,
    messages,
    latestMessage,
    presence,
    isVisitorOnline,
    isAdminOnline,
    isAdminTyping,
    isAgentTyping,
    isLoading,
    isSending,
    error,
    sendMessage,
    sendTypingStatus,
    selectServiceOption,
    selectExtraChoice,
  };
};
