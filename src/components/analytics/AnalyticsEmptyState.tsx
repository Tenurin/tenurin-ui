import { BarChart3 } from 'lucide-react';

type AnalyticsEmptyStateProps = Readonly<{
  description: string;
  title: string;
}>;

/**
 * Quiet empty state for analytics panels: left-aligned copy and solid border.
 * Snapshot actions live on the analytics status banner, not here.
 */
export default function AnalyticsEmptyState({
  description,
  title,
}: AnalyticsEmptyStateProps) {
  return (
    <section className="rounded-sm border border-border bg-sidebar px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground"
          aria-hidden
        >
          <BarChart3 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-sm font-normal tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
