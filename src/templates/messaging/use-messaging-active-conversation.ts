'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { MessagingConversationIdentifiable } from './types';
import { useMessagingConversationRoute } from './use-messaging-conversation-route';

export type MessagingActiveConversationScope = Readonly<{
  scope: string;
  listingId?: string;
  batchId?: string;
}>;

/**
 * Keeps the active messaging conversation in React state and syncs it with the
 * URL. Clears both when batch/listing scope changes.
 */
export function useMessagingActiveConversation<
  TConversation extends MessagingConversationIdentifiable,
>({ scope, listingId, batchId }: MessagingActiveConversationScope) {
  const {
    conversationIdFromRoute,
    setConversationIdInRoute,
    clearConversationIdInRoute,
  } = useMessagingConversationRoute();
  const [activeConversation, setActiveConversation] =
    useState<TConversation | null>(null);

  const handleSelectConversation = useCallback(
    (conversation: TConversation) => {
      setActiveConversation((current) => {
        if (current?.conversationId === conversation.conversationId) {
          return current;
        }

        return conversation;
      });
      setConversationIdInRoute(conversation.conversationId);
    },
    [setConversationIdInRoute],
  );

  const clearActiveConversation = useCallback(() => {
    setActiveConversation(null);
  }, []);

  const clearActiveConversationAndRoute = useCallback(() => {
    clearActiveConversation();
    clearConversationIdInRoute();
  }, [clearActiveConversation, clearConversationIdInRoute]);

  useEffect(() => {
    if (conversationIdFromRoute || !activeConversation) {
      return;
    }

    clearActiveConversation();
  }, [activeConversation, clearActiveConversation, conversationIdFromRoute]);

  const messagingScopeKey = `${scope}:${listingId ?? ''}:${batchId ?? ''}`;
  const previousMessagingScopeKeyRef = useRef(messagingScopeKey);

  useLayoutEffect(() => {
    if (previousMessagingScopeKeyRef.current === messagingScopeKey) {
      return;
    }

    previousMessagingScopeKeyRef.current = messagingScopeKey;
    clearActiveConversationAndRoute();
  }, [clearActiveConversationAndRoute, messagingScopeKey]);

  return {
    activeConversation,
    setActiveConversation,
    activeConversationId: activeConversation?.conversationId,
    conversationIdFromRoute,
    handleSelectConversation,
    clearActiveConversation,
    clearActiveConversationAndRoute,
    clearConversationIdInRoute,
  };
}
