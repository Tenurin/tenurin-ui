import { useEffect, useMemo, useState } from 'react';

import { getAnalyticsCompletedRefreshCooldownRemainingMs } from './analyticsRefreshCooldown';

/**
 * Live remaining cooldown after a completed analytics snapshot. Ticks once per second while
 * active so the refresh control re-enables when the window ends without a full page reload.
 *
 * `tickCount` is read from the memo so React Compiler (and humans) cannot treat interval
 * updates as dead state — a `setTick` with an unused value risks a stuck UI.
 */
export function useAnalyticsCompletedRefreshCooldownRemainingMs(
  currentStatus: string | undefined,
  completedAt: string | undefined,
  cooldownMs: number,
): number {
  const [tickCount, setTickCount] = useState(0);

  const remainingMs = useMemo(() => {
    void tickCount;
    return getAnalyticsCompletedRefreshCooldownRemainingMs(
      currentStatus,
      completedAt,
      cooldownMs,
    );
  }, [tickCount, currentStatus, completedAt, cooldownMs]);

  const shouldTick = remainingMs > 0 && cooldownMs > 0;

  useEffect(() => {
    if (!shouldTick) {
      return;
    }
    const id = globalThis.setInterval(() => {
      setTickCount((n) => n + 1);
    }, 1_000);
    return () => globalThis.clearInterval(id);
  }, [shouldTick]);

  return remainingMs;
}
