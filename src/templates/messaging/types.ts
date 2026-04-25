import type { LucideIcon } from 'lucide-react';

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

export type MessagingConversationListItemData = Readonly<{
  title: string;
  subtitle: string;
  unreadCount?: number;
  icon: LucideIcon;
  iconClassName?: string;
}>;
