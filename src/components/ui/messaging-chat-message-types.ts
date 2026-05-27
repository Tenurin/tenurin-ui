export type MessagingChatAttachment = Readonly<{
  attachmentId: string;
  fileName: string;
  blobId?: string | null;
}>;

export type MessagingChatMessage = Readonly<{
  messageId: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  content: string | null;
  createdAt: string;
  attachments?: MessagingChatAttachment[];
}>;

export type MessagingChatOpenAttachmentArgs = Readonly<{
  conversationId: string;
  messageId: string;
  attachmentId: string;
}>;

export type MessagingChatSenderInfo = Readonly<{
  name?: string;
  email?: string;
}>;
