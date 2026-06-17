import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

/** Fills the dashboard viewport below the fixed header when results are empty. */
export const resultsEmptyShellClassName =
  'flex min-h-[calc(100dvh-4rem)] flex-col';

export const resultsEmptyBodyClassName =
  'relative flex min-h-0 flex-1 flex-col';

export const resultsEmptyFilledShellClassName = 'pb-8';

export const resultsEmptyFilledBodyClassName = 'relative space-y-8';

/** Flex column for results + pagination when empty. */
export const resultsEmptyContentClassName =
  'flex min-h-0 flex-1 flex-col pb-8';

export const resultsEmptyFooterClassName = 'shrink-0';

/** Grows to fill remaining viewport and centers empty-state content. */
export const resultsEmptyStateClassName =
  'flex min-h-0 flex-1 flex-col items-center justify-center w-full';

/** Wrapper for list-table empty output inside a results page layout. */
export const resultsEmptyListClassName =
  'flex min-h-0 flex-1 flex-col w-full overflow-hidden';

type ResultsPageLayoutProps = Readonly<{
  isEmpty: boolean;
  filters: ReactNode;
  contentClassName?: string;
  children: ReactNode;
  footer?: ReactNode;
}>;

/**
 * Page shell for filterable list routes. When empty, fills the viewport without
 * scroll and keeps pagination pinned above bottom padding.
 */
export function ResultsPageLayout({
  isEmpty,
  filters,
  contentClassName,
  children,
  footer,
}: ResultsPageLayoutProps) {
  return (
    <div
      className={cn(
        isEmpty ? resultsEmptyShellClassName : resultsEmptyFilledShellClassName,
      )}
    >
      <div
        className={cn(
          isEmpty ? resultsEmptyBodyClassName : resultsEmptyFilledBodyClassName,
        )}
      >
        {filters}
        <div
          className={cn(
            contentClassName,
            isEmpty && resultsEmptyContentClassName,
          )}
        >
          {children}
          {footer ? (
            <div className={cn(isEmpty && resultsEmptyFooterClassName)}>
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
