import { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils';
import { MessagingMessageContent } from './messaging-message-content';
import type {
  MessagingChatMessage,
  MessagingChatOpenAttachmentArgs,
} from './messaging-chat-message-types';
import { toast } from './sonner';

export type MessagingChatMessageBubbleProps = Readonly<{
  message: MessagingChatMessage;
  isMine: boolean;
  senderName?: string;
  onOpenAttachment?: (args: MessagingChatOpenAttachmentArgs) => Promise<void>;
}>;

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
          ? 'ui-app-accent-inverse-surface'
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
  const bubbleLabel = isMine ? 'You' : senderLabel;

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 text-sm',
        isMine && 'items-end',
      )}
    >
      <span
        className={cn(
          'font-medium text-xs text-[var(--foreground)]',
          !isMine ? 'cursor-default' : 'hidden',
        )}
      >
        {bubbleLabel}
      </span>

      <div
        className={cn(
          'w-fit rounded-lg px-3 py-1 text-base md:max-w-4/5',
          isMine
            ? '!rounded-tr-none ui-app-accent-inverse-surface'
            : '!rounded-tl-none ui-app-accent-neutral-surface',
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

      <span className="text-[11px] font-medium text-muted-foreground">
        {format(new Date(message.createdAt), 'p')}
      </span>
    </div>
  );
}
