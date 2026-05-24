import type { LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

export type MessagingConversationItemData<TValue = unknown> = Readonly<{
  id: string;
  title: string;
  subtitle: string;
  value: TValue;
  unreadCount?: number;
  icon: LucideIcon;
  iconClassName?: string;
}>;

export type MessagingConversationItemProps<TValue = unknown> = Readonly<{
  conversation: MessagingConversationItemData<TValue>;
  isActive: boolean;
  onSelect: (conversation: MessagingConversationItemData<TValue>) => void;
}>;

export function MessagingConversationItem<TValue = unknown>({
  conversation,
  isActive,
  onSelect,
}: MessagingConversationItemProps<TValue>) {
  const ConversationIcon = conversation.icon;
  const unreadCount = conversation.unreadCount ?? 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={cn(
        'w-full rounded-sm px-3 py-3 text-left transition-colors',
        isActive
          ? 'border-sidebar-border bg-[var(--sidebar-accent)] text-sidebar-accent-foreground'
          : 'border-border/60 bg-background hover:bg-sidebar-accent',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-sidebar">
          <ConversationIcon
            className={cn('h-4 w-4', conversation.iconClassName)}
          />
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate text-sm font-medium',
              isActive
                ? 'text-sidebar-accent-foreground'
                : 'text-[var(--foreground)]',
            )}
          >
            {conversation.title}
          </p>
          <p
            className={cn(
              'mt-1 truncate text-xs',
              isActive
                ? 'text-sidebar-accent-foreground/70'
                : 'text-muted-foreground',
            )}
          >
            {conversation.subtitle}
          </p>
        </div>

        {unreadCount > 0 ? (
          <span className="inline-flex min-w-6 items-center justify-center rounded-sm border border-border/60 bg-background px-1.5 py-0.5 text-[11px] font-semibold text-[var(--foreground)]">
            {unreadCount}
          </span>
        ) : null}
      </div>
    </button>
  );
}
