import MinimalListTable, {
  type MinimalListTableColumn,
} from '../../ui/minimal-list-table';
import { MiddleTruncatedText } from '../../ui/middle-truncated-text';

import {
  formatAnalyticsCount,
  formatAnalyticsPercent,
} from '../analyticsFormat';
import type { AnalyticsPlacementBranchRow } from './analyticsPlacementTypes';

type AnalyticsPlacementBranchTableProps = Readonly<{
  emptyDescription: string;
  emptyTitle: string;
  rows: readonly AnalyticsPlacementBranchRow[];
}>;

const placementBranchColumns: readonly MinimalListTableColumn<AnalyticsPlacementBranchRow>[] =
  [
    {
      key: 'branchName',
      header: 'Branch',
      widthClassName: 'w-[40%]',
      cellClassName: 'max-w-0 py-2',
      loadingClassName: 'h-5 w-9/12',
      renderCell: (row) => (
        <MiddleTruncatedText
          text={row.branchName}
          className="pr-3 text-sm font-medium text-[var(--foreground)]"
          charWidthPx={7}
        />
      ),
    },
    {
      key: 'appliedStudents',
      header: 'Applied',
      widthClassName: 'w-[20%]',
      cellClassName: 'py-2',
      loadingClassName: 'h-5 w-8/12',
      renderCell: (row) => renderCount(row.appliedStudents),
    },
    {
      key: 'placedStudents',
      header: 'Placed',
      widthClassName: 'w-[20%]',
      cellClassName: 'py-2',
      loadingClassName: 'h-5 w-8/12',
      renderCell: (row) => renderCount(row.placedStudents),
    },
    {
      key: 'placementPercentage',
      header: 'Percentage',
      widthClassName: 'w-[20%]',
      cellClassName: 'py-2',
      loadingClassName: 'h-5 w-8/12',
      renderCell: (row) => renderPercent(row.placementPercentage),
    },
  ];

function renderCount(value: number) {
  return (
    <span className="text-sm font-medium text-[var(--foreground)]">
      {formatAnalyticsCount(value)}
    </span>
  );
}

function renderPercent(value: number | null) {
  return (
    <span className="text-sm font-medium text-[var(--foreground)]">
      {formatAnalyticsPercent(value)}
    </span>
  );
}

export default function AnalyticsPlacementBranchTable({
  emptyDescription,
  emptyTitle,
  rows,
}: AnalyticsPlacementBranchTableProps) {
  return (
    <MinimalListTable
      isPending={false}
      isError={false}
      pageSize={5}
      items={rows}
      columns={placementBranchColumns}
      getItemKey={(row) => row.branchId}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      tableClassName="mt-0 min-w-[42rem] w-full table-fixed"
    />
  );
}
