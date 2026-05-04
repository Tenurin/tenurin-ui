import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

import AnalyticsChartCard from '../charts/AnalyticsChartCard';
import AnalyticsComposedChart, {
  type AnalyticsComposedChartDatum,
  type AnalyticsComposedChartSeries,
} from '../charts/AnalyticsComposedChart';
import {
  analyticsChartSeriesColors,
  analyticsChartTabsListClassName,
  analyticsChartTabsTriggerClassName,
} from '../charts/analyticsChartConfig';
import { formatAnalyticsCurrency } from '../analyticsFormat';
import AnalyticsCompensationBranchTable from './AnalyticsCompensationBranchTable';
import AnalyticsCompensationMetricCard from './AnalyticsCompensationMetricCard';
import type {
  AnalyticsCompensationBranchRow,
  AnalyticsCompensationMetric,
} from './analyticsCompensationTypes';

type AnalyticsCompensationSectionProps = Readonly<{
  branchRows: readonly AnalyticsCompensationBranchRow[];
  chartDescription: string;
  chartEmptyMessage: string;
  chartTitle: string;
  metricCards: readonly AnalyticsCompensationMetric[];
  tableEmptyDescription: string;
  tableEmptyTitle: string;
}>;

const visualTabValue = 'visual';
const dataTabValue = 'data';
const compensationBranchXAxisKey = 'branchName';
const compensationBranchBarSeries: readonly AnalyticsComposedChartSeries[] = [
  { dataKey: 'highest', label: 'Highest' },
  { dataKey: 'lowest', label: 'Lowest' },
];
const compensationBranchLineSeries: readonly AnalyticsComposedChartSeries[] = [
  { dataKey: 'mean', label: 'Mean' },
  { dataKey: 'median', label: 'Median' },
];

function getCompensationBranchChartData(
  rows: readonly AnalyticsCompensationBranchRow[],
): AnalyticsComposedChartDatum[] {
  return rows.map((row) => ({
    branchName: row.branchName,
    highest: row.highest,
    lowest: row.lowest,
    mean: row.mean,
    median: row.median,
  }));
}

export default function AnalyticsCompensationSection({
  branchRows,
  chartDescription,
  chartEmptyMessage,
  chartTitle,
  metricCards,
  tableEmptyDescription,
  tableEmptyTitle,
}: AnalyticsCompensationSectionProps) {
  const chartData = getCompensationBranchChartData(branchRows);

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.15fr)_minmax(28rem,0.85fr)]">
      <Tabs
        defaultValue={visualTabValue}
        className="order-2 h-full min-w-0 gap-0 2xl:order-1"
      >
        <AnalyticsChartCard
          className="h-full"
          title={chartTitle}
          description={chartDescription}
          contentClassName="mt-4 h-[18rem]"
          headerAction={
            <TabsList className={analyticsChartTabsListClassName}>
              <TabsTrigger
                value={visualTabValue}
                className={analyticsChartTabsTriggerClassName}
              >
                Visual
              </TabsTrigger>
              <TabsTrigger
                value={dataTabValue}
                className={analyticsChartTabsTriggerClassName}
              >
                Data
              </TabsTrigger>
            </TabsList>
          }
        >
          <TabsContent value={visualTabValue} className="h-full">
            <AnalyticsComposedChart
              barSeries={compensationBranchBarSeries}
              data={chartData}
              emptyMessage={chartEmptyMessage}
              lineSeries={compensationBranchLineSeries}
              tooltipValueFormatter={formatAnalyticsCurrency}
              xDataKey={compensationBranchXAxisKey}
              yAxisTickFormatter={formatAnalyticsCurrency}
            />
          </TabsContent>
          <TabsContent value={dataTabValue} className="h-full overflow-auto">
            <AnalyticsCompensationBranchTable
              rows={branchRows}
              emptyTitle={tableEmptyTitle}
              emptyDescription={tableEmptyDescription}
            />
          </TabsContent>
        </AnalyticsChartCard>
      </Tabs>

      <div className="order-1 grid gap-6 sm:grid-cols-2 2xl:order-2">
        {metricCards.map((metric, index) => (
          <AnalyticsCompensationMetricCard
            key={metric.label}
            accentColor={analyticsChartSeriesColors[index]}
            metric={metric}
          />
        ))}
      </div>
    </div>
  );
}
