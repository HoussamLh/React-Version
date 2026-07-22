import type { CustomerProjectMessage } from "./customerProjectMessages.types";

export const countUnreadMessages = (
  messages: CustomerProjectMessage[],
  viewerType: "customer" | "admin",
) => {
  return messages.filter(
    (message) => message.senderType !== viewerType && !message.readAt,
  ).length;
};
