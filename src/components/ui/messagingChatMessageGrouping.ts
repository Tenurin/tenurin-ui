import { format } from 'date-fns';

import type { MessagingChatMessage } from './messaging-chat-message-types';

export type MessagingChatMessageGroupPosition =
  | 'single'
  | 'first'
  | 'middle'
  | 'last';

/**
 * Builds a minute-level key used to group consecutive messages from the same sender.
 */
export function getMessageMinuteKey(createdAt: string): string {
  return format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
}

/**
 * Returns whether two messages can share the same visual stack group.
 */
export function areMessagesInSameGroup(
  previous: MessagingChatMessage,
  next: MessagingChatMessage,
): boolean {
  return (
    previous.senderId === next.senderId &&
    getMessageMinuteKey(previous.createdAt) ===
      getMessageMinuteKey(next.createdAt)
  );
}

/**
 * Resolves a message's position within its minute/sender group.
 */
export function getMessageGroupPosition(
  groupMessages: readonly MessagingChatMessage[],
  index: number,
): MessagingChatMessageGroupPosition {
  const inGroupWithPrevious =
    index > 0 &&
    areMessagesInSameGroup(groupMessages[index - 1], groupMessages[index]);
  const inGroupWithNext =
    index < groupMessages.length - 1 &&
    areMessagesInSameGroup(groupMessages[index], groupMessages[index + 1]);

  if (inGroupWithPrevious && inGroupWithNext) {
    return 'middle';
  }

  if (inGroupWithPrevious) {
    return 'last';
  }

  if (inGroupWithNext) {
    return 'first';
  }

  return 'single';
}

/**
 * Returns whether a message should render its timestamp (last bubble in a group).
 */
export function shouldShowMessageTimestamp(
  groupMessages: readonly MessagingChatMessage[],
  index: number,
): boolean {
  const groupPosition = getMessageGroupPosition(groupMessages, index);
  return groupPosition === 'single' || groupPosition === 'last';
}

/**
 * Returns whether an incoming message should render its sender label.
 */
export function shouldShowSenderLabel(
  groupMessages: readonly MessagingChatMessage[],
  index: number,
  isMine: boolean,
): boolean {
  if (isMine) {
    return false;
  }

  const groupPosition = getMessageGroupPosition(groupMessages, index);
  return groupPosition === 'single' || groupPosition === 'first';
}
