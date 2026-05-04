import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import {
  analyticsChartLegendIconSize,
  analyticsChartLegendWrapperStyle,
  analyticsChartSeriesColors,
  analyticsChartTooltipContentStyle,
  analyticsChartTooltipItemStyle,
  analyticsChartTooltipLabelStyle,
} from './analyticsChartConfig';
import AnalyticsChartEmptyState from './AnalyticsChartEmptyState';

export type AnalyticsPieChartDatum = Readonly<{
  color?: string;
  label: string;
  value: number;
}>;

type AnalyticsPieChartProps = Readonly<{
  data: AnalyticsPieChartDatum[];
  emptyMessage: string;
}>;

const pieInnerRadius = '45%';
const pieOuterRadius = '70%';
const piePaddingAngle = 2;

function hasPieChartData(data: readonly AnalyticsPieChartDatum[]): boolean {
  return data.some((item) => item.value > 0);
}

function getSliceColor(item: AnalyticsPieChartDatum, index: number): string {
  return (
    item.color ??
    analyticsChartSeriesColors[index] ??
    analyticsChartSeriesColors[0]
  );
}

export default function AnalyticsPieChart({
  data,
  emptyMessage,
}: AnalyticsPieChartProps) {
  if (!hasPieChartData(data)) {
    return <AnalyticsChartEmptyState>{emptyMessage}</AnalyticsChartEmptyState>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={pieInnerRadius}
          outerRadius={pieOuterRadius}
          paddingAngle={piePaddingAngle}
        >
          {data.map((item, index) => (
            <Cell key={item.label} fill={getSliceColor(item, index)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={analyticsChartTooltipContentStyle}
          itemStyle={analyticsChartTooltipItemStyle}
          labelStyle={analyticsChartTooltipLabelStyle}
        />
        <Legend
          iconSize={analyticsChartLegendIconSize}
          iconType="circle"
          wrapperStyle={analyticsChartLegendWrapperStyle}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
