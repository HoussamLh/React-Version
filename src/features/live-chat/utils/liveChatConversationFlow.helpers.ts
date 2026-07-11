import { liveChatProfileCapture } from "../data/liveChat.data";
import type {
  LiveChatExtraChoice,
  LiveChatMessage,
  LiveChatVisitorProfile,
} from "../types/liveChat.types";
import {
  getUkBusinessAvailability,
  hasLiveChatMessageContaining,
} from "./liveChat.helpers";

export const initialLiveChatVisitorProfile: LiveChatVisitorProfile = {
  displayName: null,
  email: null,
  contactService: null,
  contactTopic: null,
  contactExtraDetails: null,
  chatMode: null,
  onboardingStep: "welcome",
};

export const getLiveChatVisitorDisplayName = (
  visitorProfile: LiveChatVisitorProfile,
) => {
  return visitorProfile.displayName ?? "there";
};

export const getLiveChatEmailNextStep = (
  isOfflineMode: boolean,
): LiveChatVisitorProfile["onboardingStep"] => {
  return isOfflineMode ? "offline_notice" : "service";
};

export const getLiveChatTopicNextStep = (
  isOfflineMode: boolean,
): LiveChatVisitorProfile["onboardingStep"] => {
  return isOfflineMode ? "offline_confirm" : "connecting";
};

export const getLiveChatNextExtraDetails = (
  existingDetails: string | null,
  nextDetails: string,
) => {
  return existingDetails ? `${existingDetails}\n\n${nextDetails}` : nextDetails;
};

export const getLiveChatExtraChoiceText = (choice: LiveChatExtraChoice) => {
  return choice === "yes" ? "Yes, add more details" : "No, that’s everything";
};

export const getLiveChatExtraChoiceNextStep = (
  choice: LiveChatExtraChoice,
): LiveChatVisitorProfile["onboardingStep"] => {
  return choice === "yes" ? "extra_message_prompt" : "closed";
};

export const isLiveChatEmailSkipValue = (value: string) => {
  return value.toLowerCase() === liveChatProfileCapture.skipEmailValue;
};

export const getLiveChatCapturedEmail = (value: string) => {
  return isLiveChatEmailSkipValue(value) ? null : value;
};

export const getLiveChatNameCaptureProfile = (
  displayName: string,
): Partial<LiveChatVisitorProfile> => {
  return {
    displayName,
    chatMode: getUkBusinessAvailability(),
    onboardingStep: "email",
  };
};

export const getLiveChatEmailCaptureProfile = (
  email: string | null,
  isOfflineMode: boolean,
): Partial<LiveChatVisitorProfile> => {
  return {
    email,
    onboardingStep: getLiveChatEmailNextStep(isOfflineMode),
  };
};

export const getLiveChatTopicCaptureProfile = (
  contactTopic: string,
  isOfflineMode: boolean,
): Partial<LiveChatVisitorProfile> => {
  return {
    contactTopic,
    onboardingStep: getLiveChatTopicNextStep(isOfflineMode),
  };
};

export const getLiveChatExtraMessageCaptureProfile = (
  existingDetails: string | null,
  nextDetails: string,
): Partial<LiveChatVisitorProfile> => {
  return {
    contactExtraDetails: getLiveChatNextExtraDetails(
      existingDetails,
      nextDetails,
    ),
    onboardingStep: "extra_received",
  };
};

export const hasLiveChatWelcomePrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(
    messages,
    "Welcome to DevBySam Live Chat",
  );
};

export const hasLiveChatPrivacyPrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "Privacy Statement");
};

export const hasLiveChatNamePrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "what’s your name");
};

export const hasLiveChatEmailPrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "What email should I use");
};

export const hasLiveChatOfflineNoticePrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "We are currently offline");
};

export const hasLiveChatServicePrompt = (messages: LiveChatMessage[]) => {
  return (
    hasLiveChatMessageContaining(messages, "How may I help you today") ||
    hasLiveChatMessageContaining(messages, "What service are you contacting")
  );
};

export const hasLiveChatTopicPrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "Briefly describe");
};

export const hasLiveChatConnectingPrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(
    messages,
    "connecting you to one of our team",
  );
};

export const hasLiveChatOfflineReceivedPrompt = (
  messages: LiveChatMessage[],
) => {
  return hasLiveChatMessageContaining(messages, "We’ve received your message");
};

export const hasLiveChatAnythingElsePrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "anything else");
};

export const hasLiveChatExtraDetailsPrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "extra details");
};

export const hasLiveChatExtraReceivedPrompt = (messages: LiveChatMessage[]) => {
  return hasLiveChatMessageContaining(messages, "added that to your enquiry");
};

export const hasLiveChatClosingPrompt = (messages: LiveChatMessage[]) => {
  return (
    hasLiveChatMessageContaining(messages, "Have a lovely day") ||
    hasLiveChatMessageContaining(messages, "Have a good night")
  );
};
