import {
  applyProportionalColumnResize,
  getColumnResizeTargetTotal,
  getTableResizeTargetWidth,
  normalizeColumnWidthsToTotal,
  readColumnMinimumWidths,
  readColumnWidths,
  type ColumnWidthMap,
} from './table-column-resizing-utils';

const KEYBOARD_RESIZE_STEP = 16;
const FAST_KEYBOARD_RESIZE_STEP = 48;

type ColumnResizeMeasurement = Readonly<{
  containerWidth: number;
  measuredMinimumWidths: ColumnWidthMap;
  widths: ColumnWidthMap;
}>;

export type ColumnMinimumWidthResolver = (
  columnId: string,
  measuredMinimumWidths?: ColumnWidthMap,
) => number;

type ResizedColumnWidthsOptions = Readonly<{
  baseWidths: ColumnWidthMap;
  columnId: string;
  columnIds: readonly string[];
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

function buildUniformColumnMinimumWidths(
  columnIds: readonly string[],
  fallbackMinimumColumnWidth: number,
  configuredMinimumWidths: ColumnWidthMap,
): ColumnWidthMap {
  return Object.fromEntries(
    columnIds.map((columnId) => [
      columnId,
      resolveColumnMinimumWidth(
        columnId,
        fallbackMinimumColumnWidth,
        configuredMinimumWidths,
        undefined,
      ),
    ]),
  );
}

type ReadColumnResizeMeasurementOptions = Readonly<{
  preferredWidths?: ColumnWidthMap;
  storedWidths?: ColumnWidthMap;
  useUniformColumnMinimum?: boolean;
}>;

export function readColumnResizeMeasurement(
  table: HTMLTableElement,
  columnIds: readonly string[],
  fallbackMinimumColumnWidth: number,
  configuredMinimumWidths: ColumnWidthMap,
  options: ReadColumnResizeMeasurementOptions = {},
): ColumnResizeMeasurement {
  const measuredMinimumWidths = options.useUniformColumnMinimum
    ? {}
    : readColumnMinimumWidths(table, columnIds, fallbackMinimumColumnWidth);
  const minimumWidths = options.useUniformColumnMinimum
    ? buildUniformColumnMinimumWidths(
        columnIds,
        fallbackMinimumColumnWidth,
        configuredMinimumWidths,
      )
    : buildMergedMinimumWidths(
        columnIds,
        fallbackMinimumColumnWidth,
        configuredMinimumWidths,
        measuredMinimumWidths,
      );
  const containerWidth = getTableResizeTargetWidth(table);
  const { preferredWidths, storedWidths } = options;

  let appliedWidths: ColumnWidthMap;

  if (
    storedWidths !== undefined &&
    columnIds.every((columnId) => storedWidths[columnId] !== undefined)
  ) {
    appliedWidths = storedWidths;
  } else if (
    preferredWidths !== undefined &&
    columnIds.every((columnId) => preferredWidths[columnId] !== undefined)
  ) {
    appliedWidths = preferredWidths;
  } else {
    appliedWidths = readColumnWidths(table, columnIds);
  }

  const targetTotal = getColumnResizeTargetTotal(
    columnIds,
    appliedWidths,
    containerWidth,
  );

  return {
    containerWidth,
    measuredMinimumWidths,
    widths: normalizeColumnWidthsToTotal(
      appliedWidths,
      columnIds,
      targetTotal,
      minimumWidths,
    ),
  };
}

export function getResizedColumnWidths({
  baseWidths,
  columnId,
  columnIds,
  delta,
  measuredMinimumWidths,
  resolveMinimumWidth,
}: ResizedColumnWidthsOptions): ColumnWidthMap {
  return applyProportionalColumnResize({
    baseWidths,
    columnId,
    columnIds,
    delta,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });
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
