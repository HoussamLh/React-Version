import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type {
  LiveChatAvailabilityMode,
  LiveChatMessage,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";
import { runLiveChatConversationStep } from "../utils/liveChatConversationRunner.helpers";

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
  saveConversationStep: (nextStep: LiveChatVisitorProfile["onboardingStep"]) => Promise<void>;
  setIsAgentTyping: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export const useLiveChatConversationRunner = ({
  enabled, shouldRunConversationFlow, visitorId, conversationId, profileStep, chatMode, messages, visitorProfile,
  sendPromptWithTyping, saveConversationStep, setIsAgentTyping, setError,
}: UseLiveChatConversationRunnerParams) => {
  const conversationRunnerRef = useRef(false);

  useEffect(() => {
    if (!enabled || !shouldRunConversationFlow || !visitorId || !conversationId) return;
    if (profileStep === "ready" || conversationRunnerRef.current) return;

    let isMounted = true;
    const run = async () => {
      conversationRunnerRef.current = true;
      setError(null);

      try {
        await runLiveChatConversationStep({
          profileStep, chatMode, messages, visitorProfile, sendPromptWithTyping, saveConversationStep,
          isMounted: () => isMounted,
        });
      } catch (error) {
        console.error("Live chat conversation flow failed:", error);
        if (isMounted) setError("Live chat setup could not continue. Please try again.");
      } finally {
        setIsAgentTyping(false);
        conversationRunnerRef.current = false;
      }
    };

    void run();
    return () => { isMounted = false; };
  }, [
    chatMode, conversationId, enabled, messages, profileStep, saveConversationStep, sendPromptWithTyping,
    setError, setIsAgentTyping, shouldRunConversationFlow, visitorProfile, visitorId,
  ]);
};
