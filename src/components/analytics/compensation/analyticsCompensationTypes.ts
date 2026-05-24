import type { CompensationFrequency } from '../../ui/compensation-frequency';

export type AnalyticsCompensationBranchRow = Readonly<{
  branchId: string;
  branchName: string;
  highest: number | null;
  lowest: number | null;
  mean: number | null;
  median: number | null;
}>;

export type AnalyticsCompensationMetric = Readonly<{
  description: string;
  displayValue?: string;
  frequency?: CompensationFrequency;
  label: string;
  listingHref?: string;
  secondaryValue?: string;
  studentName?: string;
  value: number | null;
}>;
