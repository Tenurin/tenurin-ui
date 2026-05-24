import { format, isSameDay } from 'date-fns';

import { Button } from './button';
import { MessagingChatMessageBubble } from './messaging-chat-message-bubble';
import type {
  MessagingChatMessage,
  MessagingChatOpenAttachmentArgs,
  MessagingChatSenderInfo,
} from './messaging-chat-message-types';
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
  onOpenAttachment?: (args: MessagingChatOpenAttachmentArgs) => Promise<void>;
}>;

type ChatTimelineItem =
  | {
      kind: 'date';
      date: string;
    }
  | {
      kind: 'message';
      message: MessagingChatMessage;
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

    items.push({
      kind: 'message',
      message,
    });

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

      {timelineItems.map((item) =>
        item.kind === 'date' ? (
          <div
            key={item.date}
            className="flex items-center justify-center gap-5 py-2"
          >
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {format(new Date(item.date), 'EEEE, MMM d')}
            </p>
          </div>
        ) : (
          <MessagingChatMessageBubble
            key={item.message.messageId}
            message={item.message}
            isMine={item.message.senderId === currentUserId}
            senderName={senderInfoByUserId?.[item.message.senderId]?.name}
            onOpenAttachment={onOpenAttachment}
          />
        ),
      )}
    </div>
  );
}
