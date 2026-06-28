import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../collapsible';
import { cn } from '../../../../lib/utils';
import { profileApplicationEntrySurfaceClassName } from './entry-surface';

type ProfileApplicationEntryCollapsibleProps = Readonly<{
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  expandable?: boolean;
}>;

export function ProfileApplicationEntryCollapsible({
  trigger,
  children,
  defaultOpen = false,
  expandable = true,
}: ProfileApplicationEntryCollapsibleProps) {
  if (!expandable) {
    return (
      <div
        className={cn(
          profileApplicationEntrySurfaceClassName,
          'flex min-h-10 items-center px-3 py-2',
        )}
      >
        {trigger}
      </div>
    );
  }

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={cn(profileApplicationEntrySurfaceClassName, 'overflow-hidden')}
    >
      <CollapsibleTrigger
        className={cn(
          'flex min-h-10 w-full items-center justify-between gap-3 px-3 py-2 text-left',
          'hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <div className="min-w-0 flex-1">{trigger}</div>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border/60 px-3 py-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
