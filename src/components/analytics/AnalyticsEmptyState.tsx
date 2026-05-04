import { BarChart3 } from 'lucide-react';

type AnalyticsEmptyStateProps = Readonly<{
  description: string;
  title: string;
}>;

export default function AnalyticsEmptyState({
  description,
  title,
}: AnalyticsEmptyStateProps) {
  return (
    <section className="ui-app-accent-neutral-header-surface rounded-sm border border-dashed px-6 py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <div className="ui-app-accent-cool-surface flex h-12 w-12 items-center justify-center rounded-full border">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-medium text-[var(--foreground)]">
          {title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
