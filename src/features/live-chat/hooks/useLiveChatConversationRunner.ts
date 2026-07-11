import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { liveChatProfileCapture } from "../data/liveChat.data";
import type {
  LiveChatAvailabilityMode,
  LiveChatMessage,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";
import {
  getLiveChatVisitorDisplayName,
  hasLiveChatAnythingElsePrompt,
  hasLiveChatClosingPrompt,
  hasLiveChatConnectingPrompt,
  hasLiveChatEmailPrompt,
  hasLiveChatExtraDetailsPrompt,
  hasLiveChatExtraReceivedPrompt,
  hasLiveChatNamePrompt,
  hasLiveChatOfflineNoticePrompt,
  hasLiveChatOfflineReceivedPrompt,
  hasLiveChatPrivacyPrompt,
  hasLiveChatServicePrompt,
  hasLiveChatTopicPrompt,
  hasLiveChatWelcomePrompt,
  wait,
} from "../utils";

const CONVERSATION_STEP_DELAY_MS = 300;

type UseLiveChatConversationRunnerParams = {
  enabled: boolean;
  shouldRunConversationFlow: boolean;
  visitorId: string | null;
  conversationId: string | null;
  profileStep: LiveChatVisitorProfile["onboardingStep"];
  chatMode: LiveChatAvailabilityMode;
  messages: LiveChatMessage[];
  visitorProfile: LiveChatVisitorProfile;
  sendPromptWithTyping: (body: string) => Promise<void>;
  saveConversationStep: (
    nextStep: LiveChatVisitorProfile["onboardingStep"],
  ) => Promise<void>;
  setIsAgentTyping: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export const useLiveChatConversationRunner = ({
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
}: UseLiveChatConversationRunnerParams) => {
  const conversationRunnerRef = useRef(false);
  const visitorDisplayName = getLiveChatVisitorDisplayName(visitorProfile);

  useEffect(() => {
    if (
      !enabled ||
      !shouldRunConversationFlow ||
      !visitorId ||
      !conversationId
    ) {
      return;
    }

    if (profileStep === "ready") return;
    if (conversationRunnerRef.current) return;

    let isMounted = true;

    const runConversationStep = async () => {
      conversationRunnerRef.current = true;
      setError(null);

      try {
        if (profileStep === "welcome") {
          const welcomePrompt = liveChatProfileCapture.welcomePrompt();

          if (!hasLiveChatWelcomePrompt(messages)) {
            await sendPromptWithTyping(welcomePrompt);
          }

          if (!isMounted) return;

          await saveConversationStep("privacy");
          await wait(CONVERSATION_STEP_DELAY_MS);

          if (!hasLiveChatPrivacyPrompt(messages)) {
            await sendPromptWithTyping(liveChatProfileCapture.privacyPrompt);
          }

          if (!isMounted) return;

          await saveConversationStep("name");
          await wait(CONVERSATION_STEP_DELAY_MS);

          if (!hasLiveChatNamePrompt(messages)) {
            await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
          }

          return;
        }

        if (profileStep === "privacy") {
          if (!hasLiveChatPrivacyPrompt(messages)) {
            await sendPromptWithTyping(liveChatProfileCapture.privacyPrompt);
          }

          if (!isMounted) return;

          await saveConversationStep("name");
          await wait(CONVERSATION_STEP_DELAY_MS);

          if (!hasLiveChatNamePrompt(messages)) {
            await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
          }

          return;
        }

        if (profileStep === "name") {
          if (!hasLiveChatNamePrompt(messages)) {
            await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
          }

          return;
        }

        if (profileStep === "email") {
          const isEmailRequired = chatMode === "offline";

          if (!hasLiveChatEmailPrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.emailPrompt(
                visitorDisplayName,
                isEmailRequired,
              ),
            );
          }

          return;
        }

        if (profileStep === "offline_notice") {
          if (!hasLiveChatOfflineNoticePrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.offlineNoticePrompt(visitorDisplayName),
            );
          }

          if (!isMounted) return;

          await saveConversationStep("service");

          return;
        }

        if (profileStep === "service") {
          const isOffline = chatMode === "offline";

          if (!hasLiveChatServicePrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.servicePrompt(
                visitorDisplayName,
                isOffline,
              ),
            );
          }

          return;
        }

        if (profileStep === "topic") {
          if (!hasLiveChatTopicPrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.topicPrompt(visitorDisplayName),
            );
          }

          return;
        }

        if (profileStep === "connecting") {
          if (!hasLiveChatConnectingPrompt(messages)) {
            await sendPromptWithTyping(liveChatProfileCapture.connectingPrompt);
          }

          if (!isMounted) return;

          await saveConversationStep("ready");

          return;
        }

        if (profileStep === "offline_confirm") {
          if (!hasLiveChatOfflineReceivedPrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.offlineReceivedPrompt(visitorDisplayName),
            );
          }

          if (!isMounted) return;

          await saveConversationStep("extra_choice");
          await wait(CONVERSATION_STEP_DELAY_MS);

          if (!hasLiveChatAnythingElsePrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.anythingElsePrompt,
            );
          }

          return;
        }

        if (profileStep === "extra_choice") {
          if (!hasLiveChatAnythingElsePrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.anythingElsePrompt,
            );
          }

          return;
        }

        if (profileStep === "extra_message_prompt") {
          if (!hasLiveChatExtraDetailsPrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.extraDetailsPrompt,
            );
          }

          if (!isMounted) return;

          await saveConversationStep("extra_message");

          return;
        }

        if (profileStep === "extra_received") {
          if (!hasLiveChatExtraReceivedPrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.extraReceivedPrompt(visitorDisplayName),
            );
          }

          if (!isMounted) return;

          await saveConversationStep("extra_choice");
          await wait(CONVERSATION_STEP_DELAY_MS);
          await sendPromptWithTyping(liveChatProfileCapture.anythingElsePrompt);

          return;
        }

        if (profileStep === "closed") {
          if (!hasLiveChatClosingPrompt(messages)) {
            await sendPromptWithTyping(
              liveChatProfileCapture.closingPrompt(visitorDisplayName),
            );
          }
        }
      } catch (error) {
        console.error("Live chat conversation flow failed:", error);

        if (!isMounted) return;

        setError("Live chat setup could not continue. Please try again.");
      } finally {
        setIsAgentTyping(false);
        conversationRunnerRef.current = false;
      }
    };

    void runConversationStep();

    return () => {
      isMounted = false;
    };
  }, [
    chatMode,
    conversationId,
    enabled,
    messages,
    profileStep,
    saveConversationStep,
    sendPromptWithTyping,
    setError,
    setIsAgentTyping,
    shouldRunConversationFlow,
    visitorDisplayName,
    visitorId,
  ]);
};
