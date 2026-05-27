'use client';

import type { ReactNode } from 'react';

import { MessagingChatMessageListSkeleton } from '../../components/ui/messaging-chat-skeleton';
import { MessagingEmptyState } from './empty-state';
import { MessagingLayoutShell } from './layout-shell';
import { MessagingSidebarTemplate } from './sidebar-template';
import { messagingSubtleScrollbarClassName } from './scroll-styles';
import type { MessagingContextSummaryData } from './types';
import { useIsMessagingCompact } from './use-is-messaging-compact';

export type MessagingTemplateRenderChatArgs<TConversation> = Readonly<{
  conversation: TConversation;
  isCompact: boolean;
  onBack?: () => void;
  showMessageSearch: boolean;
}>;

export type MessagingTemplateRenderConversationListArgs = Readonly<{
  enableAutoSelectFirst: boolean;
}>;

export type MessagingTemplateProps<TConversation> = Readonly<{
  activeConversation: TConversation | null;
  conversationIdFromRoute?: string | null;
  conversationListAction?: ReactNode;
  context: MessagingContextSummaryData;
  hasConversations: boolean;
  isConversationLoading: boolean;
  messageSearchInput: string;
  onMessageSearchChange: (value: string) => void;
  onSelectNoConversation?: () => void;
  renderChatWindow: (
    args: MessagingTemplateRenderChatArgs<TConversation>,
  ) => ReactNode;
  renderConversationList: (
    args: MessagingTemplateRenderConversationListArgs,
  ) => ReactNode;
}>;

function ChatMessageListLoader() {
  return (
    <div className="flex h-full w-full max-w-5xl min-h-0 flex-col mx-auto">
      <div
        className={`min-h-0 flex-1 overflow-y-auto ${messagingSubtleScrollbarClassName}`}
      >
        <div className="mx-auto flex flex-col px-6 pb-8 pt-8 md:px-10 md:pt-10">
          <MessagingChatMessageListSkeleton />
        </div>
      </div>
    </div>
  );
}

export function MessagingTemplate<TConversation>({
  activeConversation,
  conversationIdFromRoute = null,
  conversationListAction,
  context,
  hasConversations,
  isConversationLoading,
  messageSearchInput,
  onMessageSearchChange,
  onSelectNoConversation,
  renderChatWindow,
  renderConversationList,
}: MessagingTemplateProps<TConversation>) {
  const isMessagingCompact = useIsMessagingCompact();
  const isHydratingConversationFromRoute =
    Boolean(conversationIdFromRoute) && !activeConversation;
  const showChatPane =
    !isMessagingCompact ||
    Boolean(activeConversation) ||
    isHydratingConversationFromRoute;
  const showSidebarPane =
    !isMessagingCompact ||
    (!activeConversation && !isHydratingConversationFromRoute);
  const shouldShowConversationLoader =
    isConversationLoading ||
    isHydratingConversationFromRoute ||
    (!activeConversation && hasConversations && !conversationIdFromRoute);

  let chatPaneContent = <MessagingEmptyState />;

  if (activeConversation) {
    chatPaneContent = (
      <>
        {renderChatWindow({
          conversation: activeConversation,
          isCompact: isMessagingCompact,
          onBack: isMessagingCompact ? onSelectNoConversation : undefined,
          showMessageSearch: isMessagingCompact,
        })}
      </>
    );
  } else if (shouldShowConversationLoader) {
    chatPaneContent = <ChatMessageListLoader />;
  }

  return (
    <MessagingLayoutShell
      chatPane={chatPaneContent}
      showChatPane={showChatPane}
      showSidebarPane={showSidebarPane}
      sidebarPane={
        <MessagingSidebarTemplate
          activeConversation={activeConversation}
          conversationListAction={conversationListAction}
          context={context}
          conversationList={renderConversationList({
            enableAutoSelectFirst: !isMessagingCompact,
          })}
          messageSearchInput={messageSearchInput}
          onMessageSearchChange={onMessageSearchChange}
          showMessageSearch={!isMessagingCompact}
        />
      }
    />
  );
}
