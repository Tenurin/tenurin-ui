import { format, isSameDay } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { MessagingChatMessageBubble } from './messaging-chat-message-bubble';
import type {
  MessagingChatMessage,
  MessagingChatOpenAttachmentHandler,
  MessagingChatSenderInfo,
} from './messaging-chat-message-types';
import {
  areMessagesInSameGroup,
  getMessageGroupPosition,
  shouldShowMessageTimestamp,
  shouldShowSenderLabel,
} from './messagingChatMessageGrouping';
import { MessagingChatMessageListSkeleton } from './messaging-chat-skeleton';

export type MessagingChatMessageListProps = Readonly<{
  messages: MessagingChatMessage[];
  currentUserId?: string;
  senderInfoByUserId?: Record<string, MessagingChatSenderInfo>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  isSearchActive: boolean;
  onOpenAttachment?: MessagingChatOpenAttachmentHandler;
}>;

type ChatTimelineItem =
  | {
      kind: 'date';
      date: string;
    }
  | {
      kind: 'messageGroup';
      messages: MessagingChatMessage[];
    };

function buildTimeline(messages: MessagingChatMessage[]): ChatTimelineItem[] {
  return messages.reduce<ChatTimelineItem[]>((items, message, index) => {
    const previousMessage = messages[index - 1];

    if (
      !previousMessage ||
      !isSameDay(
        new Date(previousMessage.createdAt),
        new Date(message.createdAt),
      )
    ) {
      items.push({
        kind: 'date',
        date: message.createdAt,
      });
    }

    const lastItem = items.at(-1);
    const lastGroupMessage =
      lastItem?.kind === 'messageGroup'
        ? lastItem.messages.at(-1)
        : undefined;

    if (
      lastItem?.kind === 'messageGroup' &&
      lastGroupMessage &&
      areMessagesInSameGroup(lastGroupMessage, message)
    ) {
      items[items.length - 1] = {
        kind: 'messageGroup',
        messages: [...lastItem.messages, message],
      };
    } else {
      items.push({
        kind: 'messageGroup',
        messages: [message],
      });
    }

    return items;
  }, []);
}

/**
 * Renders a scrollable chat message timeline with date dividers and pagination.
 */
export function MessagingChatMessageList({
  messages,
  currentUserId,
  senderInfoByUserId,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  isLoading,
  isSearchActive,
  onOpenAttachment,
}: MessagingChatMessageListProps) {
  if (isLoading) {
    return <MessagingChatMessageListSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
        {isSearchActive
          ? 'No messages match your search.'
          : 'No messages yet. Say hello!'}
      </div>
    );
  }

  const filteredMessages = messages.filter((message) => message?.senderId);
  const timelineItems = buildTimeline(filteredMessages);

  return (
    <div className="space-y-4">
      {hasNextPage ? (
        <div className="flex justify-center pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="rounded-sm border-input !bg-background px-5 text-sm font-medium text-[var(--foreground)] hover:!bg-accent hover:!text-accent-foreground"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load older messages'}
          </Button>
        </div>
      ) : null}

      {timelineItems.map((item) => {
        if (item.kind === 'date') {
          return (
            <div
              key={item.date}
              className="flex items-center justify-center gap-5 py-2"
            >
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                {format(new Date(item.date), 'EEEE, MMM d')}
              </p>
            </div>
          );
        }

        const isMine = item.messages[0].senderId === currentUserId;

        return (
          <div
            key={item.messages.map((message) => message.messageId).join('-')}
            className={cn(
              'flex w-full flex-col gap-1 text-sm',
              isMine ? 'items-end' : 'items-start',
            )}
          >
            {item.messages.map((message, index) => (
              <MessagingChatMessageBubble
                key={message.messageId}
                message={message}
                isMine={message.senderId === currentUserId}
                senderName={senderInfoByUserId?.[message.senderId]?.name}
                senderEmail={senderInfoByUserId?.[message.senderId]?.email}
                groupPosition={getMessageGroupPosition(item.messages, index)}
                showTimestamp={shouldShowMessageTimestamp(item.messages, index)}
                showSenderLabel={shouldShowSenderLabel(
                  item.messages,
                  index,
                  message.senderId === currentUserId,
                )}
                onOpenAttachment={onOpenAttachment}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
