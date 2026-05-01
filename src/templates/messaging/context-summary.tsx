import { AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import { MessagingSectionHeading } from './section-heading';
import type { MessagingContextSummaryData } from './types';

type MessagingContextSummaryProps = Readonly<{
  context: MessagingContextSummaryData;
  showTopDivider?: boolean;
}>;

export function MessagingContextSummary({
  context,
  showTopDivider = true,
}: MessagingContextSummaryProps) {
  return (
    <div
      className={cn(
        showTopDivider ? 'mt-5 border-t border-border/60 pt-5' : '',
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <MessagingSectionHeading title={context.sectionTitle} />
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.24em]',
            context.badgeToneClassName,
          )}
        >
          {context.badgeLabel}
        </Badge>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium tracking-[-0.03em] text-[var(--foreground)]">
            {context.title}
          </h3>
          {context.subtitle ? (
            <p className="text-sm text-muted-foreground">{context.subtitle}</p>
          ) : null}
        </div>

        {context.alert ? (
          <div className="flex items-start gap-2 text-sm ui-app-accent-negative-fg">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{context.alert}</p>
          </div>
        ) : null}

        <dl className="space-y-3 border-t border-border/60 pt-4">
          {context.rows.map((row) => {
            const RowIcon = row.icon;

            return (
              <div
                key={`${row.label}-${row.value}`}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3"
              >
                <dt className="text-xs text-muted-foreground">{row.label}</dt>
                <dd className="inline-flex min-w-0 items-center gap-2 whitespace-normal text-xs text-[var(--foreground)]">
                  <RowIcon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      row.iconClassName,
                    )}
                  />
                  <span className="min-w-0 break-words leading-5">
                    {row.value}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
