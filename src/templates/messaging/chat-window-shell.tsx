'use client';

import type { ReactNode, RefObject } from 'react';
import { ArrowLeft } from 'lucide-react';

import { cn } from '../../lib/utils';
import { messagingSubtleScrollbarClassName } from './scroll-styles';

export type MessagingChatWindowShellProps = Readonly<{
  scrollRef: RefObject<HTMLDivElement | null>;
  header: ReactNode;
  messageList: ReactNode;
  composer: ReactNode;
  onBack?: () => void;
  messageSearch?: ReactNode;
  className?: string;
}>;

export function MessagingChatWindowShell({
  scrollRef,
  header,
  messageList,
  composer,
  onBack,
  messageSearch,
  className,
}: MessagingChatWindowShellProps) {
  return (
    <div
      className={cn('mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col', className)}
    >
      {onBack ? (
        <div className="border-b border-border/60 px-4 py-3 xl:hidden">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="truncate">Back to conversations</span>
          </button>

          {messageSearch ? <div className="mt-3">{messageSearch}</div> : null}
        </div>
      ) : null}

      {header}

      <div
        ref={scrollRef}
        className={cn(
          'min-h-0 flex-1 overflow-y-auto',
          messagingSubtleScrollbarClassName,
        )}
      >
        <div className="mx-auto flex flex-col px-6 pb-8 pt-8 md:px-10 md:pt-10">
          {messageList}
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 md:px-10">
        <div className="mx-auto">{composer}</div>
      </div>
    </div>
  );
}

