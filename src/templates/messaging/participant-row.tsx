'use client';

import { X } from 'lucide-react';

import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';

export type MessagingParticipantRowProps = Readonly<{
  name: string;
  email?: string;
  avatarFallback: string;
  isOwner?: boolean;
  isCurrentUser?: boolean;
  onRemove?: () => void;
  isRemoving?: boolean;
}>;

/**
 * Single participant row for messaging group participant panels.
 */
export function MessagingParticipantRow({
  name,
  email,
  avatarFallback,
  isOwner = false,
  isCurrentUser = false,
  onRemove,
  isRemoving = false,
}: MessagingParticipantRowProps) {
  const showRemoveButton = onRemove != null && !isCurrentUser;

  return (
    <div className="flex items-center justify-between gap-2 rounded-md px-2 py-2 hover:bg-sidebar-accent">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {name}
            {isOwner ? (
              <span className="ml-1 font-normal text-muted-foreground">
                (owner)
              </span>
            ) : null}
            {isCurrentUser ? (
              <span className="ml-1 font-normal text-muted-foreground">
                (you)
              </span>
            ) : null}
          </p>
          {email ? (
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          ) : null}
        </div>
      </div>
      {showRemoveButton ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
          disabled={isRemoving}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
