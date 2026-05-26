'use client';

import type { ReactElement, ReactNode } from 'react';

import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export type ResponsiveHintProps = Readonly<{
  align?: 'center' | 'end' | 'start';
  children: ReactElement;
  content: ReactNode;
  contentClassName?: string;
  side?: 'bottom' | 'left' | 'right' | 'top';
  sideOffset?: number;
  /**
   * When false, the hint is desktop-only (hover tooltip). Use when the trigger
   * already performs a primary tap action such as copy or navigation.
   */
  showPopoverOnMobile?: boolean;
}>;

/**
 * Shows supplementary copy on hover (desktop) or tap (viewport under `lg` / 1024px).
 */
export function ResponsiveHint({
  align = 'center',
  children,
  content,
  contentClassName,
  side = 'top',
  sideOffset,
  showPopoverOnMobile = true,
}: ResponsiveHintProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    if (!showPopoverOnMobile) {
      return children;
    }

    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          align={align}
          side={side}
          sideOffset={sideOffset}
          className={cn('max-w-xs text-sm leading-relaxed', contentClassName)}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
