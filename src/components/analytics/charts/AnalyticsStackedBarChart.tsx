import type {
  Formatter,
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  analyticsChartAxisTickSize,
  analyticsChartLegendIconSize,
  analyticsChartLegendWrapperStyle,
  analyticsChartSeriesColors,
  analyticsChartTooltipContentStyle,
  analyticsChartTooltipItemStyle,
  analyticsChartTooltipLabelStyle,
} from './analyticsChartConfig';
import AnalyticsChartEmptyState from './AnalyticsChartEmptyState';

export type AnalyticsStackedBarChartDatum = Record<
  string,
  number | string | null
>;

export type AnalyticsStackedBarChartSeries = Readonly<{
  color?: string;
  dataKey: string;
  label: string;
}>;

type AnalyticsStackedBarChartProps = Readonly<{
  data: AnalyticsStackedBarChartDatum[];
  emptyMessage: string;
  series: readonly AnalyticsStackedBarChartSeries[];
  tooltipValueFormatter?: (value: number) => string;
  xDataKey: string;
  yAxisTickFormatter?: (value: number) => string;
}>;

const stackedBarChartMargin = { top: 24, right: 24, bottom: 8, left: 0 };
const gridDashPattern = '3 3';
const stackId = 'analytics-stack';
const flatRadius: [number, number, number, number] = [0, 0, 0, 0];
const topRadius: [number, number, number, number] = [4, 4, 0, 0];

function getSeriesColor(
  series: AnalyticsStackedBarChartSeries,
  index: number,
): string {
  return (
    series.color ??
    analyticsChartSeriesColors[index] ??
    analyticsChartSeriesColors[0]
  );
}

function hasStackedBarData({
  data,
  series,
}: Pick<AnalyticsStackedBarChartProps, 'data' | 'series'>): boolean {
  return data.some((item) =>
    series.some((entry) => typeof item[entry.dataKey] === 'number'),
  );
}

function formatTooltipValue(
  value: ValueType,
  formatter: AnalyticsStackedBarChartProps['tooltipValueFormatter'],
): string {
  if (Array.isArray(value)) {
    return value.map(String).join(' - ');
  }

  if (typeof value === 'number' && formatter) {
    return formatter(value);
  }

  return String(value);
}

export default function AnalyticsStackedBarChart({
  data,
  emptyMessage,
  series,
  tooltipValueFormatter,
  xDataKey,
  yAxisTickFormatter,
}: AnalyticsStackedBarChartProps) {
  if (!hasStackedBarData({ data, series })) {
    return <AnalyticsChartEmptyState>{emptyMessage}</AnalyticsChartEmptyState>;
  }

  const tooltipFormatter: Formatter<ValueType, NameType> = (value, name) => [
    formatTooltipValue(value, tooltipValueFormatter),
    name,
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={stackedBarChartMargin}>
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray={gridDashPattern}
          vertical={false}
        />
        <XAxis
          dataKey={xDataKey}
          tick={{
            fill: 'var(--muted-foreground)',
            fontSize: analyticsChartAxisTickSize,
          }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis
          allowDecimals={false}
          tick={{
            fill: 'var(--muted-foreground)',
            fontSize: analyticsChartAxisTickSize,
          }}
          tickFormatter={yAxisTickFormatter}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <Tooltip
          contentStyle={analyticsChartTooltipContentStyle}
          formatter={tooltipFormatter}
          itemStyle={analyticsChartTooltipItemStyle}
          labelStyle={analyticsChartTooltipLabelStyle}
        />
        <Legend
          iconSize={analyticsChartLegendIconSize}
          wrapperStyle={analyticsChartLegendWrapperStyle}
        />
        {series.map((entry, index) => (
          <Bar
            key={entry.dataKey}
            dataKey={entry.dataKey}
            name={entry.label}
            fill={getSeriesColor(entry, index)}
            radius={index === series.length - 1 ? topRadius : flatRadius}
            stackId={stackId}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
