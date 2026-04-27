import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils';
import type { MinimalListTableColumn } from './minimal-list-table';
import { ResizableTableHeaderContent } from './resizable-table-header-content';
import { TableHead, TableHeader, TableRow } from './table';
import {
  TABLE_ACTIONS_COLUMN_ID,
  type UseTableColumnResizingResult,
} from './table-column-resizing';

type MinimalListTableHeaderProps<TItem> = Readonly<{
  actionsLabel: string;
  columnResizing: UseTableColumnResizingResult;
  columns: readonly MinimalListTableColumn<TItem>[];
  equalColumnWidths: boolean;
  mutedForegroundStyle: CSSProperties;
  showActionsColumn: boolean;
  tableHeadClassName: string;
}>;

export function MinimalListTableHeader<TItem>({
  actionsLabel,
  columnResizing,
  columns,
  equalColumnWidths,
  mutedForegroundStyle,
  showActionsColumn,
  tableHeadClassName,
}: MinimalListTableHeaderProps<TItem>) {
  return (
    <TableHeader className="[&_tr]:border-b-0">
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column.key}
            data-resizable-column-id={column.key}
            className={cn(
              'relative',
              tableHeadClassName,
              equalColumnWidths ? undefined : column.widthClassName,
              column.headClassName,
            )}
            style={columnResizing.getColumnMinimumWidthStyle(
              column.key,
              mutedForegroundStyle,
            )}
          >
            <ResizableTableHeaderContent
              columnId={column.key}
              enabled={columnResizing.canResizeColumn(column.key)}
              label={column.header}
              onResizePointerDown={columnResizing.startColumnResize}
              onResizeKeyDown={columnResizing.resizeColumnWithKeyboard}
            >
              {column.header}
            </ResizableTableHeaderContent>
          </TableHead>
        ))}
        {showActionsColumn ? (
          <TableHead
            data-resizable-column-id={TABLE_ACTIONS_COLUMN_ID}
            className={cn(tableHeadClassName, 'relative w-20')}
            style={columnResizing.getColumnMinimumWidthStyle(
              TABLE_ACTIONS_COLUMN_ID,
              mutedForegroundStyle,
            )}
          >
            <ResizableTableHeaderContent
              columnId={TABLE_ACTIONS_COLUMN_ID}
              enabled={columnResizing.canResizeColumn(TABLE_ACTIONS_COLUMN_ID)}
              label={actionsLabel}
              onResizePointerDown={columnResizing.startColumnResize}
              onResizeKeyDown={columnResizing.resizeColumnWithKeyboard}
            >
              {actionsLabel}
            </ResizableTableHeaderContent>
          </TableHead>
        ) : null}
      </TableRow>
    </TableHeader>
  );
}
