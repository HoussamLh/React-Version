import type {
  AdminConversation,
  AdminConversationStatus,
} from "./adminChat.types";

export const getConversationStatusTone = (
  status: AdminConversationStatus,
): "success" | "info" | "muted" => {
  if (status === "open") {
    return "success";
  }

  if (status === "pending") {
    return "info";
  }

  return "muted";
};

export const getAdminConversationVisitorLabel = (
  conversation: AdminConversation,
) => {
  return (
    conversation.visitorName ??
    conversation.visitorEmail ??
    `Visitor ${conversation.visitorId.slice(0, 8)}`
  );
};

export const getAdminConversationSearchableText = (
  conversation: AdminConversation,
) => {
  return [
    conversation.visitorName,
    conversation.visitorEmail,
    conversation.visitorId,
    conversation.status,
    conversation.source,
    conversation.chatMode,
    conversation.lastMessageBody,
  ]
    .join(" ")
    .toLowerCase();
};
