import type { CustomerProjectMessage } from "./customerProjectMessages.types";
export const countUnreadMessages = (
  messages: CustomerProjectMessage[],
): number => {
  return messages.filter(
    (message) => message.senderType === "admin" && !message.readAt,
  ).length;
};
