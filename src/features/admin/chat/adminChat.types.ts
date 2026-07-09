export type AdminConversationStatus = "open" | "pending" | "closed";

export type AdminConversation = {
  id: string;
  visitorId: string;
  visitorEmail: string | null;
  visitorName: string | null;
  status: AdminConversationStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  lastMessageBody: string | null;
  adminLastReadAt: string | null;
  unreadCount: number;
};

export type AdminMessageSender = "visitor" | "admin" | "system";

export type AdminMessage = {
  id: string;
  conversationId: string;
  senderType: AdminMessageSender;
  body: string;
  createdAt: string;
};
