import {
  applyColumnMinimumWidths,
  getResizedColumnPair,
  readColumnMinimumWidths,
  readColumnWidths,
  type ColumnWidthMap,
} from './table-column-resizing-utils';

const KEYBOARD_RESIZE_STEP = 16;
const FAST_KEYBOARD_RESIZE_STEP = 48;

type ColumnResizeMeasurement = Readonly<{
  measuredMinimumWidths: ColumnWidthMap;
  widths: ColumnWidthMap;
}>;

export type ColumnMinimumWidthResolver = (
  columnId: string,
  measuredMinimumWidths?: ColumnWidthMap,
) => number;

type ResizedColumnWidthsOptions = Readonly<{
  adjacentColumnId: string;
  adjacentColumnWidth: number;
  baseWidths: ColumnWidthMap;
  columnId: string;
  columnWidth: number;
  delta: number;
  measuredMinimumWidths: ColumnWidthMap;
  resolveMinimumWidth: ColumnMinimumWidthResolver;
}>;

export function resolveColumnMinimumWidth(
  columnId: string,
  fallbackMinimumColumnWidth: number,
  configuredMinimumWidths: ColumnWidthMap,
  measuredMinimumWidths?: ColumnWidthMap,
): number {
  return Math.max(
    fallbackMinimumColumnWidth,
    configuredMinimumWidths[columnId] ?? fallbackMinimumColumnWidth,
    measuredMinimumWidths?.[columnId] ?? fallbackMinimumColumnWidth,
  );
}

function buildMergedMinimumWidths(
  columnIds: readonly string[],
  fallbackMinimumColumnWidth: number,
  configuredMinimumWidths: ColumnWidthMap,
  measuredMinimumWidths: ColumnWidthMap,
): ColumnWidthMap {
  return Object.fromEntries(
    columnIds.map((columnId) => [
      columnId,
      resolveColumnMinimumWidth(
        columnId,
        fallbackMinimumColumnWidth,
        configuredMinimumWidths,
        measuredMinimumWidths,
      ),
    ]),
  );
}

export function readColumnResizeMeasurement(
  table: HTMLTableElement,
  columnIds: readonly string[],
  fallbackMinimumColumnWidth: number,
  configuredMinimumWidths: ColumnWidthMap,
): ColumnResizeMeasurement {
  const measuredMinimumWidths = readColumnMinimumWidths(
    table,
    columnIds,
    fallbackMinimumColumnWidth,
  );
  const minimumWidths = buildMergedMinimumWidths(
    columnIds,
    fallbackMinimumColumnWidth,
    configuredMinimumWidths,
    measuredMinimumWidths,
  );

  return {
    measuredMinimumWidths,
    widths: applyColumnMinimumWidths(
      readColumnWidths(table, columnIds),
      minimumWidths,
      fallbackMinimumColumnWidth,
    ),
  };
}

export function getResizedColumnWidths({
  adjacentColumnId,
  adjacentColumnWidth,
  baseWidths,
  columnId,
  columnWidth,
  delta,
  measuredMinimumWidths,
  resolveMinimumWidth,
}: ResizedColumnWidthsOptions): ColumnWidthMap {
  const resizedColumnPair = getResizedColumnPair({
    adjacentColumnMinimumWidth: resolveMinimumWidth(
      adjacentColumnId,
      measuredMinimumWidths,
    ),
    adjacentColumnWidth,
    columnMinimumWidth: resolveMinimumWidth(columnId, measuredMinimumWidths),
    columnWidth,
    delta,
  });

  return {
    ...baseWidths,
    [adjacentColumnId]: resizedColumnPair.adjacentColumnWidth,
    [columnId]: resizedColumnPair.columnWidth,
  };
}

export function getKeyboardResizeDelta(
  key: string,
  isFastResize: boolean,
): number | undefined {
  const step = isFastResize ? FAST_KEYBOARD_RESIZE_STEP : KEYBOARD_RESIZE_STEP;
  const deltaByKey: Readonly<Record<string, number>> = {
    ArrowLeft: -step,
    ArrowRight: step,
  };

  return deltaByKey[key];
}
