import type { AdminProjectMessage } from "./adminProjectMessages.service";

export const countUnreadCustomerMessages = (
  messages: AdminProjectMessage[],
): number => {
  return messages.filter(
    (message) => message.senderType === "customer" && !message.readAt,
  ).length;
};
