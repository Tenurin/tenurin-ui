import type { ReactNode } from 'react';

type AnalyticsRefreshActionTooltipContentProps = Readonly<{
  disclaimer: ReactNode;
  cooldownRemainingMs: number;
}>;

function formatCooldownClock(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function AnalyticsRefreshActionTooltipContent({
  disclaimer,
  cooldownRemainingMs,
}: AnalyticsRefreshActionTooltipContentProps): ReactNode {
  if (cooldownRemainingMs <= 0) {
    return disclaimer;
  }

  return (
    <span className="flex max-w-sm flex-col gap-2 text-left text-pretty">
      <span>{disclaimer}</span>
      <span>
        Time until you can request another snapshot:{' '}
        <strong className="font-semibold">
          {formatCooldownClock(cooldownRemainingMs)}
        </strong>{' '}
        (minutes).
      </span>
    </span>
  );
}
