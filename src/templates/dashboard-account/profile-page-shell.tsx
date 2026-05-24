'use client';

import { forwardRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils';

export type DashboardProfilePageShellProps = Omit<
  ComponentProps<'div'>,
  'children'
> &
  Readonly<{
    children: ReactNode;
  }>;

/**
 * Outer layout for dashboard Profile routes: centered column with consistent padding.
 * Apps render their own inner width wrapper (for example `max-w-2xl`) and profile panel.
 */
export const DashboardProfilePageShell = forwardRef<
  HTMLDivElement,
  DashboardProfilePageShellProps
>(function DashboardProfilePageShell(
  { children, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center justify-center px-4 py-4 lg:py-10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
