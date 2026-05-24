import type { LucideIcon } from 'lucide-react';
import type { MessagingConversationItemData } from '../../components/ui/messaging-conversation-item';

export type MessagingSummaryRow = Readonly<{
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  value: string;
}>;

export type MessagingContextSummaryData = Readonly<{
  sectionTitle: string;
  title: string;
  subtitle?: string;
  badgeLabel: string;
  badgeToneClassName?: string;
  alert?: string;
  rows: readonly MessagingSummaryRow[];
}>;

export type MessagingConversationListItemData<TValue = unknown> =
  MessagingConversationItemData<TValue>;
