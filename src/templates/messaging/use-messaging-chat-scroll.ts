'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

const SCROLL_PIN_THRESHOLD_PX = 80;

type UseMessagingChatScrollParams = Readonly<{
  conversationId: string;
  isMessagesReady: boolean;
  messageCount: number;
  scrollRef: RefObject<HTMLDivElement | null>;
}>;

function scrollToBottom(scrollElement: HTMLDivElement): void {
  scrollElement.scrollTop = scrollElement.scrollHeight;
}

/**
 * Scroll after layout has settled (images, bubbles, fonts).
 */
function scrollToBottomAfterLayout(scrollElement: HTMLDivElement): void {
  scrollToBottom(scrollElement);
  requestAnimationFrame(() => {
    scrollToBottom(scrollElement);
    requestAnimationFrame(() => scrollToBottom(scrollElement));
  });
}

/**
 * Pins the message list to the bottom when opening a thread or receiving new
 * messages at the end, while preserving scroll position when older pages load.
 */
export function useMessagingChatScroll({
  conversationId,
  isMessagesReady,
  messageCount,
  scrollRef,
}: UseMessagingChatScrollParams): void {
  const isPinnedToBottomRef = useRef(true);
  const previousConversationIdRef = useRef<string | null>(null);
  const previousMessageCountRef = useRef(0);
  const previousMessagesReadyRef = useRef(false);
  const previousScrollHeightRef = useRef(0);
  const hasScrolledToInitialBottomRef = useRef(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const distanceFromBottom =
        scrollElement.scrollHeight -
        scrollElement.scrollTop -
        scrollElement.clientHeight;
      isPinnedToBottomRef.current = distanceFromBottom < SCROLL_PIN_THRESHOLD_PX;
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const conversationChanged =
      previousConversationIdRef.current !== conversationId;
    const messageCountIncreased = messageCount > previousMessageCountRef.current;
    const messagesBecameReady =
      isMessagesReady && !previousMessagesReadyRef.current;
    const scrollHeightBefore = previousScrollHeightRef.current;
    const scrollTopBefore = scrollElement.scrollTop;

    previousConversationIdRef.current = conversationId;
    previousMessageCountRef.current = messageCount;
    previousMessagesReadyRef.current = isMessagesReady;

    if (conversationChanged) {
      isPinnedToBottomRef.current = true;
      hasScrolledToInitialBottomRef.current = false;
    }

    if (conversationChanged) {
      scrollToBottomAfterLayout(scrollElement);
      if (isMessagesReady) {
        hasScrolledToInitialBottomRef.current = true;
      }
    } else if (messagesBecameReady && !hasScrolledToInitialBottomRef.current) {
      scrollToBottomAfterLayout(scrollElement);
      hasScrolledToInitialBottomRef.current = true;
    } else if (messageCountIncreased) {
      const scrollHeightAfter = scrollElement.scrollHeight;
      const heightDelta = scrollHeightAfter - scrollHeightBefore;

      if (isPinnedToBottomRef.current) {
        scrollToBottomAfterLayout(scrollElement);
      } else if (heightDelta > 0 && scrollTopBefore < SCROLL_PIN_THRESHOLD_PX) {
        scrollElement.scrollTop = scrollTopBefore + heightDelta;
      }
    }

    previousScrollHeightRef.current = scrollElement.scrollHeight;
  }, [conversationId, isMessagesReady, messageCount, scrollRef]);
}
