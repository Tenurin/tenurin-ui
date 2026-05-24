import {
  applyCascadingColumnResize,
  getResizedColumnPair,
  hasConservedColumnWidthTotal,
} from '../src/components/ui/table-column-resizing-utils.ts';

const columnIds = ['a', 'b', 'c', 'd'];
const minimums = { a: 88, b: 88, c: 88, d: 88 };
const resolveMinimumWidth = (columnId) => minimums[columnId] ?? 88;
const measuredMinimumWidths = minimums;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertWidths(actual, expected, message) {
  for (const columnId of columnIds) {
    assert(
      actual[columnId] === expected[columnId],
      `${message}: ${columnId} expected ${expected[columnId]}, got ${actual[columnId]}`,
    );
  }
}

function runChecks() {
  const baseWidths = { a: 200, b: 200, c: 200, d: 200 };

  const growAdjacentOnly = applyCascadingColumnResize({
    baseWidths,
    columnId: 'a',
    columnIds,
    delta: 40,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    growAdjacentOnly,
    { a: 240, b: 160, c: 200, d: 200 },
    'grow within adjacent column only',
  );
  assert(
    hasConservedColumnWidthTotal(columnIds, baseWidths, growAdjacentOnly),
    'grow adjacent only should conserve total width',
  );

  const growPastAdjacent = applyCascadingColumnResize({
    baseWidths: { a: 200, b: 100, c: 200, d: 200 },
    columnId: 'a',
    columnIds,
    delta: 40,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    growPastAdjacent,
    { a: 240, b: 88, c: 172, d: 200 },
    'grow past adjacent minimum cascades to next column',
  );
  assert(
    hasConservedColumnWidthTotal(
      columnIds,
      { a: 200, b: 100, c: 200, d: 200 },
      growPastAdjacent,
    ),
    'cascade grow should conserve total width',
  );

  const growAtLimit = applyCascadingColumnResize({
    baseWidths: { a: 200, b: 88, c: 88, d: 88 },
    columnId: 'a',
    columnIds,
    delta: 100,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    growAtLimit,
    { a: 200, b: 88, c: 88, d: 88 },
    'grow when all right columns are at minimum should not change widths',
  );

  const shrinkAdjacentOnly = applyCascadingColumnResize({
    baseWidths,
    columnId: 'a',
    columnIds,
    delta: -40,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    shrinkAdjacentOnly,
    { a: 160, b: 240, c: 200, d: 200 },
    'shrink should grow adjacent column first',
  );
  assert(
    hasConservedColumnWidthTotal(columnIds, baseWidths, shrinkAdjacentOnly),
    'shrink should conserve total width',
  );

  const shrinkPastMinimum = applyCascadingColumnResize({
    baseWidths,
    columnId: 'b',
    columnIds,
    delta: -120,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    shrinkPastMinimum,
    { a: 192, b: 88, c: 320, d: 200 },
    'shrink past minimum should cascade from left columns',
  );
  assert(
    hasConservedColumnWidthTotal(columnIds, baseWidths, shrinkPastMinimum),
    'shrink past minimum should conserve total width',
  );

  const pairOnlyMatch = getResizedColumnPair({
    adjacentColumnMinimumWidth: 88,
    adjacentColumnWidth: 200,
    columnMinimumWidth: 88,
    columnWidth: 200,
    delta: 40,
  });

  assert(
    pairOnlyMatch.columnWidth === 240 &&
      pairOnlyMatch.adjacentColumnWidth === 160,
    'getResizedColumnPair should still handle pair redistribution',
  );
}

try {
  runChecks();
  console.log('Table column resize checks passed.');
} catch (error) {
  console.error('Table column resize checks failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
