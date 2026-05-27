import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../../lib/utils';

type AnalyticsChartCardProps = Readonly<{
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  description: string;
  headerAction?: ReactNode;
  title: string;
}>;

export default function AnalyticsChartCard({
  children,
  className,
  contentClassName,
  contentStyle,
  description,
  headerAction,
  title,
}: AnalyticsChartCardProps) {
  const hasExplicitContentHeight = contentStyle?.height !== undefined;

  return (
    <section className={cn('bg-sidebar rounded-sm border p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-[var(--foreground)]">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {headerAction}
      </div>
      <div
        className={cn(
          hasExplicitContentHeight ? undefined : 'h-80',
          'min-w-0',
          contentClassName,
        )}
        style={contentStyle}
      >
        {children}
      </div>
    </section>
  );
}
