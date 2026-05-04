export const analyticsJobStatus = {
  none: '',
  pending: 'pending',
  processing: 'processing',
  completed: 'completed',
  failed: 'failed',
} as const;

export type AnalyticsJobStatus =
  (typeof analyticsJobStatus)[keyof typeof analyticsJobStatus];

export const analyticsPollingIntervalMs = 5_000;

export const runningAnalyticsJobStatuses = new Set<string>([
  analyticsJobStatus.pending,
  analyticsJobStatus.processing,
]);

export const staleSnapshotAnalyticsJobStatuses = new Set<string>([
  analyticsJobStatus.pending,
  analyticsJobStatus.processing,
  analyticsJobStatus.failed,
]);

export const analyticsSnapshotDisclaimer =
  'Analytics are shown from the latest stored snapshot. If a refresh is pending, processing, or failed, the numbers below may reflect the previous successful refresh.';

export const listingAnalyticsSnapshotDisclaimer = analyticsSnapshotDisclaimer;

export const batchAnalyticsSnapshotDisclaimer = analyticsSnapshotDisclaimer;
