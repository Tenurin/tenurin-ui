import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

export type PolicySummaryMetric = Readonly<{
  label: string;
  value: ReactNode;
}>;

type PolicySummaryCardProps = Readonly<{
  children?: ReactNode;
  className?: string;
  description?: string | null;
  headerAside?: ReactNode;
  metrics?: readonly PolicySummaryMetric[];
  stage?: string;
  title: string;
}>;

/**
 * Compact placement-policy card shell shared across student and college dashboards.
 */
export function PolicySummaryCard({
  children,
  className,
  description,
  headerAside,
  metrics = [],
  stage,
  title,
}: PolicySummaryCardProps) {
  const hasMetrics = metrics.length > 0;

  return (
    <div
      className={cn(
        'rounded-sm border border-border/60 bg-background/70 p-5',
        className,
      )}
    >
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <p className="min-w-0 w-full flex-1 text-base font-medium leading-tight">
          {title}
        </p>
        {headerAside ? (
          <div className="shrink-0">{headerAside}</div>
        ) : null}
      </div>
      {description ? (
        <p className="mt-3 text-xs text-muted-foreground">{description}</p>
      ) : null}
      {stage ? (
        <p className="mt-2 text-[10px] uppercase tracking-[0.10em]">
          Stage: {stage}
        </p>
      ) : null}
      {hasMetrics ? (
        <div className="mt-4 space-y-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between gap-4"
            >
              <p className="text-[10px] uppercase tracking-[0.10em] text-muted-foreground/75">
                {metric.label}
              </p>
              <p className="text-sm leading-none text-[var(--foreground)]">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
