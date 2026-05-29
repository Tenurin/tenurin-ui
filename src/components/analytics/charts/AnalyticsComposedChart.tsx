import type {
  Formatter,
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { useCallback } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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
  analyticsChartStrokeWidth,
  analyticsChartTooltipContentStyle,
  analyticsChartTooltipItemStyle,
  analyticsChartTooltipLabelStyle,
} from './analyticsChartConfig';
import {
  formatAnalyticsBranchAxisLabel,
  formatAnalyticsBranchTooltipLabel,
  getAnalyticsBranchChartBarSize,
  shouldFormatAnalyticsBranchAxisLabels,
} from './analyticsBranchChartAxis';
import AnalyticsChartEmptyState from './AnalyticsChartEmptyState';
import { useAnalyticsBranchChartLayout } from './useAnalyticsBranchChartLayout';

export type AnalyticsComposedChartDatum = Record<
  string,
  number | string | null
>;

export type AnalyticsComposedChartSeries = Readonly<{
  color?: string;
  dataKey: string;
  label: string;
}>;

type AnalyticsComposedChartProps = Readonly<{
  barSeries: readonly AnalyticsComposedChartSeries[];
  data: AnalyticsComposedChartDatum[];
  emptyMessage: string;
  lineSeries: readonly AnalyticsComposedChartSeries[];
  tooltipValueFormatter?: (value: number) => string;
  xDataKey: string;
  yAxisTickFormatter?: (value: number) => string;
}>;

const composedChartMargin = { top: 24, right: 24, bottom: 8, left: 0 };
const composedChartBranchMargin = {
  top: 16,
  right: 24,
  bottom: 8,
  left: 4,
};
const gridDashPattern = '3 3';
const activeDotRadius = 4;
const verticalBarRadius: [number, number, number, number] = [0, 4, 4, 0];
const horizontalBarRadius: [number, number, number, number] = [4, 4, 0, 0];
const categoryAxisTick = {
  fill: 'var(--muted-foreground)',
  fontSize: analyticsChartAxisTickSize,
};

function getSeriesColor(
  series: AnalyticsComposedChartSeries,
  index: number,
): string {
  return (
    series.color ??
    analyticsChartSeriesColors[index] ??
    analyticsChartSeriesColors[0]
  );
}

function hasComposedChartData({
  barSeries,
  data,
  lineSeries,
}: Pick<
  AnalyticsComposedChartProps,
  'barSeries' | 'data' | 'lineSeries'
>): boolean {
  const dataKeys = [...barSeries, ...lineSeries].map(
    (series) => series.dataKey,
  );

  return data.some((item) =>
    dataKeys.some((dataKey) => typeof item[dataKey] === 'number'),
  );
}

function formatTooltipValue(
  value: ValueType,
  formatter: AnalyticsComposedChartProps['tooltipValueFormatter'],
): string {
  if (Array.isArray(value)) {
    return value.map(String).join(' - ');
  }

  if (typeof value === 'number' && formatter) {
    return formatter(value);
  }

  return String(value);
}

export default function AnalyticsComposedChart({
  barSeries,
  data,
  emptyMessage,
  lineSeries,
  tooltipValueFormatter,
  xDataKey,
  yAxisTickFormatter,
}: AnalyticsComposedChartProps) {
  const branchChartLayout = useAnalyticsBranchChartLayout();
  const formatBranchAxisTick = useCallback(
    (label: string) =>
      formatAnalyticsBranchAxisLabel(
        label,
        branchChartLayout.axisLabelMaxLength,
      ),
    [branchChartLayout.axisLabelMaxLength],
  );

  if (!hasComposedChartData({ barSeries, data, lineSeries })) {
    return <AnalyticsChartEmptyState>{emptyMessage}</AnalyticsChartEmptyState>;
  }

  const tooltipFormatter: Formatter<ValueType, NameType> = (value, name) => [
    formatTooltipValue(value, tooltipValueFormatter),
    name,
  ];
  const usesBranchAxis = shouldFormatAnalyticsBranchAxisLabels(xDataKey);

  if (usesBranchAxis) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          layout="vertical"
          margin={composedChartBranchMargin}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray={gridDashPattern}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={categoryAxisTick}
            tickFormatter={yAxisTickFormatter}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            type="category"
            dataKey={xDataKey}
            width={branchChartLayout.yAxisWidth}
            tick={categoryAxisTick}
            tickFormatter={formatBranchAxisTick}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <Tooltip
            contentStyle={analyticsChartTooltipContentStyle}
            formatter={tooltipFormatter}
            itemStyle={analyticsChartTooltipItemStyle}
            labelFormatter={(label) => formatAnalyticsBranchTooltipLabel(String(label))}
            labelStyle={analyticsChartTooltipLabelStyle}
          />
          <Legend
            iconSize={analyticsChartLegendIconSize}
            wrapperStyle={analyticsChartLegendWrapperStyle}
          />
          {barSeries.map((series, index) => (
            <Bar
              key={series.dataKey}
              dataKey={series.dataKey}
              name={series.label}
              fill={getSeriesColor(series, index)}
              barSize={getAnalyticsBranchChartBarSize()}
              radius={verticalBarRadius}
            />
          ))}
          {lineSeries.map((series, index) => (
            <Line
              key={series.dataKey}
              type="monotone"
              dataKey={series.dataKey}
              name={series.label}
              stroke={getSeriesColor(series, index + barSeries.length)}
              strokeWidth={analyticsChartStrokeWidth}
              dot={{ r: activeDotRadius }}
              activeDot={{ r: activeDotRadius }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={composedChartMargin}>
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray={gridDashPattern}
          vertical={false}
        />
        <XAxis
          dataKey={xDataKey}
          tick={categoryAxisTick}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis
          tick={categoryAxisTick}
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
        {barSeries.map((series, index) => (
          <Bar
            key={series.dataKey}
            dataKey={series.dataKey}
            name={series.label}
            fill={getSeriesColor(series, index)}
            radius={horizontalBarRadius}
          />
        ))}
        {lineSeries.map((series, index) => (
          <Line
            key={series.dataKey}
            type="monotone"
            dataKey={series.dataKey}
            name={series.label}
            stroke={getSeriesColor(series, index + barSeries.length)}
            strokeWidth={analyticsChartStrokeWidth}
            dot={false}
            activeDot={{ r: activeDotRadius }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
