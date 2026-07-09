export type ChatView = "home" | "messages" | "chat";

export type LiveChatMessageSender = "visitor" | "admin" | "system";

export type LiveChatConversationStatus = "open" | "pending" | "closed";

export type LiveChatAvailabilityMode = "online" | "offline";

export type LiveChatExtraChoice = "yes" | "no";

export type LiveChatProfileStep =
  | "welcome"
  | "privacy"
  | "name"
  | "email"
  | "offline_notice"
  | "service"
  | "topic"
  | "connecting"
  | "offline_confirm"
  | "extra_choice"
  | "extra_message_prompt"
  | "extra_message"
  | "extra_received"
  | "closed"
  | "ready";

export type LiveChatVisitorProfile = {
  displayName: string | null;
  email: string | null;
  contactService: string | null;
  contactTopic: string | null;
  contactExtraDetails: string | null;
  chatMode: LiveChatAvailabilityMode | null;
  onboardingStep: LiveChatProfileStep;
};

export type LiveChatMessage = {
  id: string;
  conversationId: string;
  senderType: LiveChatMessageSender;
  body: string;
  createdAt: string;
};

export type LiveChatConversation = {
  id: string;
  visitorId: string;
  status: LiveChatConversationStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
};

export type LiveChatPresenceRole = "visitor" | "admin";

export type LiveChatPresenceState = {
  userId: string;
  role: LiveChatPresenceRole;
  onlineAt: string;
};

export type LiveChatTypingPayload = {
  conversationId: string;
  userId: string;
  role: LiveChatPresenceRole;
  isTyping: boolean;
};
