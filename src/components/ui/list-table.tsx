import type { ReactNode } from 'react';
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

export type ListTableColumn<TRow> = Readonly<{
  id: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  loadingClassName?: string;
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
}: ListTableProps<TRow>) {
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
      <Table className={tableClassName}>
        {showTableHeader ? (
          <TableHeader className={cn('[&_tr]:border-b-0', tableHeaderClassName)}>
            <TableRow className={cn('border-b-0', headerRowClassName)}>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(tableHeadCellClassName, column.headerClassName)}
                >
                  {column.header}
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
                      className={cn(tableCellClassName, column.cellClassName)}
                    >
                      {columnIndex === 0 && getRowHref ? (
                        <Link
                          to={getRowHref(row)}
                          state={getRowState?.(row)}
                          aria-label={getRowAriaLabel(row)}
                          className="absolute inset-0"
                        />
                      ) : null}
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
