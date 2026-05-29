import { useIsMobile } from '../../../hooks/use-mobile';

const analyticsBranchChartCompactYAxisWidthPx = 104;
const analyticsBranchChartCompactLabelMaxLength = 14;
const analyticsBranchChartDesktopYAxisWidthPx = 280;
const analyticsBranchChartDesktopLabelMaxLength = 48;

export type AnalyticsBranchChartLayout = Readonly<{
  axisLabelMaxLength: number;
  yAxisWidth: number;
}>;

/**
 * Responsive Y-axis sizing so branch labels do not consume the plot on narrow viewports.
 */
export function useAnalyticsBranchChartLayout(): AnalyticsBranchChartLayout {
  const isMobile = useIsMobile();

  if (isMobile) {
    return {
      axisLabelMaxLength: analyticsBranchChartCompactLabelMaxLength,
      yAxisWidth: analyticsBranchChartCompactYAxisWidthPx,
    };
  }

  return {
    axisLabelMaxLength: analyticsBranchChartDesktopLabelMaxLength,
    yAxisWidth: analyticsBranchChartDesktopYAxisWidthPx,
  };
}
