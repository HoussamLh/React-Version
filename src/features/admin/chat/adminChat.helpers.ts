import type { AdminConversationStatus } from "./adminChat.types";

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
