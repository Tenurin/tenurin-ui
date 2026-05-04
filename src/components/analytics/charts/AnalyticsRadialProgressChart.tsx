import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

import { analyticsChartSeriesColors } from './analyticsChartConfig';

type AnalyticsRadialProgressChartProps = Readonly<{
  color?: string;
  label: string;
  primaryDetail: string;
  secondaryDetail: string;
  value: number | null;
  valueLabel: string;
}>;

const radialChartDataKey = 'value';
const radialChartName = 'Progress';
const radialChartMaxValue = 100;
const radialChartStartAngle = 180;
const radialChartEndAngle = 0;
const radialChartData = [{ name: radialChartName, value: 0 }];

function getChartData(value: number | null) {
  return [
    {
      name: radialChartName,
      value: value ?? 0,
    },
  ];
}

export default function AnalyticsRadialProgressChart({
  color = analyticsChartSeriesColors[2],
  label,
  primaryDetail,
  secondaryDetail,
  value,
  valueLabel,
}: AnalyticsRadialProgressChartProps) {
  const chartData = value === null ? radialChartData : getChartData(value);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-end">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="92%"
            innerRadius="72%"
            outerRadius="96%"
            startAngle={radialChartStartAngle}
            endAngle={radialChartEndAngle}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, radialChartMaxValue]}
              tick={false}
            />
            <RadialBar
              dataKey={radialChartDataKey}
              background={{ fill: 'var(--muted)' }}
              cornerRadius={8}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-col items-center px-4 text-center">
        <p className="text-2xl leading-none text-[var(--foreground)]">
          {valueLabel}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border pt-4 text-center">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {primaryDetail}
        </p>
        <p className="text-sm font-medium text-[var(--foreground)]">
          {secondaryDetail}
        </p>
      </div>
    </div>
  );
}
