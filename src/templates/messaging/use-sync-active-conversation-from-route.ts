'use client';

import { useEffect, useRef } from 'react';

import type { MessagingConversationIdentifiable } from './types';

export type UseSyncActiveConversationFromRouteParams<
  TConversation extends MessagingConversationIdentifiable,
> = Readonly<{
  activeConversationId?: string;
  conversationIdFromRoute?: string | null;
  conversations: readonly TConversation[] | undefined;
  onSelectConversation: (conversation: TConversation) => void;
}>;

/**
 * Hydrates active conversation state from the URL when the list has loaded but
 * React state has not caught up yet (common on compact layouts after refresh).
 * Does not re-select while the route param is clearing after "Back to conversations".
 */
export function useSyncActiveConversationFromRoute<
  TConversation extends MessagingConversationIdentifiable,
>({
  activeConversationId,
  conversationIdFromRoute = null,
  conversations,
  onSelectConversation,
}: UseSyncActiveConversationFromRouteParams<TConversation>): void {
  const lastHydratedRouteConversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationIdFromRoute) {
      lastHydratedRouteConversationIdRef.current = null;
      return;
    }

    if (!conversations?.length) {
      return;
    }

    if (activeConversationId === conversationIdFromRoute) {
      lastHydratedRouteConversationIdRef.current = conversationIdFromRoute;
      return;
    }

    if (
      !activeConversationId &&
      lastHydratedRouteConversationIdRef.current === conversationIdFromRoute
    ) {
      return;
    }

    const matchedConversation = conversations.find(
      (conversation) =>
        conversation.conversationId === conversationIdFromRoute,
    );

    if (matchedConversation) {
      lastHydratedRouteConversationIdRef.current = conversationIdFromRoute;
      onSelectConversation(matchedConversation);
    }
  }, [
    activeConversationId,
    conversationIdFromRoute,
    conversations,
    onSelectConversation,
  ]);
}
