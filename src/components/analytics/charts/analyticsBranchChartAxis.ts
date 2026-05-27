/** Category axis data key used for branch-wise analytics charts. */
export const analyticsBranchChartXAxisKey = 'branchName';

const analyticsBranchChartEmptyHeightPx = 192;
/** Matches prior Visual tab card height so sparse branch charts stay balanced. */
const analyticsBranchChartDefaultMinHeightPx = 288;
const analyticsBranchChartHeightPerCategoryPx = 28;
const analyticsBranchChartPaddingPx = 48;
const analyticsBranchChartYAxisWidthPx = 280;
const analyticsBranchChartBarSizePx = 22;
const analyticsBranchChartSparseCategoryMax = 4;
const analyticsBranchAxisLabelMaxLength = 48;

const degreePrefixPattern =
  /^(?:Bachelor of Engineering|Bachelor of Technology|Master of [^-]+) - /u;

/**
 * Strips the degree prefix for tooltips (full branch name, not truncated).
 */
export function formatAnalyticsBranchTooltipLabel(label: string): string {
  return label.replace(degreePrefixPattern, '').trim();
}

/**
 * Shortens degree-prefixed branch names for chart category axes.
 */
export function formatAnalyticsBranchAxisLabel(label: string): string {
  const stripped = label.replace(degreePrefixPattern, '').trim();

  if (stripped.length <= analyticsBranchAxisLabelMaxLength) {
    return stripped;
  }

  return `${stripped.slice(0, analyticsBranchAxisLabelMaxLength - 1)}…`;
}

/**
 * Returns true when chart data uses branch names as the category axis.
 */
export function shouldFormatAnalyticsBranchAxisLabels(xDataKey: string): boolean {
  return xDataKey === analyticsBranchChartXAxisKey;
}

/**
 * Fixed width reserved for branch labels in horizontal bar layout.
 */
export function getAnalyticsBranchChartYAxisWidth(): number {
  return analyticsBranchChartYAxisWidthPx;
}

/**
 * Fixed bar thickness for branch-wise horizontal bar charts.
 */
export function getAnalyticsBranchChartBarSize(): number {
  return analyticsBranchChartBarSizePx;
}

/**
 * Chart content height for branch-wise horizontal bar charts (no inner scroll).
 */
export function getAnalyticsBranchChartMinHeight(categoryCount: number): number {
  if (categoryCount === 0) {
    return analyticsBranchChartEmptyHeightPx;
  }

  const computedHeight =
    categoryCount * analyticsBranchChartHeightPerCategoryPx +
    analyticsBranchChartPaddingPx;

  if (categoryCount <= analyticsBranchChartSparseCategoryMax) {
    return Math.max(computedHeight, analyticsBranchChartDefaultMinHeightPx);
  }

  return computedHeight;
}
