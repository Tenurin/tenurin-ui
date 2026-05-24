import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import {
  getKeyboardResizeDelta,
  getResizedColumnWidths,
  readColumnResizeMeasurement,
  resolveColumnMinimumWidth,
} from './table-column-resizing-measurement';
import { startColumnResizeSession } from './table-column-resizing-session';
import {
  getNextResizableColumnId,
  hasColumnWidths,
  type ColumnResizeSession,
  type ColumnWidthMap,
} from './table-column-resizing-utils';

export const DEFAULT_MINIMUM_COLUMN_WIDTH = 88;
const EMPTY_COLUMN_WIDTHS: ColumnWidthMap = {};
export const TABLE_ACTIONS_COLUMN_ID = '__table-actions';

type UseTableColumnResizingOptions = Readonly<{
  columnIds: readonly string[];
  enabled?: boolean;
  minimumColumnWidths?: ColumnWidthMap;
  minimumColumnWidth?: number;
}>;

export type UseTableColumnResizingResult = Readonly<{
  canResizeColumn: (columnId: string) => boolean;
  isColumnResizingEnabled: boolean;
  isColumnWidthActive: boolean;
  getColumnWidthStyle: (columnId: string, style?: CSSProperties) => CSSProperties;
  getColumnMinimumWidthStyle: (
    columnId: string,
    style?: CSSProperties,
  ) => CSSProperties;
  startColumnResize: (event: ReactPointerEvent<HTMLButtonElement>, columnId: string) => void;
  resizeColumnWithKeyboard: (event: KeyboardEvent<HTMLButtonElement>, columnId: string) => void;
}>;

export function useTableColumnResizing({
  columnIds,
  enabled = true,
  minimumColumnWidths = EMPTY_COLUMN_WIDTHS,
  minimumColumnWidth = DEFAULT_MINIMUM_COLUMN_WIDTH,
}: UseTableColumnResizingOptions): UseTableColumnResizingResult {
  const [columnWidths, setColumnWidths] = useState<ColumnWidthMap>({});
  const resizeSessionRef = useRef<ColumnResizeSession | null>(null);
  const isColumnResizingEnabled = enabled && columnIds.length > 1;
  const isColumnWidthActive = hasColumnWidths(columnWidths);

  useEffect(() => {
    return () => resizeSessionRef.current?.cleanup();
  }, []);

  const getColumnMinimumWidth = useCallback(
    (columnId: string, measuredMinimumWidths?: ColumnWidthMap) =>
      resolveColumnMinimumWidth(
        columnId,
        minimumColumnWidth,
        minimumColumnWidths,
        measuredMinimumWidths,
      ),
    [minimumColumnWidth, minimumColumnWidths],
  );

  const getColumnMinimumWidthStyle = useCallback(
    (columnId: string, fallbackStyle?: CSSProperties) => ({
      ...fallbackStyle,
      minWidth: `${getColumnMinimumWidth(columnId)}px`,
    }),
    [getColumnMinimumWidth],
  );

  const getColumnWidthStyle = useCallback(
    (columnId: string, fallbackStyle?: CSSProperties) => {
      const width = columnWidths[columnId];
      const minimumWidthStyle = getColumnMinimumWidthStyle(
        columnId,
        fallbackStyle,
      );

      if (width === undefined) {
        return minimumWidthStyle;
      }

      return {
        ...minimumWidthStyle,
        width: `${width}px`,
      };
    },
    [columnWidths, getColumnMinimumWidthStyle],
  );

  const canResizeColumn = useCallback(
    (columnId: string) =>
      isColumnResizingEnabled &&
      getNextResizableColumnId(columnIds, columnId) !== undefined,
    [columnIds, isColumnResizingEnabled],
  );

  const startColumnResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, columnId: string) => {
      const adjacentColumnId = getNextResizableColumnId(columnIds, columnId);

      if (
        !isColumnResizingEnabled ||
        adjacentColumnId === undefined ||
        event.button !== 0
      ) {
        return;
      }

      const table = event.currentTarget.closest('table');

      if (table === null) {
        return;
      }

      const measurement = readColumnResizeMeasurement(
        table,
        columnIds,
        minimumColumnWidth,
        minimumColumnWidths,
      );
      const { measuredMinimumWidths, widths: startingWidths } = measurement;
      const startingWidth = startingWidths[columnId];
      const startingAdjacentWidth = startingWidths[adjacentColumnId];

      if (startingWidth === undefined || startingAdjacentWidth === undefined) {
        return;
      }

      resizeSessionRef.current?.cleanup();
      setColumnWidths(startingWidths);
      resizeSessionRef.current = startColumnResizeSession({
        adjacentColumnId,
        adjacentColumnWidth: startingAdjacentWidth,
        columnId,
        columnWidth: startingWidth,
        event,
        measuredMinimumWidths,
        onEnd: () => {
          resizeSessionRef.current = null;
        },
        onResize: setColumnWidths,
        resolveMinimumWidth: getColumnMinimumWidth,
        startingWidths,
      });
    },
    [
      columnIds,
      getColumnMinimumWidth,
      isColumnResizingEnabled,
      minimumColumnWidth,
      minimumColumnWidths,
    ],
  );

  const resizeColumnWithKeyboard = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, columnId: string) => {
      const adjacentColumnId = getNextResizableColumnId(columnIds, columnId);

      if (!isColumnResizingEnabled || adjacentColumnId === undefined) {
        return;
      }

      const delta = getKeyboardResizeDelta(event.key, event.shiftKey);

      if (delta === undefined) {
        return;
      }

      const table = event.currentTarget.closest('table');

      if (table === null) {
        return;
      }

      event.preventDefault();
      const measurement = readColumnResizeMeasurement(
        table,
        columnIds,
        minimumColumnWidth,
        minimumColumnWidths,
      );
      const { measuredMinimumWidths, widths: measuredWidths } = measurement;

      setColumnWidths((currentWidths) => {
        const baseWidths = hasColumnWidths(currentWidths)
          ? currentWidths
          : measuredWidths;
        const currentWidth = baseWidths[columnId];
        const adjacentColumnWidth = baseWidths[adjacentColumnId];

        if (currentWidth === undefined || adjacentColumnWidth === undefined) {
          return currentWidths;
        }

        return {
          ...measuredWidths,
          ...currentWidths,
          ...getResizedColumnWidths({
            adjacentColumnId,
            adjacentColumnWidth,
            baseWidths: currentWidths,
            columnId,
            columnWidth: currentWidth,
            delta,
            measuredMinimumWidths,
            resolveMinimumWidth: getColumnMinimumWidth,
          }),
        };
      });
    },
    [
      columnIds,
      getColumnMinimumWidth,
      isColumnResizingEnabled,
      minimumColumnWidth,
      minimumColumnWidths,
    ],
  );

  return {
    canResizeColumn,
    getColumnMinimumWidthStyle,
    getColumnWidthStyle,
    isColumnResizingEnabled,
    isColumnWidthActive,
    resizeColumnWithKeyboard,
    startColumnResize,
  };
}
