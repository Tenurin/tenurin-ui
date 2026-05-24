import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type MessagingLayoutShellProps = Readonly<{
  chatPane: ReactNode;
  sidebarPane?: ReactNode;
  showChatPane?: boolean;
  showSidebarPane?: boolean;
  className?: string;
  chatPaneClassName?: string;
}>;

export function MessagingLayoutShell({
  chatPane,
  sidebarPane,
  showChatPane = true,
  showSidebarPane = true,
  className,
  chatPaneClassName,
}: MessagingLayoutShellProps) {
  return (
    <div
      data-messaging-surface
      className={cn('flex h-full min-h-0 w-full', className)}
    >
      <div
        className={cn(
          'relative min-h-0 min-w-0 flex-1 flex-col',
          showChatPane ? 'flex' : 'hidden',
          chatPaneClassName,
        )}
      >
        {chatPane}
      </div>
      {showSidebarPane ? sidebarPane : null}
    </div>
  );
}
