'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router';

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
import { getTableLoadingSkeletonClassName } from './table-loading';
import { ResizableTableHeaderContent } from './resizable-table-header-content';
import { renderTruncatedTableCellContent } from './table-cell-content';
import { buildHeaderMinimumWidths } from './table-header-width';
import {
  DEFAULT_MINIMUM_COLUMN_WIDTH,
  useTableColumnResizing,
} from './table-column-resizing';

export type ListTableColumn<TRow> = Readonly<{
  id: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  loadingClassName?: string;
  minimumWidth?: number;
  render: (row: TRow) => ReactNode;
}>;

type ListTableProps<TRow> = Readonly<{
  rows: readonly TRow[];
  columns: readonly ListTableColumn<TRow>[];
  isLoading: boolean;
  isError: boolean;
  getRowKey: (row: TRow) => string;
  loadingRowCount?: number;
  emptyState?: ReactNode;
  errorContent?: ReactNode;
  getRowHref?: (row: TRow) => string;
  getRowState?: (row: TRow) => unknown;
  getRowAriaLabel?: (row: TRow) => string;
  tableClassName?: string;
  surfaceClassName?: string;
  tableHeaderClassName?: string;
  tableBodyClassName?: string;
  tableHeadCellClassName?: string;
  tableCellClassName?: string;
  headerRowClassName?: string;
  bodyRowClassName?: string;
  resizableColumns?: boolean;
  minimumColumnWidth?: number;
}>;

export default function ListTable<TRow>({
  rows,
  columns,
  isLoading,
  isError,
  getRowKey,
  loadingRowCount = 5,
  emptyState = null,
  errorContent = 'Failed to load rows. Please try again.',
  getRowHref,
  getRowState,
  getRowAriaLabel = () => 'Open row',
  tableClassName,
  surfaceClassName,
  tableHeaderClassName,
  tableBodyClassName,
  tableHeadCellClassName,
  tableCellClassName,
  headerRowClassName,
  bodyRowClassName,
  resizableColumns = true,
  minimumColumnWidth,
}: ListTableProps<TRow>) {
  const effectiveMinimumColumnWidth =
    minimumColumnWidth ?? DEFAULT_MINIMUM_COLUMN_WIDTH;
  const columnMinimumWidths = useMemo(
    () =>
      buildHeaderMinimumWidths(
        columns.map((column) => ({
          header: column.header,
          id: column.id,
          minimumWidth: column.minimumWidth,
        })),
        effectiveMinimumColumnWidth,
      ),
    [columns, effectiveMinimumColumnWidth],
  );
  const columnResizing = useTableColumnResizing({
    columnIds: columns.map((column) => column.id),
    enabled: resizableColumns,
    minimumColumnWidths: columnMinimumWidths,
    minimumColumnWidth,
  });

  if (!isLoading && !isError && rows.length === 0) {
    return (
      <div className={cn('w-full overflow-hidden rounded-sm', surfaceClassName)}>
        {emptyState}
      </div>
    );
  }

  const columnCount = Math.max(columns.length, 1);
  const showTableHeader = isLoading || isError || rows.length > 0;

  return (
    <div className={cn('w-full max-w-full overflow-hidden rounded-sm', surfaceClassName)}>
      <Table
        className={cn(
          tableClassName,
          columnResizing.isColumnWidthActive ? 'table-fixed' : undefined,
        )}
      >
        <colgroup>
          {columns.map((column) => (
            <col
              key={column.id}
              style={columnResizing.getColumnWidthStyle(column.id)}
            />
          ))}
        </colgroup>
        {showTableHeader ? (
          <TableHeader className={cn('[&_tr]:border-b-0', tableHeaderClassName)}>
            <TableRow className={cn('border-b-0', headerRowClassName)}>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  data-resizable-column-id={column.id}
                  style={columnResizing.getColumnMinimumWidthStyle(column.id)}
                  className={cn(
                    'relative',
                    tableHeadCellClassName,
                    column.headerClassName,
                  )}
                >
                  <ResizableTableHeaderContent
                    columnId={column.id}
                    enabled={columnResizing.canResizeColumn(column.id)}
                    label={column.id}
                    onResizePointerDown={columnResizing.startColumnResize}
                    onResizeKeyDown={columnResizing.resizeColumnWithKeyboard}
                  >
                    {column.header}
                  </ResizableTableHeaderContent>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        ) : null}
        <TableBody className={cn('[&_tr]:border-b-0', tableBodyClassName)}>
          {isLoading
            ? Array.from({ length: loadingRowCount }).map((_, index) => (
                <TableRow key={index} className="border-b-0">
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      key={column.id}
                      className={cn(tableCellClassName, column.cellClassName)}
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
                </TableRow>
              ))
            : null}
          {isLoading || !isError ? null : (
            <TableRow className="border-b-0">
              <TableCell
                colSpan={columnCount}
                className="px-10 py-14 text-center text-sm text-destructive"
              >
                {errorContent}
              </TableCell>
            </TableRow>
          )}
          {isLoading || isError
            ? null
            : rows.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  className={cn('relative border-b-0', bodyRowClassName)}
                >
                  {columns.map((column, columnIndex) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        'min-w-0',
                        tableCellClassName,
                        column.cellClassName,
                      )}
                    >
                      {columnIndex === 0 && getRowHref ? (
                        <Link
                          to={getRowHref(row)}
                          state={getRowState?.(row)}
                          aria-label={getRowAriaLabel(row)}
                          className="absolute inset-0"
                        />
                      ) : null}
                      {renderTruncatedTableCellContent(
                        column.render(row),
                        columnResizing.isColumnWidthActive,
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
