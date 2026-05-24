import { analyticsJobStatus } from './analyticsConstants';

/**
 * Milliseconds until a new analytics refresh can be queued after `completedAt`,
 * for a caller-supplied cooldown duration (typically matches the API completed-run window).
 */
export function getAnalyticsCompletedRefreshCooldownRemainingMs(
  currentStatus: string | undefined,
  completedAtIso: string | undefined | null,
  cooldownMs: number,
): number {
  if (
    cooldownMs <= 0 ||
    currentStatus !== analyticsJobStatus.completed ||
    !completedAtIso
  ) {
    return 0;
  }
  const completedMs = Date.parse(completedAtIso);
  if (Number.isNaN(completedMs)) {
    return 0;
  }
  const elapsed = Date.now() - completedMs;
  if (elapsed >= cooldownMs) {
    return 0;
  }
  return cooldownMs - elapsed;
}
