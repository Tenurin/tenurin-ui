'use client';

import { Users } from 'lucide-react';

import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';

export type MessagingChatConversationHeaderProps = Readonly<{
  title: string;
  subtitle: string;
  avatarFallback: string;
  onOpenParticipants?: () => void;
}>;

/**
 * Chat pane title row with optional participants entry for group conversations.
 */
export function MessagingChatConversationHeader({
  title,
  subtitle,
  avatarFallback,
  onOpenParticipants,
}: MessagingChatConversationHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 mx-4 py-4 md:mx-6 xl:mx-10">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {onOpenParticipants ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onOpenParticipants}
          aria-label="View participants"
        >
          <Users className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
