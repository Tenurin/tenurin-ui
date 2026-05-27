import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

import AnalyticsChartCard from '../charts/AnalyticsChartCard';
import AnalyticsRadialProgressChart from '../charts/AnalyticsRadialProgressChart';
import AnalyticsStackedBarChart, {
  type AnalyticsStackedBarChartDatum,
  type AnalyticsStackedBarChartSeries,
} from '../charts/AnalyticsStackedBarChart';
import { getAnalyticsBranchChartMinHeight } from '../charts/analyticsBranchChartAxis';
import {
  analyticsChartTabsListClassName,
  analyticsChartTabsTriggerClassName,
} from '../charts/analyticsChartConfig';
import {
  formatAnalyticsCount,
  formatAnalyticsPercent,
} from '../analyticsFormat';
import AnalyticsPlacementBranchTable from './AnalyticsPlacementBranchTable';
import type {
  AnalyticsPlacementBranchRow,
  AnalyticsPlacementStats,
} from './analyticsPlacementTypes';

type AnalyticsPlacementSectionProps = Readonly<{
  branchRows: readonly AnalyticsPlacementBranchRow[];
  chartDescription: string;
  chartEmptyMessage: string;
  chartTitle: string;
  overall: AnalyticsPlacementStats;
  radialDescription: string;
  radialLabel: string;
  radialTitle: string;
  tableEmptyDescription: string;
  tableEmptyTitle: string;
}>;

const visualTabValue = 'visual';
const dataTabValue = 'data';
const placementBranchXAxisKey = 'branchName';
const placementRadialContentClassName = 'mt-4 h-[18rem]';
const placementBranchSeries: readonly AnalyticsStackedBarChartSeries[] = [
  { dataKey: 'placedStudents', label: 'Placed' },
  { dataKey: 'unplacedAppliedStudents', label: 'Applied but not placed' },
];

function getPlacementBranchChartData(
  rows: readonly AnalyticsPlacementBranchRow[],
): AnalyticsStackedBarChartDatum[] {
  return rows.map((row) => ({
    branchName: row.branchName,
    placedStudents: row.placedStudents,
    unplacedAppliedStudents: row.unplacedAppliedStudents,
  }));
}

export default function AnalyticsPlacementSection({
  branchRows,
  chartDescription,
  chartEmptyMessage,
  chartTitle,
  overall,
  radialDescription,
  radialLabel,
  radialTitle,
  tableEmptyDescription,
  tableEmptyTitle,
}: AnalyticsPlacementSectionProps) {
  const chartData = getPlacementBranchChartData(branchRows);
  const chartHeight = getAnalyticsBranchChartMinHeight(chartData.length);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(16rem,1fr)]">
      <Tabs defaultValue={visualTabValue} className="min-w-0 gap-0">
        <AnalyticsChartCard
          title={chartTitle}
          description={chartDescription}
          contentClassName="mt-4"
          contentStyle={{ height: chartHeight }}
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
            <AnalyticsStackedBarChart
              data={chartData}
              emptyMessage={chartEmptyMessage}
              series={placementBranchSeries}
              tooltipValueFormatter={formatAnalyticsCount}
              xDataKey={placementBranchXAxisKey}
              yAxisTickFormatter={formatAnalyticsCount}
            />
          </TabsContent>
          <TabsContent value={dataTabValue} className="h-full overflow-auto">
            <AnalyticsPlacementBranchTable
              rows={branchRows}
              emptyTitle={tableEmptyTitle}
              emptyDescription={tableEmptyDescription}
            />
          </TabsContent>
        </AnalyticsChartCard>
      </Tabs>

      <AnalyticsChartCard
        className="self-start"
        title={radialTitle}
        description={radialDescription}
        contentClassName={placementRadialContentClassName}
      >
        <AnalyticsRadialProgressChart
          label={radialLabel}
          primaryDetail={`${formatAnalyticsCount(overall.placedStudents)} placed`}
          secondaryDetail={`${formatAnalyticsCount(overall.appliedStudents)} applied`}
          value={overall.placementPercentage}
          valueLabel={formatAnalyticsPercent(overall.placementPercentage)}
        />
      </AnalyticsChartCard>
    </div>
  );
}
