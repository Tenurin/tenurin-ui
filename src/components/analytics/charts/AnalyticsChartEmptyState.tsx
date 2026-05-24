import type { ReactNode } from 'react';

type AnalyticsChartEmptyStateProps = Readonly<{
  children: ReactNode;
}>;

export default function AnalyticsChartEmptyState({
  children,
}: AnalyticsChartEmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
