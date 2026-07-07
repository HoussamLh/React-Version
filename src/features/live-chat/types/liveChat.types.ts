export type ChatView = "home" | "messages" | "chat";

export type LiveChatMessageSender = "visitor" | "admin" | "system";

export type LiveChatConversationStatus = "open" | "pending" | "closed";

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
