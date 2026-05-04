export type AnalyticsPlacementStats = Readonly<{
  appliedStudents: number;
  placedStudents: number;
  placementPercentage: number | null;
}>;

export type AnalyticsPlacementBranchRow = AnalyticsPlacementStats &
  Readonly<{
    branchId: string;
    branchName: string;
    unplacedAppliedStudents: number;
  }>;
