import { useCallback, type Dispatch, type SetStateAction } from "react";
import {
  sendVisitorMessage,
  updateVisitorProfile,
} from "../services/liveChat.service";
import type {
  LiveChatMessage,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";
import {
  appendUniqueLiveChatMessage,
  getLiveChatCapturedEmail,
  getLiveChatEmailCaptureProfile,
  getLiveChatExtraMessageCaptureProfile,
  getLiveChatNameCaptureProfile,
  getLiveChatTopicCaptureProfile,
  isLiveChatEmailSkipValue,
  isValidLiveChatEmail,
} from "../utils";

type UseLiveChatProfileCaptureParams = {
  visitorId: string | null;
  conversationId: string | null;
  profileStep: LiveChatVisitorProfile["onboardingStep"];
  isOfflineMode: boolean;
  contactExtraDetails: string | null;
  updateLocalProfile: (nextValues: Partial<LiveChatVisitorProfile>) => void;
  setMessages: Dispatch<SetStateAction<LiveChatMessage[]>>;
  setIsSending: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export const useLiveChatProfileCapture = ({
  visitorId,
  conversationId,
  profileStep,
  isOfflineMode,
  contactExtraDetails,
  updateLocalProfile,
  setMessages,
  setIsSending,
  setError,
}: UseLiveChatProfileCaptureParams) => {
  return useCallback(
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
          const shouldSkipEmail = isLiveChatEmailSkipValue(trimmedValue);
          const nextEmail = getLiveChatCapturedEmail(trimmedValue);

          if (isOfflineMode && shouldSkipEmail) {
            setError(
              "Please enter an email so our team can reply when we are back online.",
            );
            return false;
          }

          if (nextEmail && !isValidLiveChatEmail(nextEmail)) {
            setError("Please enter a valid email address.");
            return false;
          }
        }

        const visitorMessage = await sendVisitorMessage({
          conversationId,
          body: trimmedValue,
        });

        setMessages((currentMessages) =>
          appendUniqueLiveChatMessage(currentMessages, visitorMessage),
        );

        if (profileStep === "name") {
          const nextProfileValues = getLiveChatNameCaptureProfile(trimmedValue);

          await updateVisitorProfile({
            visitorId,
            ...nextProfileValues,
          });

          updateLocalProfile(nextProfileValues);

          return true;
        }

        if (profileStep === "email") {
          const nextEmail = getLiveChatCapturedEmail(trimmedValue);
          const nextProfileValues = getLiveChatEmailCaptureProfile(
            nextEmail,
            isOfflineMode,
          );

          await updateVisitorProfile({
            visitorId,
            ...nextProfileValues,
          });

          updateLocalProfile(nextProfileValues);

          return true;
        }

        if (profileStep === "topic") {
          const nextProfileValues = getLiveChatTopicCaptureProfile(
            trimmedValue,
            isOfflineMode,
          );

          await updateVisitorProfile({
            visitorId,
            ...nextProfileValues,
          });

          updateLocalProfile(nextProfileValues);

          return true;
        }

        if (profileStep === "extra_message") {
          const nextProfileValues = getLiveChatExtraMessageCaptureProfile(
            contactExtraDetails,
            trimmedValue,
          );

          await updateVisitorProfile({
            visitorId,
            ...nextProfileValues,
          });

          updateLocalProfile(nextProfileValues);

          return true;
        }

        return false;
      } catch (error) {
        console.error("Could not save conversation reply:", error);
        setError("Could not save your reply. Please try again.");

        return false;
      } finally {
        setIsSending(false);
      }
    },
    [
      conversationId,
      contactExtraDetails,
      isOfflineMode,
      profileStep,
      setError,
      setIsSending,
      setMessages,
      updateLocalProfile,
      visitorId,
    ],
  );
};
