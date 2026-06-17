'use client';

import { FileText } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router';

import { cn } from '../../lib/utils';
import {
  resultsEmptyListClassName,
  resultsEmptyStateClassName,
} from './results-empty-layout';
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
import { shouldIgnoreTableRowNavigation } from './table-row-navigation';

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
  getRowHref?: (item: TItem) => string | undefined;
  getRowState?: (item: TItem) => unknown;
  getRowAriaLabel?: (item: TItem) => string;
  /** Called on row activate when `getRowHref` is absent or returns undefined. */
  onRowClick?: (item: TItem) => void;
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
  getRowAriaLabel = () => 'Open row',
  onRowClick,
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
  const navigate = useNavigate();
  const isRowActivatable = getRowHref !== undefined || onRowClick !== undefined;

  const activateRow = useCallback(
    (item: TItem) => {
      const href = getRowHref?.(item);
      if (href) {
        navigate(href, { state: getRowState?.(item) });
        return;
      }

      onRowClick?.(item);
    },
    [getRowHref, getRowState, navigate, onRowClick],
  );

  const handleRowActivate = useCallback(
    (item: TItem, event: MouseEvent<HTMLTableRowElement>) => {
      if (shouldIgnoreTableRowNavigation(event)) {
        return;
      }

      activateRow(item);
    },
    [activateRow],
  );

  const handleRowKeyDown = useCallback(
    (item: TItem, event: KeyboardEvent<HTMLTableRowElement>) => {
      if (!isRowActivatable || shouldIgnoreTableRowNavigation(event)) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateRow(item);
      }
    },
    [activateRow, isRowActivatable],
  );

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

  /**
   * Empty state is rendered outside the table so it centers in the viewport.
   * Inside `table-fixed` + `<colgroup>`, mobile WebKit can mis-layout a
   * colspan cell (wide min-width columns, no header row), so `mx-auto` in a
   * single cell does not match “centered on screen” like the Timeline tab.
   */
  if (isEmptyState) {
    return (
      <div className={resultsEmptyListClassName}>
        <div className={cn(resultsEmptyStateClassName, 'gap-2 px-4 text-center')}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex w-full max-w-full flex-col gap-1 text-center">
            <p className="break-words font-medium">{emptyTitle}</p>
            <p
              className="break-words text-sm text-muted-foreground"
              style={mutedForegroundStyle}
            >
              {emptyDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full overflow-x-hidden px-4 py-8 text-center text-sm text-destructive">
        {errorMessage}
      </div>
    );
  }

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
        {isPending || isError || items.length === 0
          ? null
          : items.map((item) => {
              const rowHref = getRowHref?.(item);

              return (
                <TableRow
                  key={getItemKey(item)}
                  className={cn(
                    tableBodyRowClassName,
                    isRowActivatable && 'cursor-pointer',
                    rowClassName,
                  )}
                  tabIndex={isRowActivatable ? 0 : undefined}
                  onClick={(event) => handleRowActivate(item, event)}
                  onKeyDown={(event) => handleRowKeyDown(item, event)}
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
                      {columnIndex === 0 && rowHref ? (
                        <Link
                          to={rowHref}
                          state={getRowState?.(item)}
                          aria-label={getRowAriaLabel(item)}
                          tabIndex={-1}
                          className="sr-only"
                        />
                      ) : null}
                      {renderTruncatedTableCellContent(
                        column.renderCell(item),
                        columnResizing.isColumnWidthActive,
                      )}
                    </TableCell>
                  ))}
                  {showActionsColumn ? (
                    <TableCell className={actionsCellClassName} data-row-action>
                      {renderActions(item)}
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
      </TableBody>
    </Table>
  );
}
