'use client';

import type { ReactNode } from 'react';
import { Loader2, Search } from 'lucide-react';

import { Input } from '../../components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/sheet';
import { messagingSubtleScrollbarClassName } from './scroll-styles';

export type MessagingParticipantsPanelTemplateProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantCount: number;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  isLoading: boolean;
  isError: boolean;
  showSearch?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}>;

/**
 * Sidebar-styled sheet shell for messaging group participant lists.
 */
export function MessagingParticipantsPanelTemplate({
  open,
  onOpenChange,
  participantCount,
  searchQuery,
  onSearchQueryChange,
  isLoading,
  isError,
  showSearch = true,
  actions,
  children,
}: MessagingParticipantsPanelTemplateProps) {
  const shouldShowSearch =
    showSearch && !isLoading && !isError && participantCount > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="flex flex-col gap-0 border-l border-sidebar-border bg-sidebar p-0 text-sidebar-foreground shadow-none sm:max-w-md dark:bg-sidebar"
      >
        <SheetHeader className="space-y-0 border-b border-sidebar-border px-4 py-4">
          <SheetTitle>Participants ({participantCount})</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4">
          {shouldShowSearch ? (
            <ParticipantsSearchField
              searchQuery={searchQuery}
              onSearchQueryChange={onSearchQueryChange}
            />
          ) : null}
          {actions ? (
            <div className="flex flex-col gap-3 pb-1 sm:flex-row sm:gap-3">
              {actions}
            </div>
          ) : null}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : null}
          {isError ? (
            <p className="py-4 text-sm text-destructive">
              Failed to load participants.
            </p>
          ) : null}
          {!isLoading && !isError ? (
            <div
              className={`min-h-0 flex-1 space-y-0.5 overflow-y-auto ${messagingSubtleScrollbarClassName}`}
            >
              {children}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ParticipantsSearchField({
  searchQuery,
  onSearchQueryChange,
}: Readonly<{
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}>) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        className="h-9 border-sidebar-border bg-background pl-8 shadow-none dark:bg-background"
        aria-label="Search participants"
      />
    </div>
  );
}
