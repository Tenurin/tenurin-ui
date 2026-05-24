import { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils';
import { MessagingMessageContent } from './messaging-message-content';
import type {
  MessagingChatMessage,
  MessagingChatOpenAttachmentArgs,
} from './messaging-chat-message-types';
import type { MessagingChatMessageGroupPosition } from './messagingChatMessageGrouping';
import { toast } from './sonner';

export type MessagingChatMessageBubbleProps = Readonly<{
  message: MessagingChatMessage;
  isMine: boolean;
  senderName?: string;
  groupPosition?: MessagingChatMessageGroupPosition;
  showTimestamp?: boolean;
  showSenderLabel?: boolean;
  onOpenAttachment?: (args: MessagingChatOpenAttachmentArgs) => Promise<void>;
}>;

function getBubbleCornerClassName(
  isMine: boolean,
  groupPosition: MessagingChatMessageGroupPosition,
): string {
  if (isMine) {
    if (groupPosition === 'single' || groupPosition === 'first') {
      return '!rounded-tr-none';
    }

    return 'rounded-sm';
  }

  if (groupPosition === 'single' || groupPosition === 'first') {
    return '!rounded-tl-none';
  }

  return 'rounded-sm';
}

function AttachmentButton({
  disabled,
  isMine,
  isOpening,
  onClick,
  name,
}: Readonly<{
  disabled: boolean;
  isMine: boolean;
  isOpening: boolean;
  onClick: () => void;
  name: string;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors',
        isMine
          ? 'ui-app-accent-own-surface'
          : 'ui-app-accent-neutral-surface',
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-[var(--foreground)]">
        {isOpening ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
      </span>
      <span className="truncate font-medium">
        {name}
        {disabled && !isOpening ? ' (uploading...)' : ''}
      </span>
    </button>
  );
}

/**
 * Renders a single chat message bubble with text, attachments, and timestamp.
 */
export function MessagingChatMessageBubble({
  message,
  isMine,
  senderName,
  groupPosition = 'single',
  showTimestamp = true,
  showSenderLabel = !isMine,
  onOpenAttachment,
}: MessagingChatMessageBubbleProps) {
  const [openingAttachmentId, setOpeningAttachmentId] = useState<string | null>(
    null,
  );

  const handleAttachmentClick = async (attachmentId: string) => {
    if (!onOpenAttachment) {
      return;
    }

    setOpeningAttachmentId(attachmentId);

    try {
      await onOpenAttachment({
        conversationId: message.conversationId,
        messageId: message.messageId,
        attachmentId,
      });
    } catch {
      toast.error('Unable to open the attachment right now.');
    } finally {
      setOpeningAttachmentId(null);
    }
  };

  const senderLabel = senderName || message.senderType.toUpperCase();

  return (
    <div
      className={cn(
        'flex w-full flex-col text-sm',
        isMine ? 'items-end' : 'items-start',
      )}
    >
      {showSenderLabel ? (
        <span className="mb-1 text-[11px] font-medium text-[var(--foreground)]">
          {senderLabel}
        </span>
      ) : null}

      <div
        className={cn(
          'w-fit rounded-sm px-3 py-1 text-base md:max-w-4/5',
          getBubbleCornerClassName(isMine, groupPosition),
          isMine
            ? 'ui-app-accent-own-surface'
            : 'ui-app-accent-neutral-surface',
        )}
      >
        {message.content ? (
          <MessagingMessageContent content={message.content} />
        ) : null}

        {message.attachments?.length ? (
          <div className={cn('space-y-3', message.content && 'mt-4')}>
            {message.attachments.map((attachment) => {
              const isPendingAttachment = !attachment.fileKey;
              const isOpening = openingAttachmentId === attachment.attachmentId;

              return (
                <AttachmentButton
                  key={attachment.attachmentId}
                  disabled={isPendingAttachment || isOpening || !onOpenAttachment}
                  isMine={isMine}
                  isOpening={isOpening}
                  onClick={() => handleAttachmentClick(attachment.attachmentId)}
                  name={attachment.fileName}
                />
              );
            })}
          </div>
        ) : null}
      </div>

      {showTimestamp ? (
        <span className="mt-1 text-[11px] font-medium text-muted-foreground">
          {format(new Date(message.createdAt), 'p')}
        </span>
      ) : null}
    </div>
  );
}
