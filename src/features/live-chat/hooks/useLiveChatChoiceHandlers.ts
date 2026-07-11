import { useCallback, type Dispatch, type SetStateAction } from "react";
import {
  sendVisitorMessage,
  updateVisitorProfile,
} from "../services/liveChat.service";
import type {
  LiveChatExtraChoice,
  LiveChatMessage,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";
import {
  appendUniqueLiveChatMessage,
  getLiveChatExtraChoiceNextStep,
  getLiveChatExtraChoiceText,
} from "../utils";

type UseLiveChatChoiceHandlersParams = {
  visitorId: string | null;
  conversationId: string | null;
  profileStep: LiveChatVisitorProfile["onboardingStep"];
  updateLocalProfile: (nextValues: Partial<LiveChatVisitorProfile>) => void;
  setMessages: Dispatch<SetStateAction<LiveChatMessage[]>>;
  setIsSending: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export const useLiveChatChoiceHandlers = ({
  visitorId,
  conversationId,
  profileStep,
  updateLocalProfile,
  setMessages,
  setIsSending,
  setError,
}: UseLiveChatChoiceHandlersParams) => {
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
          appendUniqueLiveChatMessage(currentMessages, visitorMessage),
        );

        const nextProfileValues: Partial<LiveChatVisitorProfile> = {
          contactService: service,
          onboardingStep: "topic",
        };

        await updateVisitorProfile({
          visitorId,
          ...nextProfileValues,
        });

        updateLocalProfile(nextProfileValues);

        return true;
      } catch (error) {
        console.error("Could not save selected service:", error);
        setError("Could not save your selected service. Please try again.");

        return false;
      } finally {
        setIsSending(false);
      }
    },
    [
      conversationId,
      profileStep,
      setError,
      setIsSending,
      setMessages,
      updateLocalProfile,
      visitorId,
    ],
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

      try {
        const choiceText = getLiveChatExtraChoiceText(choice);

        const visitorMessage = await sendVisitorMessage({
          conversationId,
          body: choiceText,
        });

        setMessages((currentMessages) =>
          appendUniqueLiveChatMessage(currentMessages, visitorMessage),
        );

        const nextStep = getLiveChatExtraChoiceNextStep(choice);

        await updateVisitorProfile({
          visitorId,
          onboardingStep: nextStep,
        });

        updateLocalProfile({
          onboardingStep: nextStep,
        });

        return true;
      } catch (error) {
        console.error("Could not save conversation choice:", error);
        setError("Could not save your choice. Please try again.");

        return false;
      } finally {
        setIsSending(false);
      }
    },
    [
      conversationId,
      profileStep,
      setError,
      setIsSending,
      setMessages,
      updateLocalProfile,
      visitorId,
    ],
  );

  return {
    selectServiceOption,
    selectExtraChoice,
  };
};
