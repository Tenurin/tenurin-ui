import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import AnalyticsChartEmptyState from './AnalyticsChartEmptyState';

export type AnalyticsLineChartDatum = Record<string, number | string>;

export type AnalyticsLineChartSeries = Readonly<{
  color?: string;
  dataKey: string;
  label: string;
}>;

type AnalyticsLineChartProps = Readonly<{
  data: AnalyticsLineChartDatum[];
  emptyMessage: string;
  series: readonly AnalyticsLineChartSeries[];
  xDataKey: string;
}>;

const lineChartMargin = { top: 24, right: 24, bottom: 8, left: 0 };
const gridDashPattern = '3 3';
const activeDotRadius = 4;

function getSeriesColor(
  series: AnalyticsLineChartSeries,
  index: number,
): string {
  return (
    series.color ??
    analyticsChartSeriesColors[index] ??
    analyticsChartSeriesColors[0]
  );
}

export default function AnalyticsLineChart({
  data,
  emptyMessage,
  series,
  xDataKey,
}: AnalyticsLineChartProps) {
  if (data.length === 0) {
    return <AnalyticsChartEmptyState>{emptyMessage}</AnalyticsChartEmptyState>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={lineChartMargin}>
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
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <Tooltip
          contentStyle={analyticsChartTooltipContentStyle}
          itemStyle={analyticsChartTooltipItemStyle}
          labelStyle={analyticsChartTooltipLabelStyle}
        />
        <Legend
          iconSize={analyticsChartLegendIconSize}
          iconType="plainline"
          wrapperStyle={analyticsChartLegendWrapperStyle}
        />
        {series.map((item, index) => (
          <Line
            key={item.dataKey}
            type="monotone"
            dataKey={item.dataKey}
            name={item.label}
            stroke={getSeriesColor(item, index)}
            strokeWidth={analyticsChartStrokeWidth}
            dot={false}
            activeDot={{ r: activeDotRadius }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
