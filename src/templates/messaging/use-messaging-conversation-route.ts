'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

/** Query param key for the active messaging conversation on messaging routes. */
export const MESSAGING_CONVERSATION_ID_SEARCH_PARAM = 'conversationId' as const;

/**
 * Syncs the active messaging conversation with the URL search param so selection
 * survives refresh and can be shared as a deep link.
 */
export function useMessagingConversationRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawConversationId = searchParams.get(
    MESSAGING_CONVERSATION_ID_SEARCH_PARAM,
  );
  const conversationIdFromRoute = rawConversationId?.trim()
    ? rawConversationId.trim()
    : null;

  const setConversationIdInRoute = useCallback(
    (conversationId: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          next.set(MESSAGING_CONVERSATION_ID_SEARCH_PARAM, conversationId);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearConversationIdInRoute = useCallback(() => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete(MESSAGING_CONVERSATION_ID_SEARCH_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return {
    conversationIdFromRoute,
    setConversationIdInRoute,
    clearConversationIdInRoute,
  };
}
