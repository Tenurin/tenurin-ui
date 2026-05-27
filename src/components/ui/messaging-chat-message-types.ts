export type MessagingChatAttachment = Readonly<{
  attachmentId: string;
  fileName: string;
  fileKey?: string | null;
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

/** Resolves to a presigned URL to open, or void when the handler opens the file itself. */
export type MessagingChatOpenAttachmentHandler = (
  args: MessagingChatOpenAttachmentArgs,
) => Promise<string | void>;

export type MessagingChatSenderInfo = Readonly<{
  name?: string;
  email?: string;
}>;
