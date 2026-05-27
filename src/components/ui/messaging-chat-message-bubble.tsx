import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import {
  MessagingChatAttachmentRow,
  messagingChatAttachmentContainerClassName,
} from './messaging-chat-attachment';
import { MessagingMessageContent } from './messaging-message-content';
import {
  closeTransientBrowsingContext,
  navigateToExternalUrl,
  openTransientBrowsingContext,
} from '../../lib/openExternalUrl';
import type {
  MessagingChatMessage,
  MessagingChatOpenAttachmentHandler,
} from './messaging-chat-message-types';
import type { MessagingChatMessageGroupPosition } from './messagingChatMessageGrouping';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { toast } from './sonner';

export type MessagingChatMessageBubbleProps = Readonly<{
  message: MessagingChatMessage;
  isMine: boolean;
  senderName?: string;
  senderEmail?: string;
  groupPosition?: MessagingChatMessageGroupPosition;
  showTimestamp?: boolean;
  showSenderLabel?: boolean;
  onOpenAttachment?: MessagingChatOpenAttachmentHandler;
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

function SenderLabel({
  label,
  email,
}: Readonly<{
  label: string;
  email?: string;
}>) {
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const labelClassName = 'text-[11px] font-medium text-[var(--foreground)]';

  if (!email) {
    return <span className={cn(labelClassName, 'mb-1')}>{label}</span>;
  }

  return (
    <div className="mb-1 flex flex-col items-start gap-0.5">
      <button
        type="button"
        className={cn(labelClassName, 'text-left md:hidden')}
        aria-expanded={isEmailVisible}
        aria-label={`${label}, tap to show email`}
        onClick={() => setIsEmailVisible((current) => !current)}
      >
        {label}
      </button>
      {isEmailVisible ? (
        <span className="text-[10px] text-muted-foreground md:hidden">
          {email}
        </span>
      ) : null}

      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(labelClassName, 'cursor-default')}>
              {label}
            </span>
          </TooltipTrigger>
          <TooltipContent className="text-xs">{email}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

/**
 * Renders a single chat message bubble with text, attachments, and timestamp.
 */
export function MessagingChatMessageBubble({
  message,
  isMine,
  senderName,
  senderEmail,
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
    const popup = openTransientBrowsingContext();

    try {
      const uri = await onOpenAttachment({
        conversationId: message.conversationId,
        messageId: message.messageId,
        attachmentId,
      });

      if (uri) {
        navigateToExternalUrl(uri, popup);
      } else {
        closeTransientBrowsingContext(popup);
      }
    } catch {
      closeTransientBrowsingContext(popup);
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
      <div
        className={cn(
          'flex max-w-4/5 flex-col',
          isMine ? 'items-end' : 'items-start',
        )}
      >
        {showSenderLabel ? (
          <SenderLabel label={senderLabel} email={senderEmail} />
        ) : null}

        <div
          className={cn(
            'w-fit max-w-full rounded-sm px-3 py-1 text-base',
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
          <div
            className={cn(
              messagingChatAttachmentContainerClassName,
              'flex flex-col gap-0.5',
              message.content && 'mt-2',
            )}
          >
            {message.attachments.map((attachment) => {
              const isPendingAttachment = !attachment.fileKey;
              const isOpening = openingAttachmentId === attachment.attachmentId;

              return (
                <MessagingChatAttachmentRow
                  key={attachment.attachmentId}
                  fileName={attachment.fileName}
                  disabled={!onOpenAttachment}
                  isOpening={isOpening}
                  isPending={isPendingAttachment}
                  onClick={
                    onOpenAttachment
                      ? () => handleAttachmentClick(attachment.attachmentId)
                      : undefined
                  }
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
    </div>
  );
}
