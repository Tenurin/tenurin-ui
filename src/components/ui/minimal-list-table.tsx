'use client';

import { FileText } from 'lucide-react';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Skeleton } from './skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from './table';
import { getTableLoadingSkeletonClassName } from './table-loading';
import { useMinimalListTableColumnResizing } from './minimal-list-table-column-resizing';
import { MinimalListTableHeader } from './minimal-list-table-header';
import { renderTruncatedTableCellContent } from './table-cell-content';
import { TABLE_ACTIONS_COLUMN_ID } from './table-column-resizing';

export type MinimalListTableColumn<TItem> = Readonly<{
  key: string;
  header: string;
  widthClassName?: string;
  headClassName?: string;
  cellClassName?: string;
  loadingClassName?: string;
  minimumWidth?: number;
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
  actionsLoadingClassName?: string;
  resizableColumns?: boolean;
  minimumColumnWidth?: number;
}>;

const tableHeadClassName =
  'py-4 text-[11px] font-medium uppercase tracking-[0.24em]';
const tableBodyRowClassName = '[&>td]:py-3';
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
  actionsLoadingClassName,
  resizableColumns = true,
  minimumColumnWidth,
}: MinimalListTableProps<TItem>) {
  const showActionsColumn = renderActions !== undefined;
  const columnResizing = useMinimalListTableColumnResizing({
    actionsLabel,
    columns,
    minimumColumnWidth,
    resizableColumns,
    showActionsColumn,
  });
  const columnCount = columns.length + (showActionsColumn ? 1 : 0);
  const showTableHeader = isPending || isError || items.length > 0;
  const isEmptyState = !isPending && !isError && items.length === 0;
  const equalColumnWidth = `${100 / Math.max(columnCount, 1)}%`;
  const equalColumnWidthStyle = equalColumnWidths
    ? { width: equalColumnWidth }
    : undefined;

  return (
    <Table
      ref={columnResizing.handleTableRef}
      containerClassName={cn(
        columnResizing.isColumnResizingEnabled ? 'min-w-0' : undefined,
        columnResizing.isColumnResizing
          ? 'touch-none overflow-x-hidden'
          : columnResizing.needsHorizontalScroll
            ? 'overflow-x-auto'
            : columnResizing.isColumnResizingEnabled
              ? 'overflow-x-hidden'
              : 'overflow-x-auto',
      )}
      className={cn(
        tableClassName,
        isEmptyState ? 'min-w-0' : undefined,
        columnResizing.isColumnResizingEnabled
          ? cn(
              'table-fixed',
              columnResizing.needsHorizontalScroll
                ? 'w-max min-w-full'
                : 'w-full max-w-full min-w-0',
            )
          : columnResizing.isColumnWidthActive
            ? 'table-fixed'
            : undefined,
      )}
    >
      <colgroup>
        {columns.map((column) => (
          <col
            key={column.key}
            style={columnResizing.getColumnWidthStyle(
              column.key,
              equalColumnWidthStyle,
            )}
          />
        ))}
        {showActionsColumn ? (
          <col
            style={columnResizing.getColumnWidthStyle(
              TABLE_ACTIONS_COLUMN_ID,
              equalColumnWidthStyle,
            )}
          />
        ) : null}
      </colgroup>
      {showTableHeader ? (
        <MinimalListTableHeader
          actionsLabel={actionsLabel}
          columnResizing={columnResizing}
          columns={columns}
          equalColumnWidths={equalColumnWidths}
          mutedForegroundStyle={mutedForegroundStyle}
          showActionsColumn={showActionsColumn}
          tableHeadClassName={tableHeadClassName}
        />
      ) : null}
      <TableBody className="[&_tr]:border-b-0">
        {isPending
          ? Array.from({ length: pageSize }).map((_, index) => (
              <TableRow key={index} className={tableBodyRowClassName}>
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      'min-w-0',
                      columnIndex === 0 ? 'max-w-0 py-1' : 'py-1',
                      column.cellClassName,
                    )}
                  >
                    <Skeleton
                      className={getTableLoadingSkeletonClassName({
                        index: columnIndex,
                        className: column.loadingClassName,
                        isCentered:
                          column.cellClassName?.includes('text-center') ??
                          false,
                      })}
                    />
                  </TableCell>
                ))}
                {showActionsColumn ? (
                  <TableCell className={actionsCellClassName}>
                    <Skeleton
                      className={getTableLoadingSkeletonClassName({
                        index: columnCount - 1,
                        className: actionsLoadingClassName,
                        isActionsColumn: true,
                      })}
                    />
                  </TableCell>
                ) : null}
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
        {isEmptyState ? (
          <TableRow>
            <TableCell
              colSpan={columnCount}
              className="h-24 text-center whitespace-normal"
            >
              <div className="mx-auto flex max-w-full flex-col items-center justify-center gap-2 px-4 py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex max-w-full flex-col gap-1">
                  <p className="break-words font-medium">{emptyTitle}</p>
                  <p className="break-words text-sm text-muted-foreground">
                    {emptyDescription}
                  </p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ) : null}
        {isPending || isError || items.length === 0
          ? null
          : items.map((item) => (
              <TableRow
                key={getItemKey(item)}
                className={cn(tableBodyRowClassName, 'relative', rowClassName)}
              >
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      'min-w-0',
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
                    {renderTruncatedTableCellContent(
                      column.renderCell(item),
                      columnResizing.isColumnWidthActive,
                    )}
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
