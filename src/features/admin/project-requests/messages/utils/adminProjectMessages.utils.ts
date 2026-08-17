import type { AdminProjectMessage } from "../services/adminProjectMessages.service";

export const countUnreadCustomerMessages = (
  messages: AdminProjectMessage[],
): number => {
  return messages.filter(
    (message) => message.senderType === "customer" && !message.readAt,
  ).length;
};
