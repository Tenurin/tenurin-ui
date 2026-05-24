import { useCallback, useMemo } from 'react';

import { buildHeaderMinimumWidths } from './table-header-width';
import {
  DEFAULT_MINIMUM_COLUMN_WIDTH,
  TABLE_ACTIONS_COLUMN_ID,
  useTableColumnResizing,
} from './table-column-resizing';

type ResizableMinimalColumn = Readonly<{
  header: string;
  key: string;
  minimumWidth?: number;
}>;

type UseMinimalListTableColumnResizingOptions = Readonly<{
  actionsLabel: string;
  columns: readonly ResizableMinimalColumn[];
  minimumColumnWidth?: number;
  resizableColumns: boolean;
  showActionsColumn: boolean;
}>;

export function useMinimalListTableColumnResizing({
  actionsLabel,
  columns,
  minimumColumnWidth,
  resizableColumns,
  showActionsColumn,
}: UseMinimalListTableColumnResizingOptions) {
  const columnIds = columns.map((column) => column.key);
  const resizableColumnIds = showActionsColumn
    ? [...columnIds, TABLE_ACTIONS_COLUMN_ID]
    : columnIds;
  const effectiveMinimumColumnWidth =
    minimumColumnWidth ?? DEFAULT_MINIMUM_COLUMN_WIDTH;
  const headerWidthColumns = useMemo(
    () => [
      ...columns.map((column) => ({
        header: column.header,
        id: column.key,
        minimumWidth: column.minimumWidth,
      })),
      ...(showActionsColumn
        ? [{ header: actionsLabel, id: TABLE_ACTIONS_COLUMN_ID }]
        : []),
    ],
    [actionsLabel, columns, showActionsColumn],
  );
  const headerBasedColumnWidths = useMemo(
    () =>
      buildHeaderMinimumWidths(
        headerWidthColumns,
        effectiveMinimumColumnWidth,
      ),
    [effectiveMinimumColumnWidth, headerWidthColumns],
  );
  const columnMinimumWidths = resizableColumns ? {} : headerBasedColumnWidths;
  const columnPreferredWidths = resizableColumns
    ? headerBasedColumnWidths
    : undefined;

  const columnResizing = useTableColumnResizing({
    columnIds: resizableColumnIds,
    columnPreferredWidths: resizableColumns ? columnPreferredWidths : undefined,
    enabled: resizableColumns,
    minimumColumnWidth,
    minimumColumnWidths: columnMinimumWidths,
    useUniformColumnMinimum: resizableColumns,
  });

  const handleTableRef = useCallback(
    (table: HTMLTableElement | null) => {
      if (table === null) {
        return;
      }

      columnResizing.syncColumnWidthsFromTable(table);
    },
    [columnResizing.syncColumnWidthsFromTable],
  );

  return {
    ...columnResizing,
    handleTableRef,
  };
}
