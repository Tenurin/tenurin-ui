import type { CSSProperties } from 'react';

export const analyticsChartSeriesColors = [
  'var(--app-data-series-1-fg)',
  'var(--app-data-series-2-fg)',
  'var(--app-data-series-3-fg)',
  'var(--app-data-series-4-fg)',
] as const;

export const analyticsChartAxisTickSize = 11;
export const analyticsChartLegendIconSize = 9;
export const analyticsChartStrokeWidth = 2;
export const analyticsChartTabsListClassName =
  'h-8 min-h-8 shrink-0 rounded-md p-0.5';
export const analyticsChartTabsTriggerClassName =
  'min-h-7 rounded-sm px-2 py-0.5 text-xs sm:text-xs';

export const analyticsChartLegendWrapperStyle = {
  fontSize: '12px',
  lineHeight: '18px',
} satisfies CSSProperties;

export const analyticsChartTooltipContentStyle = {
  backgroundColor: 'var(--sidebar)',
  borderColor: 'var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--foreground)',
  fontSize: '12px',
  lineHeight: '18px',
} satisfies CSSProperties;

export const analyticsChartTooltipItemStyle = {
  color: 'var(--foreground)',
  fontSize: '12px',
  lineHeight: '18px',
} satisfies CSSProperties;

export const analyticsChartTooltipLabelStyle = {
  color: 'var(--foreground)',
  fontSize: '12px',
  lineHeight: '18px',
  marginBottom: '4px',
} satisfies CSSProperties;
