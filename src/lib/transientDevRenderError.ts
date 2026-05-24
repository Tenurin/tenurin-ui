const TRANSIENT_DEV_HOOK_ERROR =
  /Cannot read properties of null \(reading 'use[A-Z][a-zA-Z]*'\)/;

const TRANSIENT_DEV_IMPORT_ERROR =
  /(Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module)/i;

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
    TRANSIENT_DEV_IMPORT_ERROR.test(error.message)
  );
}
