'use client';

import type { ReactNode } from 'react';

import SearchInput from '../../components/ui/search-input';
import { SurfaceCard } from '../../components/ui/surface-card';
import { MessagingContextSummary } from './context-summary';
import { MessagingSectionHeading } from './section-heading';
import type { MessagingContextSummaryData } from './types';

export type MessagingSidebarTemplateProps = Readonly<{
  activeConversation: unknown | null;
  context: MessagingContextSummaryData;
  conversationListAction?: ReactNode;
  conversationList: ReactNode;
  messageSearchInput: string;
  onMessageSearchChange: (value: string) => void;
  showMessageSearch?: boolean;
}>;

export function MessagingSidebarTemplate({
  activeConversation,
  context,
  conversationListAction,
  conversationList,
  messageSearchInput,
  onMessageSearchChange,
  showMessageSearch = true,
}: MessagingSidebarTemplateProps) {
  return (
    <aside className="flex w-full min-w-0 flex-col gap-4 px-4 py-4 md:px-6 xl:max-w-[28rem] xl:shrink-0 xl:px-10">
      <SurfaceCard>
        {showMessageSearch ? (
          <SearchInput
            id="message-search"
            value={messageSearchInput}
            onChange={(event) => onMessageSearchChange(event.target.value)}
            onClear={() => onMessageSearchChange('')}
            placeholder="Search messages..."
            disabled={!activeConversation}
            inputClassName="h-10 rounded-sm border-input bg-background text-base text-[var(--foreground)] shadow-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            iconClassName="h-5 w-5"
          />
        ) : null}

        <MessagingContextSummary
          context={context}
          showTopDivider={showMessageSearch}
        />
      </SurfaceCard>

      <SurfaceCard className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <MessagingSectionHeading title="Conversations" />
          {conversationListAction}
        </div>
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          {conversationList}
        </div>
      </SurfaceCard>
    </aside>
  );
}
