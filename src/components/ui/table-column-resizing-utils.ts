export type ColumnWidthMap = Record<string, number>;

export type ColumnResizeSession = Readonly<{
  cleanup: () => void;
}>;

export const RESIZABLE_TABLE_HEADER_LABEL_ATTRIBUTE =
  'data-resizable-table-header-label';

const RESIZABLE_TABLE_HEADER_LABEL_SELECTOR = `[${RESIZABLE_TABLE_HEADER_LABEL_ATTRIBUTE}]`;
const RESIZE_HANDLE_RESERVED_WIDTH = 24;

type ResizeColumnPairOptions = Readonly<{
  adjacentColumnMinimumWidth: number;
  adjacentColumnWidth: number;
  columnMinimumWidth: number;
  columnWidth: number;
  delta: number;
}>;

type ResizedColumnPair = Readonly<{
  adjacentColumnWidth: number;
  columnWidth: number;
}>;

function clampWidthWithinPair(
  width: number,
  pairWidth: number,
  columnMinimumWidth: number,
  adjacentColumnMinimumWidth: number,
): number {
  const minimumWidthTotal = columnMinimumWidth + adjacentColumnMinimumWidth;
  const minimumWidthScale =
    minimumWidthTotal > pairWidth ? pairWidth / minimumWidthTotal : 1;
  const effectiveColumnMinimumWidth =
    minimumWidthTotal > pairWidth
      ? Math.floor(columnMinimumWidth * minimumWidthScale)
      : columnMinimumWidth;
  const effectiveAdjacentMinimumWidth =
    minimumWidthTotal > pairWidth
      ? pairWidth - effectiveColumnMinimumWidth
      : adjacentColumnMinimumWidth;
  const maximumColumnWidth = pairWidth - effectiveAdjacentMinimumWidth;

  return Math.min(
    Math.max(Math.round(width), effectiveColumnMinimumWidth),
    maximumColumnWidth,
  );
}

function readElementHorizontalPadding(element: Element): number {
  const styles = globalThis.getComputedStyle(element);
  const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(styles.paddingRight) || 0;

  return paddingLeft + paddingRight;
}

export function getNextResizableColumnId(
  columnIds: readonly string[],
  columnId: string,
): string | undefined {
  const columnIndex = columnIds.indexOf(columnId);

  if (columnIndex < 0) {
    return undefined;
  }

  return columnIds[columnIndex + 1];
}

export function getResizedColumnPair({
  adjacentColumnMinimumWidth,
  adjacentColumnWidth,
  columnMinimumWidth,
  columnWidth,
  delta,
}: ResizeColumnPairOptions): ResizedColumnPair {
  const pairWidth = Math.round(columnWidth + adjacentColumnWidth);
  const nextColumnWidth = clampWidthWithinPair(
    columnWidth + delta,
    pairWidth,
    columnMinimumWidth,
    adjacentColumnMinimumWidth,
  );

  return {
    adjacentColumnWidth: pairWidth - nextColumnWidth,
    columnWidth: nextColumnWidth,
  };
}

type ColumnMinimumWidthResolver = (
  columnId: string,
  measuredMinimumWidths?: ColumnWidthMap,
) => number;

type ApplyCascadingColumnResizeOptions = Readonly<{
  baseWidths: ColumnWidthMap;
  columnId: string;
  columnIds: readonly string[];
  delta: number;
  measuredMinimumWidths: ColumnWidthMap;
  resolveMinimumWidth: ColumnMinimumWidthResolver;
}>;

function sumColumnWidths(
  columnIds: readonly string[],
  widths: ColumnWidthMap,
): number {
  return columnIds.reduce(
    (total, id) => total + (widths[id] ?? 0),
    0,
  );
}

function applyCascadeGrow({
  baseWidths,
  columnId,
  columnIds,
  delta,
  measuredMinimumWidths,
  resolveMinimumWidth,
}: ApplyCascadingColumnResizeOptions): ColumnWidthMap {
  const columnIndex = columnIds.indexOf(columnId);

  if (columnIndex < 0) {
    return baseWidths;
  }

  const nextWidths = { ...baseWidths };
  let remainingAbsorb = Math.max(0, Math.round(delta));

  for (
    let index = columnIndex + 1;
    index < columnIds.length && remainingAbsorb > 0;
    index += 1
  ) {
    const absorbColumnId = columnIds[index];
    const currentWidth = baseWidths[absorbColumnId];

    if (currentWidth === undefined) {
      continue;
    }

    const minimumWidth = resolveMinimumWidth(
      absorbColumnId,
      measuredMinimumWidths,
    );
    const availableWidth = Math.max(0, currentWidth - minimumWidth);
    const absorbedWidth = Math.min(remainingAbsorb, availableWidth);

    nextWidths[absorbColumnId] = currentWidth - absorbedWidth;
    remainingAbsorb -= absorbedWidth;
  }

  const startingColumnWidth = baseWidths[columnId];

  if (startingColumnWidth !== undefined) {
    nextWidths[columnId] =
      startingColumnWidth + Math.round(delta) - remainingAbsorb;
  }

  return nextWidths;
}

function distributeWidthToRightColumns(
  nextWidths: ColumnWidthMap,
  columnIds: readonly string[],
  fromColumnIndex: number,
  amount: number,
): void {
  let remainingAmount = amount;

  for (
    let index = fromColumnIndex + 1;
    index < columnIds.length && remainingAmount > 0;
    index += 1
  ) {
    const receiveColumnId = columnIds[index];
    const currentWidth = nextWidths[receiveColumnId];

    if (currentWidth === undefined) {
      continue;
    }

    nextWidths[receiveColumnId] = currentWidth + remainingAmount;
    remainingAmount = 0;
  }
}

function absorbWidthFromLeftColumns(
  nextWidths: ColumnWidthMap,
  columnIds: readonly string[],
  columnIndex: number,
  amount: number,
  measuredMinimumWidths: ColumnWidthMap,
  resolveMinimumWidth: ColumnMinimumWidthResolver,
): number {
  let remainingAbsorb = amount;

  for (
    let index = columnIndex - 1;
    index >= 0 && remainingAbsorb > 0;
    index -= 1
  ) {
    const absorbColumnId = columnIds[index];
    const currentWidth = nextWidths[absorbColumnId];

    if (currentWidth === undefined) {
      continue;
    }

    const minimumWidth = resolveMinimumWidth(
      absorbColumnId,
      measuredMinimumWidths,
    );
    const availableWidth = Math.max(0, currentWidth - minimumWidth);
    const absorbedWidth = Math.min(remainingAbsorb, availableWidth);

    nextWidths[absorbColumnId] = currentWidth - absorbedWidth;
    remainingAbsorb -= absorbedWidth;
    distributeWidthToRightColumns(
      nextWidths,
      columnIds,
      columnIndex,
      absorbedWidth,
    );
  }

  return amount - remainingAbsorb;
}

function applyCascadeShrink({
  baseWidths,
  columnId,
  columnIds,
  delta,
  measuredMinimumWidths,
  resolveMinimumWidth,
}: ApplyCascadingColumnResizeOptions): ColumnWidthMap {
  const columnIndex = columnIds.indexOf(columnId);

  if (columnIndex < 0) {
    return baseWidths;
  }

  const requestedShrink = Math.max(0, -Math.round(delta));
  const columnWidth = baseWidths[columnId];

  if (columnWidth === undefined || requestedShrink === 0) {
    return baseWidths;
  }

  const nextWidths = { ...baseWidths };
  const columnMinimumWidth = resolveMinimumWidth(
    columnId,
    measuredMinimumWidths,
  );
  const columnShrink = Math.min(
    requestedShrink,
    Math.max(0, columnWidth - columnMinimumWidth),
  );

  nextWidths[columnId] = columnWidth - columnShrink;
  distributeWidthToRightColumns(
    nextWidths,
    columnIds,
    columnIndex,
    columnShrink,
  );

  const remainingShrink = requestedShrink - columnShrink;

  if (remainingShrink > 0) {
    absorbWidthFromLeftColumns(
      nextWidths,
      columnIds,
      columnIndex,
      remainingShrink,
      measuredMinimumWidths,
      resolveMinimumWidth,
    );
  }

  return nextWidths;
}

/**
 * Redistributes column widths for a resize drag.
 * Growing steals width from columns to the right; shrinking gives to the right and,
 * once the resized column is at its minimum, steals from columns to the left.
 */
export function applyCascadingColumnResize({
  baseWidths,
  columnId,
  columnIds,
  delta,
  measuredMinimumWidths,
  resolveMinimumWidth,
}: ApplyCascadingColumnResizeOptions): ColumnWidthMap {
  const roundedDelta = Math.round(delta);

  if (roundedDelta === 0) {
    return baseWidths;
  }

  if (baseWidths[columnId] === undefined) {
    return baseWidths;
  }

  if (roundedDelta > 0) {
    return applyCascadeGrow({
      baseWidths,
      columnId,
      columnIds,
      delta: roundedDelta,
      measuredMinimumWidths,
      resolveMinimumWidth,
    });
  }

  if (getNextResizableColumnId(columnIds, columnId) === undefined) {
    return baseWidths;
  }

  return applyCascadeShrink({
    baseWidths,
    columnId,
    columnIds,
    delta: roundedDelta,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });
}

/** Returns true when every column width in the map sums to the expected total. */
export function hasConservedColumnWidthTotal(
  columnIds: readonly string[],
  beforeWidths: ColumnWidthMap,
  afterWidths: ColumnWidthMap,
): boolean {
  return (
    sumColumnWidths(columnIds, beforeWidths) ===
    sumColumnWidths(columnIds, afterWidths)
  );
}

export function readColumnWidths(
  table: HTMLTableElement,
  columnIds: readonly string[],
): ColumnWidthMap {
  const widths: ColumnWidthMap = {};
  const headerCells = table.querySelectorAll<HTMLTableCellElement>(
    'thead th[data-resizable-column-id]',
  );

  headerCells.forEach((cell) => {
    const columnId = cell.dataset.resizableColumnId;

    if (columnId === undefined || !columnIds.includes(columnId)) {
      return;
    }

    widths[columnId] = Math.round(cell.getBoundingClientRect().width);
  });

  return widths;
}

export function readColumnMinimumWidths(
  table: HTMLTableElement,
  columnIds: readonly string[],
  fallbackMinimumColumnWidth: number,
): ColumnWidthMap {
  const widths: ColumnWidthMap = {};
  const headerCells = table.querySelectorAll<HTMLTableCellElement>(
    'thead th[data-resizable-column-id]',
  );

  headerCells.forEach((cell) => {
    const columnId = cell.dataset.resizableColumnId;

    if (columnId === undefined || !columnIds.includes(columnId)) {
      return;
    }

    const label = cell.querySelector<HTMLElement>(
      RESIZABLE_TABLE_HEADER_LABEL_SELECTOR,
    );
    const measuredMinimumWidth =
      label === null
        ? fallbackMinimumColumnWidth
        : label.scrollWidth +
          readElementHorizontalPadding(cell) +
          RESIZE_HANDLE_RESERVED_WIDTH;

    widths[columnId] = Math.max(
      fallbackMinimumColumnWidth,
      Math.ceil(measuredMinimumWidth),
    );
  });

  return widths;
}

export function applyColumnMinimumWidths(
  widths: ColumnWidthMap,
  minimumWidths: ColumnWidthMap,
  fallbackMinimumColumnWidth: number,
): ColumnWidthMap {
  return Object.fromEntries(
    Object.entries(widths).map(([columnId, width]) => [
      columnId,
      Math.max(width, minimumWidths[columnId] ?? fallbackMinimumColumnWidth),
    ]),
  );
}

export function hasColumnWidths(widths: ColumnWidthMap): boolean {
  return Object.keys(widths).length > 0;
}
