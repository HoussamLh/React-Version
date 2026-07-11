import { liveChatAgent, liveChatTranscript } from "../data/liveChat.data";
import type {
  LiveChatMessage,
  LiveChatProfileStep,
} from "../types/liveChat.types";

export const getLiveChatTranscriptSender = (message: LiveChatMessage) => {
  if (message.senderType === "visitor") return "Visitor";
  if (message.senderType === "admin") return liveChatAgent.name;
  if (message.senderType === "system") return liveChatAgent.name;

  return "System";
};

export const buildLiveChatTranscript = (messages: LiveChatMessage[]) => {
  const storedMessages = messages.length
    ? messages
        .map((chatMessage) => {
          return `${getLiveChatTranscriptSender(chatMessage)}:\n${chatMessage.body}`;
        })
        .join("\n\n")
    : "No visitor messages sent yet.";

  return `
${liveChatTranscript.title}

${storedMessages}
`;
};

export const getLiveChatMessagePlaceholder = (
  profileStep: LiveChatProfileStep,
) => {
  if (
    profileStep === "welcome" ||
    profileStep === "privacy" ||
    profileStep === "offline_notice" ||
    profileStep === "connecting" ||
    profileStep === "offline_confirm" ||
    profileStep === "extra_choice" ||
    profileStep === "extra_message_prompt" ||
    profileStep === "extra_received" ||
    profileStep === "closed"
  ) {
    return "Please wait...";
  }

  if (profileStep === "name") {
    return "Type your name...";
  }

  if (profileStep === "email") {
    return "Type your email...";
  }

  if (profileStep === "service") {
    return "Please choose a service...";
  }

  if (profileStep === "topic") {
    return "Briefly describe your enquiry...";
  }

  if (profileStep === "extra_message") {
    return "Type extra details...";
  }

  return "Message...";
};

export const isLiveChatComposerDisabledForStep = (
  profileStep: LiveChatProfileStep,
) => {
  return (
    profileStep === "welcome" ||
    profileStep === "privacy" ||
    profileStep === "offline_notice" ||
    profileStep === "service" ||
    profileStep === "connecting" ||
    profileStep === "offline_confirm" ||
    profileStep === "extra_choice" ||
    profileStep === "extra_message_prompt" ||
    profileStep === "extra_received" ||
    profileStep === "closed"
  );
};
