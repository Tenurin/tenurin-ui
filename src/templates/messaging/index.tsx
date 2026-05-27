'use client';

export { messagingSubtleScrollbarClassName } from './scroll-styles';
export type {
  MessagingContextSummaryData,
  MessagingConversationListItemData,
  MessagingSummaryRow,
} from './types';
export { MessagingConversationListTemplate } from './conversation-list-template';
export type { MessagingConversationListTemplateProps } from './conversation-list-template';
export { MessagingSidebarTemplate } from './sidebar-template';
export type { MessagingSidebarTemplateProps } from './sidebar-template';
export { MessagingTemplate } from './template';
export type {
  MessagingTemplateProps,
  MessagingTemplateRenderChatArgs,
  MessagingTemplateRenderConversationListArgs,
} from './template';
export {
  MESSAGING_CONVERSATION_ID_SEARCH_PARAM,
  useMessagingConversationRoute,
} from './use-messaging-conversation-route';
export { useMessagingActiveConversation } from './use-messaging-active-conversation';
export type { MessagingActiveConversationScope } from './use-messaging-active-conversation';
export { useMessagingConversationSelectionEffects } from './use-messaging-conversation-selection-effects';
export { useMessagingChatScroll } from './use-messaging-chat-scroll';
export { useSyncActiveConversationFromRoute } from './use-sync-active-conversation-from-route';
export type { UseSyncActiveConversationFromRouteParams } from './use-sync-active-conversation-from-route';
export type { UseMessagingConversationSelectionEffectsParams } from './use-messaging-conversation-selection-effects';
export type { MessagingConversationIdentifiable } from './types';
export { MessagingChatConversationHeader } from './chat-conversation-header';
export type { MessagingChatConversationHeaderProps } from './chat-conversation-header';
export { MessagingParticipantsPanelTemplate } from './participants-panel-template';
export type { MessagingParticipantsPanelTemplateProps } from './participants-panel-template';
export { MessagingParticipantRow } from './participant-row';
export type { MessagingParticipantRowProps } from './participant-row';
export { MessagingChatWindowShell } from './chat-window-shell';
export type { MessagingChatWindowShellProps } from './chat-window-shell';
