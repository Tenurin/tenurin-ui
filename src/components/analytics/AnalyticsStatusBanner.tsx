import type { ReactNode } from 'react';
import { Clock3, CircleAlert, CircleCheck, Info, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';

import { analyticsJobStatus } from './analyticsConstants';

type AnalyticsStatusTone = 'neutral' | 'positive' | 'warm' | 'negative';

type AnalyticsStatusBannerProps = Readonly<{
  actionLabel: string;
  actionTooltip?: ReactNode;
  description: ReactNode;
  isActionDisabled?: boolean;
  isActionPending?: boolean;
  label: string;
  metadata?: readonly string[];
  onAction: () => void;
  status: string;
}>;

const statusBadgeToneClassNames: Record<AnalyticsStatusTone, string> = {
  neutral: 'ui-app-accent-neutral-surface',
  positive: 'ui-app-accent-positive-surface',
  warm: 'ui-app-accent-warm-surface',
  negative: 'ui-app-accent-negative-surface',
};

function getStatusTone(status: string): AnalyticsStatusTone {
  switch (status) {
    case analyticsJobStatus.completed:
      return 'positive';
    case analyticsJobStatus.pending:
    case analyticsJobStatus.processing:
      return 'warm';
    case analyticsJobStatus.failed:
      return 'negative';
    default:
      return 'neutral';
  }
}

function getStatusIcon(status: string): ReactNode {
  switch (status) {
    case analyticsJobStatus.completed:
      return <CircleCheck className="h-4 w-4" />;
    case analyticsJobStatus.processing:
      return <Loader2 className="h-4 w-4 animate-spin" />;
    case analyticsJobStatus.failed:
      return <CircleAlert className="h-4 w-4" />;
    default:
      return <Clock3 className="h-4 w-4" />;
  }
}

export default function AnalyticsStatusBanner({
  actionLabel,
  actionTooltip,
  description,
  isActionDisabled = false,
  isActionPending = false,
  label,
  metadata = [],
  onAction,
  status,
}: AnalyticsStatusBannerProps) {
  const tone = getStatusTone(status);
  const buttonLabel = isActionPending ? 'Requesting...' : actionLabel;
  const isButtonDisabled = isActionDisabled || isActionPending;

  const actionButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="ui-app-accent-neutral-surface font-normal w-fit rounded-sm disabled:text-muted-foreground disabled:opacity-70"
      disabled={isButtonDisabled}
      onClick={onAction}
    >
      {isActionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {buttonLabel}
      {actionTooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label={`${actionLabel} note`}
            >
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm text-pretty">
            {actionTooltip}
          </TooltipContent>
        </Tooltip>
      ) : null}
    </Button>
  );

  return (
    <section className="bg-sidebar flex min-h-16 items-center rounded-sm border-1 px-5 py-4">
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <Badge
            variant="outline"
            className={cn(
              'h-8 rounded-sm px-2.5 py-0 text-[11px] uppercase tracking-[0.16em]',
              statusBadgeToneClassNames[tone],
            )}
          >
            {getStatusIcon(status)}
            {label}
          </Badge>
          <span className="text-sm leading-5 text-[var(--foreground)]">
            {description}
          </span>
          {metadata.map((item) => (
            <span
              key={item}
              className="text-xs leading-5 text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex w-fit items-center gap-2">{actionButton}</div>
      </div>
    </section>
  );
}
