import type { Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

type ResultsPaginationProps = Readonly<{
  isFetching: boolean;
  pageNumber: number;
  pageSize: number;
  summary: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  pageSizeOptions: readonly number[];
  setPageNumber: Dispatch<SetStateAction<number>>;
  setPageSize: (value: number) => void;
}>;

export default function ResultsPagination({
  isFetching,
  pageNumber,
  pageSize,
  summary,
  canGoPrevious,
  canGoNext,
  pageSizeOptions,
  setPageNumber,
  setPageSize,
}: ResultsPaginationProps) {
  const shouldShowPageSizeSelector = pageSizeOptions.length > 0;

  return (
    <div className="flex w-full flex-col items-start gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.24em]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {summary}
        </p>
        {shouldShowPageSizeSelector ? (
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-16 rounded-sm border-border/60 bg-transparent px-2.5 text-sm shadow-none transition-colors hover:border-border focus-visible:border-neutral-200 focus-visible:ring-0 dark:focus-visible:border-neutral-800 [&_svg]:size-3.5 [&_svg]:opacity-60">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent className="min-w-16">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <Button
          variant="ghost"
          className="size-9 rounded-sm"
          onClick={() => setPageNumber((current) => Math.max(current - 1, 1))}
          disabled={!canGoPrevious || isFetching}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-xs font-medium">Page {pageNumber}</span>
        <Button
          variant="ghost"
          className="size-9 rounded-sm"
          onClick={() => setPageNumber((current) => current + 1)}
          disabled={!canGoNext || isFetching}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
