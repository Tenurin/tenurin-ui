import { Pencil, Users } from 'lucide-react';

import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';

export type MessagingChatConversationHeaderProps = Readonly<{
  title: string;
  subtitle: string;
  avatarFallback: string;
  onOpenParticipants?: () => void;
  onRename?: () => void;
}>;

/**
 * Chat pane title row with optional rename and participants entry for groups.
 */
export function MessagingChatConversationHeader({
  title,
  subtitle,
  avatarFallback,
  onOpenParticipants,
  onRename,
}: MessagingChatConversationHeaderProps) {
  return (
    <div className="mx-4 flex shrink-0 items-center justify-between gap-3 border-b border-border/60 py-4 md:mx-6 xl:mx-10">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-0.5">
            <h2 className="truncate text-base font-medium">{title}</h2>
            {onRename ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-[var(--foreground)]"
                onClick={onRename}
                aria-label="Rename group"
              >
                <Pencil className="h-2.5 w-2.5" />
              </Button>
            ) : null}
          </div>
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
