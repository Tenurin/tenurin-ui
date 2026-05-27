import { ExternalLink, Info } from 'lucide-react';
import { CompensationFrequencyPill } from '../../ui/compensation-frequency';
import { ResponsiveHint } from '../../ui/responsive-hint';

import { analyticsChartSeriesColors } from '../charts/analyticsChartConfig';
import { formatAnalyticsCurrencyAmount } from '../analyticsFormat';
import type { AnalyticsCompensationMetric } from './analyticsCompensationTypes';

type AnalyticsCompensationMetricCardProps = Readonly<{
  accentColor?: string;
  metric: AnalyticsCompensationMetric;
}>;

export default function AnalyticsCompensationMetricCard({
  accentColor = analyticsChartSeriesColors[0],
  metric,
}: AnalyticsCompensationMetricCardProps) {
  const displayValue =
    metric.displayValue ?? formatAnalyticsCurrencyAmount(metric.value);
  const hasFrequency = metric.value !== null && metric.frequency !== undefined;
  const hasFooter =
    metric.studentName !== undefined || metric.listingHref !== undefined;

  return (
    <article className="bg-sidebar relative flex min-h-32 min-w-0 flex-col overflow-hidden rounded-sm border p-4 pt-5">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-center gap-1.5">
        <p className="text-xs text-muted-foreground">{metric.label}</p>
        <ResponsiveHint
          side="top"
          content={metric.description}
          contentClassName="max-w-72 text-pretty"
        >
          <button
            type="button"
            className="inline-flex size-3.5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={`${metric.label} definition`}
          >
            <Info className="size-3.5" />
          </button>
        </ResponsiveHint>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pt-2">
        <span className="text-lg leading-tight font-medium tabular-nums text-[var(--foreground)] 2xl:text-xl">
          {displayValue}
        </span>
        {hasFrequency || metric.secondaryValue ? (
          <div className="flex flex-wrap items-center gap-2">
            {hasFrequency ? (
              <CompensationFrequencyPill frequency={metric.frequency} />
            ) : null}
            {metric.secondaryValue ? (
              <span className="text-xs text-muted-foreground">
                {metric.secondaryValue}
              </span>
            ) : null}
          </div>
        ) : null}

        {hasFooter ? (
          <div className="mt-auto flex min-h-5 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-1 text-xs">
            {metric.studentName ? (
              <span
                className="max-w-full truncate text-muted-foreground"
                title={metric.studentName}
              >
                {metric.studentName}
              </span>
            ) : null}
            {metric.listingHref ? (
              <a
                href={metric.listingHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
              >
                Open listing
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
