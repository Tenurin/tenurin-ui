import { FileText } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Skeleton } from './skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export type MinimalListTableColumn<TItem> = Readonly<{
  key: string;
  header: string;
  widthClassName?: string;
  headClassName?: string;
  cellClassName?: string;
  renderCell: (item: TItem) => ReactNode;
}>;

type MinimalListTableProps<TItem> = Readonly<{
  isPending: boolean;
  isError: boolean;
  pageSize: number;
  items: readonly TItem[];
  columns: readonly MinimalListTableColumn<TItem>[];
  equalColumnWidths?: boolean;
  getItemKey: (item: TItem) => string;
  getRowHref?: (item: TItem) => string;
  getRowState?: (item: TItem) => unknown;
  emptyTitle?: string;
  emptyDescription?: string;
  errorMessage?: string;
  tableClassName?: string;
  rowClassName?: string;
  actionsLabel?: string;
  renderActions?: (item: TItem) => ReactNode;
  actionsCellClassName?: string;
}>;

const tableHeadClassName =
  'py-4 text-[11px] font-medium uppercase tracking-[0.24em]';
const mutedForegroundStyle = { color: 'var(--muted-foreground)' } as const;

export default function MinimalListTable<TItem>({
  isPending,
  isError,
  pageSize,
  items,
  columns,
  equalColumnWidths = false,
  getItemKey,
  getRowHref,
  getRowState,
  emptyTitle = 'No results found',
  emptyDescription = 'There are no items to display at the moment.',
  errorMessage = 'Failed to load items. Please try again.',
  tableClassName = 'mt-10 min-w-[30rem] w-full table-fixed',
  rowClassName = 'relative',
  actionsLabel = 'Actions',
  renderActions,
  actionsCellClassName = 'relative z-10 py-1',
}: MinimalListTableProps<TItem>) {
  const showActionsColumn = renderActions !== undefined;
  const columnCount = columns.length + (showActionsColumn ? 1 : 0);
  const showTableHeader = isPending || isError || items.length > 0;
  const equalColumnWidth = `${100 / Math.max(columnCount, 1)}%`;

  return (
    <Table
      className={tableClassName}
      containerClassName="overflow-x-auto"
    >
      {equalColumnWidths ? (
        <colgroup>
          {Array.from({ length: columnCount }).map((_, index) => (
            <col key={index} style={{ width: equalColumnWidth }} />
          ))}
        </colgroup>
      ) : null}
      {showTableHeader ? (
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  tableHeadClassName,
                  equalColumnWidths ? undefined : column.widthClassName,
                  column.headClassName,
                )}
                style={mutedForegroundStyle}
              >
                {column.header}
              </TableHead>
            ))}
            {showActionsColumn ? (
              <TableHead
                className={cn(tableHeadClassName, 'w-20')}
                style={mutedForegroundStyle}
              >
                {actionsLabel}
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
      ) : null}
      <TableBody className="[&_tr]:border-b-0">
        {isPending
          ? Array.from({ length: pageSize }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={columnCount}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          : null}
        {isPending || !isError ? null : (
          <TableRow>
            <TableCell
              colSpan={columnCount}
              className="text-center text-destructive"
            >
              {errorMessage}
            </TableCell>
          </TableRow>
        )}
        {isPending || isError || items.length !== 0 ? null : (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{emptyTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {emptyDescription}
                  </p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
        {isPending || isError || items.length === 0
          ? null
          : items.map((item) => (
              <TableRow
                key={getItemKey(item)}
                className={cn('relative', rowClassName)}
              >
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      columnIndex === 0 ? 'max-w-0 py-1' : 'py-1',
                      column.cellClassName,
                    )}
                  >
                    {columnIndex === 0 && getRowHref ? (
                      <Link
                        to={getRowHref(item)}
                        className="absolute inset-0"
                        state={getRowState?.(item)}
                      />
                    ) : null}
                    {column.renderCell(item)}
                  </TableCell>
                ))}
                {showActionsColumn ? (
                  <TableCell className={actionsCellClassName}>
                    {renderActions(item)}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
