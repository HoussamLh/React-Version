import { liveChatProfileCapture } from "../data/liveChat.data";
import type {
  LiveChatAvailabilityMode,
  LiveChatMessage,
  LiveChatProfileStep,
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
} from "./index";

export const LIVE_CHAT_CONVERSATION_STEP_DELAY_MS = 300;

type RunnerContext = {
  profileStep: LiveChatProfileStep;
  chatMode: LiveChatAvailabilityMode;
  messages: LiveChatMessage[];
  visitorProfile: LiveChatVisitorProfile;
  sendPromptWithTyping: (body: string) => Promise<void>;
  saveConversationStep: (nextStep: LiveChatProfileStep) => Promise<void>;
  isMounted: () => boolean;
};

const hasPrompt = {
  welcome: hasLiveChatWelcomePrompt,
  privacy: hasLiveChatPrivacyPrompt,
  name: hasLiveChatNamePrompt,
  email: hasLiveChatEmailPrompt,
  offline_notice: hasLiveChatOfflineNoticePrompt,
  service: hasLiveChatServicePrompt,
  topic: hasLiveChatTopicPrompt,
  connecting: hasLiveChatConnectingPrompt,
  offline_confirm: hasLiveChatOfflineReceivedPrompt,
  extra_choice: hasLiveChatAnythingElsePrompt,
  extra_message_prompt: hasLiveChatExtraDetailsPrompt,
  extra_received: hasLiveChatExtraReceivedPrompt,
  closed: hasLiveChatClosingPrompt,
} as const;

export const runLiveChatConversationStep = async ({
  profileStep,
  chatMode,
  messages,
  visitorProfile,
  sendPromptWithTyping,
  saveConversationStep,
  isMounted,
}: RunnerContext) => {
  const visitorDisplayName = getLiveChatVisitorDisplayName(visitorProfile);

  if (profileStep === "welcome") {
    if (!hasPrompt.welcome(messages)) await sendPromptWithTyping(liveChatProfileCapture.welcomePrompt());
    if (!isMounted()) return;
    await saveConversationStep("privacy");
    await wait(LIVE_CHAT_CONVERSATION_STEP_DELAY_MS);
    if (!hasPrompt.privacy(messages)) await sendPromptWithTyping(liveChatProfileCapture.privacyPrompt);
    if (!isMounted()) return;
    await saveConversationStep("name");
    await wait(LIVE_CHAT_CONVERSATION_STEP_DELAY_MS);
    if (!hasPrompt.name(messages)) await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
    return;
  }

  if (profileStep === "privacy") {
    if (!hasPrompt.privacy(messages)) await sendPromptWithTyping(liveChatProfileCapture.privacyPrompt);
    if (!isMounted()) return;
    await saveConversationStep("name");
    await wait(LIVE_CHAT_CONVERSATION_STEP_DELAY_MS);
    if (!hasPrompt.name(messages)) await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
    return;
  }

  if (profileStep === "name") {
    if (!hasPrompt.name(messages)) await sendPromptWithTyping(liveChatProfileCapture.namePrompt);
    return;
  }

  if (profileStep === "email") {
    if (!hasPrompt.email(messages)) {
      await sendPromptWithTyping(liveChatProfileCapture.emailPrompt(visitorDisplayName, chatMode === "offline"));
    }
    return;
  }

  if (profileStep === "offline_notice") {
    if (!hasPrompt.offline_notice(messages)) await sendPromptWithTyping(liveChatProfileCapture.offlineNoticePrompt(visitorDisplayName));
    if (!isMounted()) return;
    await saveConversationStep("service");
    return;
  }

  if (profileStep === "service") {
    if (!hasPrompt.service(messages)) await sendPromptWithTyping(liveChatProfileCapture.servicePrompt(visitorDisplayName, chatMode === "offline"));
    return;
  }

  if (profileStep === "topic") {
    if (!hasPrompt.topic(messages)) await sendPromptWithTyping(liveChatProfileCapture.topicPrompt(visitorDisplayName));
    return;
  }

  if (profileStep === "connecting") {
    if (!hasPrompt.connecting(messages)) await sendPromptWithTyping(liveChatProfileCapture.connectingPrompt);
    if (!isMounted()) return;
    await saveConversationStep("ready");
    return;
  }

  if (profileStep === "offline_confirm") {
    if (!hasPrompt.offline_confirm(messages)) await sendPromptWithTyping(liveChatProfileCapture.offlineReceivedPrompt(visitorDisplayName));
    if (!isMounted()) return;
    await saveConversationStep("extra_choice");
    await wait(LIVE_CHAT_CONVERSATION_STEP_DELAY_MS);
    if (!hasPrompt.extra_choice(messages)) await sendPromptWithTyping(liveChatProfileCapture.anythingElsePrompt);
    return;
  }

  if (profileStep === "extra_choice") {
    if (!hasPrompt.extra_choice(messages)) await sendPromptWithTyping(liveChatProfileCapture.anythingElsePrompt);
    return;
  }

  if (profileStep === "extra_message_prompt") {
    if (!hasPrompt.extra_message_prompt(messages)) await sendPromptWithTyping(liveChatProfileCapture.extraDetailsPrompt);
    if (!isMounted()) return;
    await saveConversationStep("extra_message");
    return;
  }

  if (profileStep === "extra_received") {
    if (!hasPrompt.extra_received(messages)) await sendPromptWithTyping(liveChatProfileCapture.extraReceivedPrompt(visitorDisplayName));
    if (!isMounted()) return;
    await saveConversationStep("extra_choice");
    await wait(LIVE_CHAT_CONVERSATION_STEP_DELAY_MS);
    await sendPromptWithTyping(liveChatProfileCapture.anythingElsePrompt);
    return;
  }

  if (profileStep === "closed" && !hasPrompt.closed(messages)) {
    await sendPromptWithTyping(liveChatProfileCapture.closingPrompt(visitorDisplayName));
  }
};
