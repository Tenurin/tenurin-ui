import { isStaleChunkLoadError } from './staleChunkLoadError';

const TRANSIENT_DEV_HOOK_ERROR =
  /Cannot read properties of null \(reading 'use[A-Z][a-zA-Z]*'\)/;

/**
 * Detects short-lived render failures that only happen during Vite HMR or dep
 * re-optimization in local development.
 */
export function isTransientDevRenderError(error: unknown): boolean {
  if (!import.meta.env.DEV) {
    return false;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return (
    TRANSIENT_DEV_HOOK_ERROR.test(error.message) ||
    isStaleChunkLoadError(error)
  );
}
