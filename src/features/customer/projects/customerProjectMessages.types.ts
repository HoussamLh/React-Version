export type ProjectMessageSenderType = "customer" | "admin";

export type CustomerProjectMessage = {
  id: string;

  projectRequestId: string;

  senderId: string;

  senderType: ProjectMessageSenderType;

  message: string;

  createdAt: string;
};
