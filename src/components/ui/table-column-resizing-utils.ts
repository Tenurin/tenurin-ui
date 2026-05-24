export type ColumnWidthMap = Record<string, number>;

export type ColumnResizeSession = Readonly<{
  cleanup: () => void;
}>;

export const RESIZABLE_TABLE_HEADER_LABEL_ATTRIBUTE =
  'data-resizable-table-header-label';

const RESIZABLE_TABLE_HEADER_LABEL_SELECTOR = `[${RESIZABLE_TABLE_HEADER_LABEL_ATTRIBUTE}]`;
const RESIZE_HANDLE_RESERVED_WIDTH = 24;

function readElementHorizontalPadding(element: Element): number {
  const styles = globalThis.getComputedStyle(element);
  const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(styles.paddingRight) || 0;

  return paddingLeft + paddingRight;
}

type ColumnMinimumWidthResolver = (
  columnId: string,
  measuredMinimumWidths?: ColumnWidthMap,
) => number;

type ApplyProportionalColumnResizeOptions = Readonly<{
  baseWidths: ColumnWidthMap;
  columnId: string;
  columnIds: readonly string[];
  delta: number;
  measuredMinimumWidths: ColumnWidthMap;
  resolveMinimumWidth: ColumnMinimumWidthResolver;
}>;

export function sumColumnWidths(
  columnIds: readonly string[],
  widths: ColumnWidthMap,
): number {
  return columnIds.reduce(
    (total, id) => total + (widths[id] ?? 0),
    0,
  );
}

type WeightedColumn = Readonly<{
  id: string;
  weight: number;
}>;

function distributeIntegerAmount(
  amount: number,
  items: readonly WeightedColumn[],
): ReadonlyArray<Readonly<{ id: string; share: number }>> {
  if (amount <= 0 || items.length === 0) {
    return items.map((item) => ({ id: item.id, share: 0 }));
  }

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight <= 0) {
    const equalShare = Math.floor(amount / items.length);
    let remainder = amount - equalShare * items.length;

    return items.map((item) => {
      const extra = remainder > 0 ? 1 : 0;
      remainder -= extra;

      return { id: item.id, share: equalShare + extra };
    });
  }

  const shares = items.map(({ id, weight }) => {
    const exact = (weight / totalWeight) * amount;
    const share = Math.floor(exact);

    return { id, share, frac: exact - share };
  });

  let assigned = shares.reduce((sum, entry) => sum + entry.share, 0);
  let remainder = amount - assigned;
  const rankedShares = [...shares].sort((left, right) => right.frac - left.frac);

  for (let index = 0; remainder > 0; index += 1) {
    rankedShares[index % rankedShares.length].share += 1;
    remainder -= 1;
  }

  return shares.map(({ id, share }) => ({ id, share }));
}

function getColumnSlack(
  columnId: string,
  widths: ColumnWidthMap,
  measuredMinimumWidths: ColumnWidthMap,
  resolveMinimumWidth: ColumnMinimumWidthResolver,
): number {
  const width = widths[columnId] ?? 0;
  const minimumWidth = resolveMinimumWidth(columnId, measuredMinimumWidths);

  return Math.max(0, width - minimumWidth);
}

function scaleDownColumnWidthsToTarget(
  widths: ColumnWidthMap,
  columnIds: readonly string[],
  targetTotal: number,
  minimumWidths: ColumnWidthMap,
): ColumnWidthMap {
  const result = { ...widths };
  let excess = sumColumnWidths(columnIds, result) - targetTotal;

  while (excess > 0) {
    const flexibleColumns = columnIds.filter(
      (columnId) => (result[columnId] ?? 0) > (minimumWidths[columnId] ?? 0),
    );
    const totalFlex = flexibleColumns.reduce(
      (sum, columnId) =>
        sum + ((result[columnId] ?? 0) - (minimumWidths[columnId] ?? 0)),
      0,
    );

    if (totalFlex <= 0) {
      break;
    }

    const reduction = Math.min(excess, totalFlex);
    const distribution = distributeIntegerAmount(
      reduction,
      flexibleColumns.map((columnId) => ({
        id: columnId,
        weight: (result[columnId] ?? 0) - (minimumWidths[columnId] ?? 0),
      })),
    );

    for (const { id, share } of distribution) {
      result[id] = (result[id] ?? 0) - share;
    }

    excess -= reduction;
  }

  return result;
}

function scaleUpColumnWidthsToTarget(
  widths: ColumnWidthMap,
  columnIds: readonly string[],
  targetTotal: number,
): ColumnWidthMap {
  const result = { ...widths };
  const slack = targetTotal - sumColumnWidths(columnIds, result);

  if (slack <= 0) {
    return result;
  }

  const distribution = distributeIntegerAmount(
    slack,
    columnIds.map((columnId) => ({
      id: columnId,
      weight: result[columnId] ?? 0,
    })),
  );

  for (const { id, share } of distribution) {
    result[id] = (result[id] ?? 0) + share;
  }

  return result;
}

/**
 * Scales column widths so their sum matches `targetTotal` while respecting minimums.
 * When minimums alone exceed the target, returns each column at its minimum.
 */
export function normalizeColumnWidthsToTotal(
  widths: ColumnWidthMap,
  columnIds: readonly string[],
  targetTotal: number,
  minimumWidths: ColumnWidthMap,
): ColumnWidthMap {
  const roundedTarget = Math.round(targetTotal);
  const normalizedMinimums = Object.fromEntries(
    columnIds.map((columnId) => [
      columnId,
      minimumWidths[columnId] ?? widths[columnId] ?? 0,
    ]),
  );
  const minimumTotal = sumColumnWidths(columnIds, normalizedMinimums);

  if (minimumTotal > roundedTarget) {
    return scaleDownColumnWidthsToTarget(
      normalizedMinimums,
      columnIds,
      roundedTarget,
      Object.fromEntries(columnIds.map((columnId) => [columnId, 0])),
    );
  }

  const nextWidths = Object.fromEntries(
    columnIds.map((columnId) => [
      columnId,
      Math.max(widths[columnId] ?? 0, normalizedMinimums[columnId] ?? 0),
    ]),
  );
  const currentTotal = sumColumnWidths(columnIds, nextWidths);

  if (currentTotal === roundedTarget) {
    return nextWidths;
  }

  if (currentTotal > roundedTarget) {
    return scaleDownColumnWidthsToTarget(
      nextWidths,
      columnIds,
      roundedTarget,
      normalizedMinimums,
    );
  }

  return scaleUpColumnWidthsToTarget(nextWidths, columnIds, roundedTarget);
}

/** Visible scrollport width used to lock table width during column resize. */
export function getTableResizeTargetWidth(table: HTMLTableElement): number {
  const containerWidth = table.parentElement?.clientWidth;

  if (containerWidth !== undefined && containerWidth > 0) {
    return Math.round(containerWidth);
  }

  return Math.round(table.getBoundingClientRect().width);
}

function stealWidthFromColumns(
  widths: ColumnWidthMap,
  donorIds: readonly string[],
  amount: number,
  measuredMinimumWidths: ColumnWidthMap,
  resolveMinimumWidth: ColumnMinimumWidthResolver,
): Readonly<{ stolen: number; widths: ColumnWidthMap }> {
  let nextWidths = { ...widths };
  let remaining = Math.round(amount);
  let stolen = 0;

  while (remaining > 0) {
    const donors = donorIds
      .map((columnId) => ({
        columnId,
        slack: getColumnSlack(
          columnId,
          nextWidths,
          measuredMinimumWidths,
          resolveMinimumWidth,
        ),
      }))
      .filter((donor) => donor.slack > 0);

    if (donors.length === 0) {
      break;
    }

    const totalSlack = donors.reduce((sum, donor) => sum + donor.slack, 0);
    const targetSteal = Math.min(remaining, totalSlack);
    const distribution = distributeIntegerAmount(
      targetSteal,
      donors.map((donor) => ({
        id: donor.columnId,
        weight: donor.slack,
      })),
    );

    let roundStolen = 0;

    for (const { id, share } of distribution) {
      const slack = getColumnSlack(
        id,
        nextWidths,
        measuredMinimumWidths,
        resolveMinimumWidth,
      );
      const actualShare = Math.min(share, slack);

      nextWidths[id] = (nextWidths[id] ?? 0) - actualShare;
      roundStolen += actualShare;
    }

    if (roundStolen === 0) {
      break;
    }

    stolen += roundStolen;
    remaining -= roundStolen;
  }

  return { stolen, widths: nextWidths };
}

function giveWidthToColumns(
  widths: ColumnWidthMap,
  recipientIds: readonly string[],
  amount: number,
  weightByColumnId: ColumnWidthMap,
): ColumnWidthMap {
  const nextWidths = { ...widths };
  const distribution = distributeIntegerAmount(
    Math.round(amount),
    recipientIds.map((columnId) => ({
      id: columnId,
      weight: weightByColumnId[columnId] ?? 0,
    })),
  );

  for (const { id, share } of distribution) {
    nextWidths[id] = (nextWidths[id] ?? 0) + share;
  }

  return nextWidths;
}

/**
 * Converts a pointer delta to an integer pixel resize step.
 * Any non-zero sub-pixel movement applies at least a 1px step.
 */
export function resolveResizeDelta(delta: number): number {
  const rounded = Math.round(delta);

  if (rounded !== 0) {
    return rounded;
  }

  if (delta === 0) {
    return 0;
  }

  return delta > 0 ? 1 : -1;
}

/**
 * Redistributes column widths for a resize drag.
 * Growing steals width from all other columns proportionally to their slack;
 * shrinking gives width to all other columns proportionally to their current width.
 */
export function applyProportionalColumnResize({
  baseWidths,
  columnId,
  columnIds,
  delta,
  measuredMinimumWidths,
  resolveMinimumWidth,
}: ApplyProportionalColumnResizeOptions): ColumnWidthMap {
  const resizeDelta = resolveResizeDelta(delta);

  if (resizeDelta === 0 || baseWidths[columnId] === undefined) {
    return baseWidths;
  }

  const otherColumnIds = columnIds.filter((id) => id !== columnId);

  if (otherColumnIds.length === 0) {
    return baseWidths;
  }

  if (resizeDelta > 0) {
    const { stolen, widths: nextWidths } = stealWidthFromColumns(
      baseWidths,
      otherColumnIds,
      resizeDelta,
      measuredMinimumWidths,
      resolveMinimumWidth,
    );

    return {
      ...nextWidths,
      [columnId]: (baseWidths[columnId] ?? 0) + stolen,
    };
  }

  const columnWidth = baseWidths[columnId] ?? 0;
  const columnMinimumWidth = resolveMinimumWidth(
    columnId,
    measuredMinimumWidths,
  );
  const requestedShrink = Math.max(0, -resizeDelta);
  const shrinkAmount = Math.min(
    requestedShrink,
    Math.max(0, columnWidth - columnMinimumWidth),
  );

  if (shrinkAmount === 0) {
    return baseWidths;
  }

  const nextWidths = giveWidthToColumns(
    { ...baseWidths, [columnId]: columnWidth - shrinkAmount },
    otherColumnIds,
    shrinkAmount,
    baseWidths,
  );

  return nextWidths;
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

export function hasColumnWidthsForIds(
  columnIds: readonly string[],
  widths: ColumnWidthMap,
): boolean {
  return columnIds.every((columnId) => widths[columnId] !== undefined);
}
