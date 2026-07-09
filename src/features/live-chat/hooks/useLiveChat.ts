import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured } from "../../../lib/supabase";
import { liveChatProfileCapture } from "../data/liveChat.data";
import {
  createLiveChatRealtimeChannel,
  ensureAnonymousVisitor,
  getConversationMessages,
  getOrCreateOpenConversation,
  getVisitorProfile,
  sendSystemMessage,
  sendVisitorMessage,
  subscribeToConversationMessages,
  updateVisitorProfile,
  upsertVisitorProfile,
} from "../services/liveChat.service";
import type {
  LiveChatAvailabilityMode,
  LiveChatConversation,
  LiveChatExtraChoice,
  LiveChatMessage,
  LiveChatPresenceState,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";
const wait = (duration: number) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
};
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
const hasMessageContaining = (messages: LiveChatMessage[], value: string) => {
  return messages.some((message) => message.body.includes(value));
};
const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};
const getUkBusinessAvailability = (): LiveChatAvailabilityMode => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hourValue = parts.find((part) => part.type === "hour")?.value ?? "0";
  const hour = Number(hourValue === "24" ? "0" : hourValue);
  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const isWorkingHour = hour >= 9 && hour < 18;
  return !isWeekend && isWorkingHour ? "online" : "offline";
};
const initialVisitorProfile: LiveChatVisitorProfile = {
  displayName: null,
  email: null,
  contactService: null,
  contactTopic: null,
  contactExtraDetails: null,
  chatMode: null,
  onboardingStep: "welcome",
};
export const useLiveChat = (enabled: boolean, shouldRunOnboarding: boolean) => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [visitorProfile, setVisitorProfile] = useState<LiveChatVisitorProfile>(
    initialVisitorProfile,
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
  const adminTypingTimeoutRef = useRef<number | null>(null);
  const onboardingRunnerRef = useRef(false);
  const realtimeRef = useRef<{
    sendTypingStatus: (isTyping: boolean) => Promise<void>;
    unsubscribe: () => void;
  } | null>(null);
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
  const sendPromptWithTyping = useCallback(
    async (body: string) => {
      if (!conversationId) return;
      setIsAgentTyping(true);
      await wait(liveChatProfileCapture.typingDelayMs);
      const nextMessage = await sendSystemMessage({ conversationId, body });
      setMessages((currentMessages) =>
        appendUniqueMessage(currentMessages, nextMessage),
      );
      setIsAgentTyping(false);
    },
    [conversationId],
  );
  const saveOnboardingStep = useCallback(
    async (nextStep: LiveChatVisitorProfile["onboardingStep"]) => {
      if (!visitorId) return;
      await updateVisitorProfile({ visitorId, onboardingStep: nextStep });
      updateLocalProfile({ onboardingStep: nextStep });
    },
    [updateLocalProfile, visitorId],
  );
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
        await upsertVisitorProfile({ visitorId: nextVisitorId });
        const nextVisitorProfile = await getVisitorProfile(nextVisitorId);
        const nextConversation =
          await getOrCreateOpenConversation(nextVisitorId);
        const nextMessages = await getConversationMessages(nextConversation.id);
        if (!isMounted) return;
        setVisitorId(nextVisitorId);
        setVisitorProfile(nextVisitorProfile);
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
    void initialiseLiveChat();
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
        if (payload.conversationId !== conversationId) return;
        if (payload.role !== "admin") return;
        if (adminTypingTimeoutRef.current) {
          window.clearTimeout(adminTypingTimeoutRef.current);
          adminTypingTimeoutRef.current = null;
        }
        setIsAdminTyping(Boolean(payload.isTyping));
        if (!payload.isTyping) return;
        adminTypingTimeoutRef.current = window.setTimeout(() => {
          setIsAdminTyping(false);
          adminTypingTimeoutRef.current = null;
        }, 2200);
      },
      onPresenceChange: setPresence,
    });
    realtimeRef.current = realtime;
    return () => {
      if (adminTypingTimeoutRef.current) {
        window.clearTimeout(adminTypingTimeoutRef.current);
        adminTypingTimeoutRef.current = null;
      }
      realtime.unsubscribe();
      realtimeRef.current = null;
      setPresence([]);
      setIsAdminTyping(false);
    };
  }, [enabled, conversationId, visitorId]);
  useEffect(() => {
    if (!enabled || !shouldRunOnboarding || !visitorId || !conversationId) {
      return;
    }
    if (profileStep === "ready") return;
    if (onboardingRunnerRef.current) return;
    let isMounted = true;
    const runOnboardingStep = async () => {
      onboardingRunnerRef.current = true;
      setError(null);
      try {
        if (profileStep === "welcome") {
          const welcomePrompt = liveChatProfileCapture.welcomePrompt();
          if (
            !hasMessageContaining(messages, "Welcome to DevBySam Live Chat")
          ) {
            await sendPromptWithTyping(welcomePrompt);
          }
          if (!isMounted) return;
          await saveOnboardingStep("privacy");
          await wait(300);
          if (!hasMessageContaining(messages, "Privacy Statement")) {
            await sendPromptWithTyping(liveChatProfileCapture.privacyPrompt);
          }
          if (!isMounted) return;
          await saveOnboardingStep("name");
          await wait(300);
          if (!hasMessageContaining(messages, "what’s your name")) {
            await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
          }
          return;
        }
        if (profileStep === "privacy") {
          if (!hasMessageContaining(messages, "Privacy Statement")) {
            await sendPromptWithTyping(liveChatProfileCapture.privacyPrompt);
          }
          if (!isMounted) return;
          await saveOnboardingStep("name");
          await wait(300);
          if (!hasMessageContaining(messages, "what’s your name")) {
            await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
          }
          return;
        }
        if (profileStep === "name") {
          if (!hasMessageContaining(messages, "what’s your name")) {
            await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
          }
          return;
        }
        if (profileStep === "email") {
          const name = visitorProfile.displayName ?? "there";
          const isEmailRequired = chatMode === "offline";
          if (!hasMessageContaining(messages, "What email should I use")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.emailPrompt(name, isEmailRequired),
            );
          }
          return;
        }
        if (profileStep === "offline_notice") {
          const name = visitorProfile.displayName ?? "there";
          if (!hasMessageContaining(messages, "We are currently offline")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.offlineNoticePrompt(name),
            );
          }
          if (!isMounted) return;
          await saveOnboardingStep("service");
          return;
        }
        if (profileStep === "service") {
          const name = visitorProfile.displayName ?? "there";
          const isOffline = chatMode === "offline";
          if (
            !hasMessageContaining(messages, "How may I help you today") &&
            !hasMessageContaining(messages, "What service are you contacting")
          ) {
            await sendPromptWithTyping(
              liveChatProfileCapture.servicePrompt(name, isOffline),
            );
          }
          return;
        }
        if (profileStep === "topic") {
          const name = visitorProfile.displayName ?? "there";
          if (!hasMessageContaining(messages, "Briefly describe")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.topicPrompt(name),
            );
          }
          return;
        }
        if (profileStep === "connecting") {
          if (
            !hasMessageContaining(messages, "connecting you to one of our team")
          ) {
            await sendPromptWithTyping(liveChatProfileCapture.connectingPrompt);
          }
          if (!isMounted) return;
          await saveOnboardingStep("ready");
          return;
        }
        if (profileStep === "offline_confirm") {
          const name = visitorProfile.displayName ?? "there";
          if (!hasMessageContaining(messages, "We’ve received your message")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.offlineReceivedPrompt(name),
            );
          }
          if (!isMounted) return;
          await saveOnboardingStep("extra_choice");
          await wait(300);
          if (!hasMessageContaining(messages, "anything else")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.anythingElsePrompt,
            );
          }
          return;
        }
        if (profileStep === "extra_choice") {
          if (!hasMessageContaining(messages, "anything else")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.anythingElsePrompt,
            );
          }
          return;
        }
        if (profileStep === "extra_message_prompt") {
          if (!hasMessageContaining(messages, "extra details")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.extraDetailsPrompt,
            );
          }
          if (!isMounted) return;
          await saveOnboardingStep("extra_message");
          return;
        }
        if (profileStep === "extra_received") {
          const name = visitorProfile.displayName ?? "there";
          if (!hasMessageContaining(messages, "added that to your enquiry")) {
            await sendPromptWithTyping(
              liveChatProfileCapture.extraReceivedPrompt(name),
            );
          }
          if (!isMounted) return;
          await saveOnboardingStep("extra_choice");
          await wait(300);
          await sendPromptWithTyping(liveChatProfileCapture.anythingElsePrompt);
          return;
        }
        if (profileStep === "closed") {
          const name = visitorProfile.displayName ?? "there";
          if (
            !hasMessageContaining(messages, "Have a lovely day") &&
            !hasMessageContaining(messages, "Have a good night")
          ) {
            await sendPromptWithTyping(
              liveChatProfileCapture.closingPrompt(name),
            );
          }
        }
      } catch (error) {
        console.error("Live chat onboarding failed:", error);
        if (!isMounted) return;
        setError("Live chat setup could not continue. Please try again.");
      } finally {
        setIsAgentTyping(false);
        onboardingRunnerRef.current = false;
      }
    };
    void runOnboardingStep();
    return () => {
      isMounted = false;
    };
  }, [
    chatMode,
    conversationId,
    enabled,
    messages,
    profileStep,
    saveOnboardingStep,
    sendPromptWithTyping,
    shouldRunOnboarding,
    visitorId,
    visitorProfile.displayName,
  ]);
  const captureProfileValue = useCallback(
    async (value: string): Promise<boolean> => {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        return false;
      }
      if (!visitorId || !conversationId) {
        setError("Live chat is still connecting. Please try again.");
        return false;
      }
      setIsSending(true);
      setError(null);
      try {
        if (profileStep === "email") {
          const shouldSkipEmail =
            trimmedValue.toLowerCase() ===
            liveChatProfileCapture.skipEmailValue;
          const nextEmail = shouldSkipEmail ? null : trimmedValue;
          const isEmailRequired = chatMode === "offline";
          if (isEmailRequired && shouldSkipEmail) {
            setError(
              "Please enter an email so our team can reply when we are back online.",
            );
            return false;
          }
          if (nextEmail && !isValidEmail(nextEmail)) {
            setError("Please enter a valid email address.");
            return false;
          }
        }
        const visitorMessage = await sendVisitorMessage({
          conversationId,
          body: trimmedValue,
        });
        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, visitorMessage),
        );
        if (profileStep === "name") {
          const nextChatMode = getUkBusinessAvailability();
          await updateVisitorProfile({
            visitorId,
            displayName: trimmedValue,
            chatMode: nextChatMode,
            onboardingStep: "email",
          });
          updateLocalProfile({
            displayName: trimmedValue,
            chatMode: nextChatMode,
            onboardingStep: "email",
          });
          return true;
        }
        if (profileStep === "email") {
          const shouldSkipEmail =
            trimmedValue.toLowerCase() ===
            liveChatProfileCapture.skipEmailValue;
          const nextEmail = shouldSkipEmail ? null : trimmedValue;
          const nextStep = isOfflineMode ? "offline_notice" : "service";
          await updateVisitorProfile({
            visitorId,
            email: nextEmail,
            onboardingStep: nextStep,
          });
          updateLocalProfile({ email: nextEmail, onboardingStep: nextStep });
          return true;
        }
        if (profileStep === "topic") {
          const nextStep = isOfflineMode ? "offline_confirm" : "connecting";
          await updateVisitorProfile({
            visitorId,
            contactTopic: trimmedValue,
            onboardingStep: nextStep,
          });
          updateLocalProfile({
            contactTopic: trimmedValue,
            onboardingStep: nextStep,
          });
          return true;
        }
        if (profileStep === "extra_message") {
          const existingDetails = visitorProfile.contactExtraDetails;
          const nextExtraDetails = existingDetails
            ? `${existingDetails}\n\n${trimmedValue}`
            : trimmedValue;
          await updateVisitorProfile({
            visitorId,
            contactExtraDetails: nextExtraDetails,
            onboardingStep: "extra_received",
          });
          updateLocalProfile({
            contactExtraDetails: nextExtraDetails,
            onboardingStep: "extra_received",
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Could not save onboarding reply:", error);
        setError("Could not save your reply. Please try again.");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [
      chatMode,
      conversationId,
      isOfflineMode,
      profileStep,
      updateLocalProfile,
      visitorId,
      visitorProfile.contactExtraDetails,
    ],
  );
  const selectServiceOption = useCallback(
    async (service: string): Promise<boolean> => {
      if (!visitorId || !conversationId) {
        setError("Live chat is still connecting. Please try again.");
        return false;
      }
      if (profileStep !== "service") {
        return false;
      }
      setIsSending(true);
      setError(null);
      try {
        const visitorMessage = await sendVisitorMessage({
          conversationId,
          body: service,
        });
        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, visitorMessage),
        );
        await updateVisitorProfile({
          visitorId,
          contactService: service,
          onboardingStep: "topic",
        });
        updateLocalProfile({
          contactService: service,
          onboardingStep: "topic",
        });
        return true;
      } catch (error) {
        console.error("Could not save selected service:", error);
        setError("Could not save your selected service. Please try again.");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, profileStep, updateLocalProfile, visitorId],
  );
  const selectExtraChoice = useCallback(
    async (choice: LiveChatExtraChoice): Promise<boolean> => {
      if (!visitorId || !conversationId) {
        setError("Live chat is still connecting. Please try again.");
        return false;
      }
      if (profileStep !== "extra_choice") {
        return false;
      }
      setIsSending(true);
      setError(null);
      const choiceText =
        choice === "yes" ? "Yes, add more details" : "No, that’s everything";
      try {
        const visitorMessage = await sendVisitorMessage({
          conversationId,
          body: choiceText,
        });
        setMessages((currentMessages) =>
          appendUniqueMessage(currentMessages, visitorMessage),
        );
        const nextStep = choice === "yes" ? "extra_message_prompt" : "closed";
        await updateVisitorProfile({ visitorId, onboardingStep: nextStep });
        updateLocalProfile({ onboardingStep: nextStep });
        return true;
      } catch (error) {
        console.error("Could not save visitor choice:", error);
        setError("Could not save your choice. Please try again.");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, profileStep, updateLocalProfile, visitorId],
  );
  const sendMessage = useCallback(
    async (body: string): Promise<boolean> => {
      const trimmedBody = body.trim();
      if (!trimmedBody) {
        return false;
      }
      if (profileStep !== "ready") {
        return captureProfileValue(trimmedBody);
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
    [captureProfileValue, conversationId, profileStep],
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
      void realtimeRef.current?.sendTypingStatus(isTyping);
      if (!isTyping) return;
      typingTimeoutRef.current = window.setTimeout(() => {
        void realtimeRef.current?.sendTypingStatus(false);
        typingTimeoutRef.current = null;
      }, 1500);
    },
    [profileStep],
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
