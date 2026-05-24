import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
} from 'react';

import {
  getKeyboardResizeDelta,
  getResizedColumnWidths,
  readColumnResizeMeasurement,
  resolveColumnMinimumWidth,
} from './table-column-resizing-measurement';
import { startColumnResizeSession } from './table-column-resizing-session';
import {
  hasColumnWidthsForIds,
  type ColumnResizeSession,
  type ColumnWidthMap,
} from './table-column-resizing-utils';

const EMPTY_MEASURED_MINIMUM_WIDTHS: ColumnWidthMap = {};

export const DEFAULT_MINIMUM_COLUMN_WIDTH = 88;
const EMPTY_COLUMN_WIDTHS: ColumnWidthMap = {};
export const TABLE_ACTIONS_COLUMN_ID = '__table-actions';

type UseTableColumnResizingOptions = Readonly<{
  columnIds: readonly string[];
  columnPreferredWidths?: ColumnWidthMap;
  enabled?: boolean;
  minimumColumnWidths?: ColumnWidthMap;
  minimumColumnWidth?: number;
  useUniformColumnMinimum?: boolean;
}>;

export type UseTableColumnResizingResult = Readonly<{
  canResizeColumn: (columnId: string) => boolean;
  isColumnResizing: boolean;
  isColumnResizingEnabled: boolean;
  isColumnWidthActive: boolean;
  getColumnWidthStyle: (columnId: string, style?: CSSProperties) => CSSProperties;
  startColumnResize: (event: ReactPointerEvent<HTMLButtonElement>, columnId: string) => void;
  resizeColumnWithKeyboard: (event: KeyboardEvent<HTMLButtonElement>, columnId: string) => void;
  syncColumnWidthsFromTable: (table: HTMLTableElement) => void;
}>;

export function useTableColumnResizing({
  columnIds,
  columnPreferredWidths,
  enabled = true,
  minimumColumnWidths = EMPTY_COLUMN_WIDTHS,
  minimumColumnWidth = DEFAULT_MINIMUM_COLUMN_WIDTH,
  useUniformColumnMinimum = false,
}: UseTableColumnResizingOptions): UseTableColumnResizingResult {
  const [columnWidths, setColumnWidths] = useState<ColumnWidthMap>({});
  const [isColumnResizing, setIsColumnResizing] = useState(false);
  const resizeSessionRef = useRef<ColumnResizeSession | null>(null);
  const dragWidthsRef = useRef<ColumnWidthMap | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const resizeStartFrameRef = useRef<number | null>(null);
  const isColumnResizingEnabled = enabled && columnIds.length > 1;
  const isColumnWidthActive = hasColumnWidthsForIds(columnIds, columnWidths);

  useEffect(() => {
    return () => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }

      if (resizeStartFrameRef.current !== null) {
        cancelAnimationFrame(resizeStartFrameRef.current);
      }

      resizeSessionRef.current?.cleanup();
    };
  }, []);

  const flushColumnWidths = useCallback(() => {
    if (resizeFrameRef.current !== null) {
      cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = null;
    }

    const widths = dragWidthsRef.current;

    if (widths !== null) {
      setColumnWidths(widths);
    }
  }, []);

  const scheduleColumnWidthCommit = useCallback((widths: ColumnWidthMap) => {
    dragWidthsRef.current = widths;

    if (resizeFrameRef.current !== null) {
      return;
    }

    resizeFrameRef.current = requestAnimationFrame(() => {
      resizeFrameRef.current = null;
      setColumnWidths(dragWidthsRef.current ?? widths);
    });
  }, []);

  /** Measured header label widths must not cap live drag slack. */
  const getDragColumnMinimumWidth = useCallback(
    (columnId: string) =>
      resolveColumnMinimumWidth(
        columnId,
        minimumColumnWidth,
        minimumColumnWidths,
        undefined,
      ),
    [minimumColumnWidth, minimumColumnWidths],
  );

  const getColumnWidthStyle = useCallback(
    (columnId: string, fallbackStyle?: CSSProperties) => {
      const width =
        dragWidthsRef.current?.[columnId] ?? columnWidths[columnId];

      if (width === undefined) {
        return fallbackStyle ?? {};
      }

      return {
        ...fallbackStyle,
        width: `${width}px`,
      };
    },
    [columnWidths],
  );

  const canResizeColumn = useCallback(
    (columnId: string) =>
      isColumnResizingEnabled && columnIds.includes(columnId),
    [columnIds, isColumnResizingEnabled],
  );

  const readMeasurement = useCallback(
    (table: HTMLTableElement, storedWidths?: ColumnWidthMap) =>
      readColumnResizeMeasurement(
        table,
        columnIds,
        minimumColumnWidth,
        minimumColumnWidths,
        {
          preferredWidths: columnPreferredWidths,
          storedWidths,
          useUniformColumnMinimum,
        },
      ),
    [
      columnIds,
      columnPreferredWidths,
      minimumColumnWidth,
      minimumColumnWidths,
      useUniformColumnMinimum,
    ],
  );

  const syncColumnWidthsFromTable = useCallback(
    (table: HTMLTableElement) => {
      if (!isColumnResizingEnabled || hasColumnWidthsForIds(columnIds, columnWidths)) {
        return;
      }

      const { widths } = readMeasurement(table);
      setColumnWidths(widths);
    },
    [columnIds, columnWidths, isColumnResizingEnabled, readMeasurement],
  );

  const startColumnResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, columnId: string) => {
      if (!isColumnResizingEnabled) {
        return;
      }

      if (event.button !== 0) {
        return;
      }

      const table = event.currentTarget.closest('table');

      if (table === null) {
        return;
      }

      const storedWidths = hasColumnWidthsForIds(columnIds, columnWidths)
        ? columnWidths
        : undefined;
      const { widths: startingWidths } = readMeasurement(table, storedWidths);

      if (startingWidths[columnId] === undefined) {
        return;
      }

      resizeSessionRef.current?.cleanup();
      resizeSessionRef.current = startColumnResizeSession({
        columnId,
        columnIds,
        event,
        onEnd: () => {
          flushColumnWidths();
          dragWidthsRef.current = null;
          resizeSessionRef.current = null;
          setIsColumnResizing(false);
        },
        onResize: scheduleColumnWidthCommit,
        resolveMinimumWidth: getDragColumnMinimumWidth,
        startingWidths,
      });
      dragWidthsRef.current = startingWidths;

      if (resizeStartFrameRef.current !== null) {
        cancelAnimationFrame(resizeStartFrameRef.current);
      }

      resizeStartFrameRef.current = requestAnimationFrame(() => {
        resizeStartFrameRef.current = null;
        setColumnWidths(startingWidths);
        setIsColumnResizing(true);
      });
    },
    [
      columnIds,
      columnWidths,
      flushColumnWidths,
      getDragColumnMinimumWidth,
      isColumnResizingEnabled,
      readMeasurement,
      scheduleColumnWidthCommit,
    ],
  );

  const resizeColumnWithKeyboard = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, columnId: string) => {
      if (!isColumnResizingEnabled) {
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
      const { widths: measuredWidths } = readMeasurement(
        table,
        hasColumnWidthsForIds(columnIds, columnWidths) ? columnWidths : undefined,
      );

      setColumnWidths((currentWidths) => {
        const baseWidths = hasColumnWidthsForIds(columnIds, currentWidths)
          ? currentWidths
          : measuredWidths;

        if (baseWidths[columnId] === undefined) {
          return currentWidths;
        }

        return getResizedColumnWidths({
          baseWidths,
          columnId,
          columnIds,
          delta,
          measuredMinimumWidths: EMPTY_MEASURED_MINIMUM_WIDTHS,
          resolveMinimumWidth: getDragColumnMinimumWidth,
        });
      });
    },
    [
      columnIds,
      columnWidths,
      getDragColumnMinimumWidth,
      isColumnResizingEnabled,
      readMeasurement,
    ],
  );

  return {
    canResizeColumn,
    getColumnWidthStyle,
    isColumnResizing,
    isColumnResizingEnabled,
    isColumnWidthActive,
    resizeColumnWithKeyboard,
    startColumnResize,
    syncColumnWidthsFromTable,
  };
}
