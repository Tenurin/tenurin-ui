import { useMemo } from 'react';

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
  const columnMinimumWidths = useMemo(
    () =>
      buildHeaderMinimumWidths(
        [
          ...columns.map((column) => ({
            header: column.header,
            id: column.key,
            minimumWidth: column.minimumWidth,
          })),
          ...(showActionsColumn
            ? [{ header: actionsLabel, id: TABLE_ACTIONS_COLUMN_ID }]
            : []),
        ],
        effectiveMinimumColumnWidth,
      ),
    [actionsLabel, columns, effectiveMinimumColumnWidth, showActionsColumn],
  );

  return useTableColumnResizing({
    columnIds: resizableColumnIds,
    enabled: resizableColumns,
    minimumColumnWidth,
    minimumColumnWidths: columnMinimumWidths,
  });
}
