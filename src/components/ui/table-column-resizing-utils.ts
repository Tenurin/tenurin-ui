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
