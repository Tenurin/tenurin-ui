import {
  applyProportionalColumnResize,
  getColumnResizeTargetTotal,
  hasConservedColumnWidthTotal,
  normalizeColumnWidthsToTotal,
  resolveResizeDelta,
  sumColumnWidths,
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

  const growAllOthers = applyProportionalColumnResize({
    baseWidths,
    columnId: 'a',
    columnIds,
    delta: 40,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    growAllOthers,
    { a: 240, b: 186, c: 187, d: 187 },
    'grow should steal proportionally from all other columns',
  );
  assert(
    hasConservedColumnWidthTotal(columnIds, baseWidths, growAllOthers),
    'grow should conserve total width',
  );

  const growAtLimit = applyProportionalColumnResize({
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
    'grow when all other columns are at minimum should not change widths',
  );

  const shrinkAllOthers = applyProportionalColumnResize({
    baseWidths,
    columnId: 'a',
    columnIds,
    delta: -40,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    shrinkAllOthers,
    { a: 160, b: 214, c: 213, d: 213 },
    'shrink should grow all other columns proportionally',
  );
  assert(
    hasConservedColumnWidthTotal(columnIds, baseWidths, shrinkAllOthers),
    'shrink should conserve total width',
  );

  const shrinkLastColumn = applyProportionalColumnResize({
    baseWidths,
    columnId: 'd',
    columnIds,
    delta: -40,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assert(
    shrinkLastColumn.d === 160,
    'last column should shrink by requested amount',
  );
  assert(
    hasConservedColumnWidthTotal(columnIds, baseWidths, shrinkLastColumn),
    'last column shrink should conserve total width',
  );

  const shrinkAtMinimum = applyProportionalColumnResize({
    baseWidths: { a: 88, b: 200, c: 200, d: 200 },
    columnId: 'a',
    columnIds,
    delta: -40,
    measuredMinimumWidths,
    resolveMinimumWidth,
  });

  assertWidths(
    shrinkAtMinimum,
    { a: 88, b: 200, c: 200, d: 200 },
    'shrink at minimum should not change widths',
  );

  const normalized = normalizeColumnWidthsToTotal(
    { a: 120, b: 120, c: 120, d: 120 },
    columnIds,
    800,
    minimums,
  );

  assert(
    sumColumnWidths(columnIds, normalized) === 800,
    'normalize should match target total',
  );

  const normalizedBelowMinimums = normalizeColumnWidthsToTotal(
    { a: 200, b: 200, c: 200, d: 200 },
    columnIds,
    300,
    minimums,
  );

  assert(
    sumColumnWidths(columnIds, normalizedBelowMinimums) === 300,
    'normalize should fit target even when minimums exceed it',
  );

  assert(
    resolveResizeDelta(0.43) === 1,
    'sub-pixel grow delta should apply at least 1px',
  );
  assert(
    resolveResizeDelta(-0.75) === -1,
    'sub-pixel shrink delta should apply at least 1px',
  );
  assert(resolveResizeDelta(0.2) === 1, 'non-zero jitter should still apply 1px step');

  const applicantsPreferred = {
    listingRole: 200,
    listingCompany: 150,
    batchName: 104,
    listingType: 120,
    listingCompensation: 180,
    listingStatus: 130,
    noOfApplicants: 159,
    createdAt: 140,
  };
  const uniformMinimums = Object.fromEntries(
    Object.keys(applicantsPreferred).map((columnId) => [columnId, 88]),
  );
  const distributed = normalizeColumnWidthsToTotal(
    applicantsPreferred,
    Object.keys(applicantsPreferred),
    1200,
    uniformMinimums,
  );

  assert(
    distributed.noOfApplicants > uniformMinimums.noOfApplicants,
    'applicants should start wider than uniform minimum',
  );
  assert(
    distributed.noOfApplicants < distributed.listingRole,
    'post title should stay wider than applicants by header weight',
  );

  const shrinkApplicants = applyProportionalColumnResize({
    baseWidths: distributed,
    columnId: 'noOfApplicants',
    columnIds: Object.keys(applicantsPreferred),
    delta: -80,
    measuredMinimumWidths: {},
    resolveMinimumWidth: (columnId) => uniformMinimums[columnId] ?? 88,
  });

  assert(
    shrinkApplicants.noOfApplicants === 88,
    'applicants should shrink to the shared minimum',
  );

  const overflowPreferred = { a: 400, b: 400, c: 400, d: 400 };
  const overflowTarget = getColumnResizeTargetTotal(
    columnIds,
    overflowPreferred,
    800,
  );

  assert(overflowTarget === 1600, 'overflow content should keep natural width total');

  const overflowWidths = normalizeColumnWidthsToTotal(
    overflowPreferred,
    columnIds,
    overflowTarget,
    minimums,
  );

  assert(
    sumColumnWidths(columnIds, overflowWidths) === 1600,
    'overflow layout should not compress header-based defaults',
  );

  const fitPreferred = { a: 100, b: 100, c: 100, d: 100 };
  const fitTarget = getColumnResizeTargetTotal(columnIds, fitPreferred, 800);

  assert(fitTarget === 800, 'fit content should expand to container width');

  const fitWidths = normalizeColumnWidthsToTotal(
    fitPreferred,
    columnIds,
    fitTarget,
    minimums,
  );

  assert(
    sumColumnWidths(columnIds, fitWidths) === 800,
    'fit layout should fill the container',
  );

  const lockedMeasuredMinimums = { a: 200, b: 200, c: 200, d: 200 };
  const dragMinimum = (columnId) => minimums[columnId] ?? 88;

  const growWithLockedMeasured = applyProportionalColumnResize({
    baseWidths,
    columnId: 'a',
    columnIds,
    delta: 40,
    measuredMinimumWidths: lockedMeasuredMinimums,
    resolveMinimumWidth: dragMinimum,
  });

  assertWidths(
    growWithLockedMeasured,
    { a: 240, b: 186, c: 187, d: 187 },
    'drag minimums should ignore measured header lock',
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
