import MinimalListTable, {
  type MinimalListTableColumn,
} from '../../ui/minimal-list-table';

import { formatAnalyticsCurrency } from '../analyticsFormat';
import type { AnalyticsCompensationBranchRow } from './analyticsCompensationTypes';

type AnalyticsCompensationBranchTableProps = Readonly<{
  emptyDescription: string;
  emptyTitle: string;
  rows: readonly AnalyticsCompensationBranchRow[];
}>;

const compensationBranchColumns: readonly MinimalListTableColumn<AnalyticsCompensationBranchRow>[] =
  [
    {
      key: 'branchName',
      header: 'Branch',
      widthClassName: 'w-[32%]',
      cellClassName: 'max-w-0 py-2',
      loadingClassName: 'h-5 w-9/12',
      renderCell: (row) => (
        <span
          className="block truncate pr-3 text-sm font-medium text-[var(--foreground)]"
          title={row.branchName}
        >
          {row.branchName}
        </span>
      ),
    },
    getCurrencyColumn('highest', 'Highest'),
    getCurrencyColumn('lowest', 'Lowest'),
    getCurrencyColumn('mean', 'Mean'),
    getCurrencyColumn('median', 'Median'),
  ];

function getCurrencyColumn(
  key: keyof Pick<
    AnalyticsCompensationBranchRow,
    'highest' | 'lowest' | 'mean' | 'median'
  >,
  header: string,
): MinimalListTableColumn<AnalyticsCompensationBranchRow> {
  return {
    key,
    header,
    widthClassName: 'w-[17%]',
    cellClassName: 'py-2',
    loadingClassName: 'h-5 w-8/12',
    renderCell: (row) => (
      <span className="text-sm font-medium text-[var(--foreground)]">
        {formatAnalyticsCurrency(row[key])}
      </span>
    ),
  };
}

export default function AnalyticsCompensationBranchTable({
  emptyDescription,
  emptyTitle,
  rows,
}: AnalyticsCompensationBranchTableProps) {
  return (
    <MinimalListTable
      isPending={false}
      isError={false}
      pageSize={5}
      items={rows}
      columns={compensationBranchColumns}
      getItemKey={(row) => row.branchId}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      tableClassName="mt-0 min-w-[48rem] w-full table-fixed"
    />
  );
}
