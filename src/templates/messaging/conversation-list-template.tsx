'use client';

import SearchInput from '../../components/ui/search-input';
import { messagingSubtleScrollbarClassName } from './scroll-styles';
import { Skeleton } from '../../components/ui/skeleton';
import { MessagingConversationItem } from '../../components/ui/messaging-conversation-item';
import type { MessagingConversationListItemData } from './types';

type MessagingConversationListTemplateProps<TConversation> = Readonly<{
  activeConversationId?: string;
  conversations: readonly MessagingConversationListItemData<TConversation>[];
  hasSearchQuery?: boolean;
  isError: boolean;
  isLoading: boolean;
  isScopeReady: boolean;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onSelectConversation: (conversation: TConversation) => void;
  searchInput: string;
}>;

function ConversationListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="rounded-sm border border-border/60 bg-background px-3 py-3"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-sm" />

            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <Skeleton className="h-4 w-[9.5rem] rounded-sm" />
              <Skeleton className="h-3 w-[7rem] rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessagingConversationListTemplate<TConversation>({
  activeConversationId,
  conversations,
  hasSearchQuery = false,
  isError,
  isLoading,
  isScopeReady,
  onSearchChange,
  onSearchClear,
  onSelectConversation,
  searchInput,
}: MessagingConversationListTemplateProps<TConversation>) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <SearchInput
        id="conversation-search"
        value={searchInput}
        onChange={(event) => onSearchChange(event.target.value)}
        onClear={onSearchClear}
        placeholder="Search conversations..."
        wrapperClassName="flex-shrink-0"
        inputClassName="h-10 rounded-sm border-input bg-background text-base text-[var(--foreground)] shadow-none"
        iconClassName="h-5 w-5"
      />

      <div
        className={`mt-4 flex-1 overflow-y-auto ${messagingSubtleScrollbarClassName}`}
      >
        {isLoading ? <ConversationListSkeleton /> : null}

        {isError ? (
          <div className="rounded-sm border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load conversations.
          </div>
        ) : null}

        {!isLoading && !isError && isScopeReady && conversations.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            {hasSearchQuery
              ? 'No conversations match your search.'
              : 'No conversations yet.'}
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <MessagingConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversationId === conversation.id}
                onSelect={(selectedConversation) =>
                  onSelectConversation(selectedConversation.value)
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type { MessagingConversationListTemplateProps };
