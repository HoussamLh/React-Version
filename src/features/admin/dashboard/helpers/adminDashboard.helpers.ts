import type { AdminConversation } from "../../chat/types/adminChat.types";
import type { ContactSubmission } from "../../contacts/types/contactSubmissions.types";

export type AdminDashboardStats = {
  totalSubmissions: number;
  newSubmissions: number;
  totalConversations: number;
  openConversations: number;
  unreadMessages: number;
  offlineMessages: number;
};

export const getAdminDashboardStats = (
  submissions: ContactSubmission[],
  conversations: AdminConversation[],
): AdminDashboardStats => {
  const totalSubmissions = submissions.length;
  const newSubmissions = submissions.filter(
    (submission) => submission.status === "new",
  ).length;

  const totalConversations = conversations.length;
  const openConversations = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;

  const unreadMessages = conversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );

  const offlineMessages = conversations.filter(
    (conversation) => conversation.chatMode === "offline",
  ).length;

  return {
    totalSubmissions,
    newSubmissions,
    totalConversations,
    openConversations,
    unreadMessages,
    offlineMessages,
  };
};
