'use client';

import { useEffect, useRef } from 'react';

import type { MessagingConversationIdentifiable } from './types';

export type UseMessagingConversationSelectionEffectsParams<
  TConversation extends MessagingConversationIdentifiable,
> = Readonly<{
  activeConversationId?: string;
  preferredConversationId?: string | null;
  conversations: readonly TConversation[] | undefined;
  isLoading: boolean;
  enableAutoSelectFirst?: boolean;
  onSelectConversation: (conversation: TConversation) => void;
  onClearPreferredConversationId?: () => void;
}>;

/**
 * Restores the active conversation from the URL and falls back to the first
 * thread on desktop when no param is set. Does not override a user click while
 * the URL param is still catching up.
 */
export function useMessagingConversationSelectionEffects<
  TConversation extends MessagingConversationIdentifiable,
>({
  activeConversationId,
  preferredConversationId = null,
  conversations,
  isLoading,
  enableAutoSelectFirst = true,
  onSelectConversation,
  onClearPreferredConversationId,
}: UseMessagingConversationSelectionEffectsParams<TConversation>): void {
  const previousPreferredConversationIdRef = useRef(preferredConversationId);

  useEffect(() => {
    const preferredConversationIdChanged =
      previousPreferredConversationIdRef.current !== preferredConversationId;
    previousPreferredConversationIdRef.current = preferredConversationId;

    if (!preferredConversationId || !conversations?.length) {
      return;
    }

    const preferredConversation = conversations.find(
      (conversation) =>
        conversation.conversationId === preferredConversationId,
    );

    if (!preferredConversation) {
      if (!isLoading) {
        onClearPreferredConversationId?.();
      }
      return;
    }

    if (!activeConversationId) {
      onSelectConversation(preferredConversation);
      return;
    }

    if (activeConversationId === preferredConversation.conversationId) {
      return;
    }

    if (
      preferredConversationIdChanged &&
      activeConversationId !== preferredConversationId
    ) {
      onSelectConversation(preferredConversation);
    }
  }, [
    activeConversationId,
    conversations,
    isLoading,
    onClearPreferredConversationId,
    onSelectConversation,
    preferredConversationId,
  ]);

  useEffect(() => {
    if (!enableAutoSelectFirst) {
      return;
    }

    if (preferredConversationId) {
      if (isLoading || !conversations) {
        return;
      }

      const hasPreferredConversation = conversations.some(
        (conversation) =>
          conversation.conversationId === preferredConversationId,
      );

      if (hasPreferredConversation) {
        return;
      }
    }

    const hasActiveConversationInScope = conversations?.some(
      (conversation) => conversation.conversationId === activeConversationId,
    );

    const fallbackConversation = conversations?.[0];

    if (
      fallbackConversation &&
      (!activeConversationId || !hasActiveConversationInScope) &&
      activeConversationId !== fallbackConversation.conversationId
    ) {
      onSelectConversation(fallbackConversation);
    }
  }, [
    activeConversationId,
    conversations,
    enableAutoSelectFirst,
    isLoading,
    onSelectConversation,
    preferredConversationId,
  ]);
}
