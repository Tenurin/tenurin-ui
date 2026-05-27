const STALE_CHUNK_LOAD_PATTERN =
  /(Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module)/i;

const RELOAD_STORAGE_KEY = 'tenurin-ui:stale-chunk-reload-at';
const RELOAD_COOLDOWN_MS = 30_000;

/**
 * Detects Vite/Rollup lazy-route failures after a deploy removes hashed chunks.
 */
export function isStaleChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return STALE_CHUNK_LOAD_PATTERN.test(message);
}

function isViteDevRuntime(): boolean {
  return (
    typeof import.meta !== 'undefined' &&
    'hot' in import.meta &&
    Boolean(import.meta.hot)
  );
}

/**
 * Reloads the page once so the browser picks up the current index.html and assets.
 * Returns false when a reload was already attempted recently (avoids infinite loops).
 */
export function reloadOnceForStaleChunk(): boolean {
  if (isViteDevRuntime()) {
    return false;
  }

  try {
    const lastReloadAt = sessionStorage.getItem(RELOAD_STORAGE_KEY);
    if (
      lastReloadAt != null &&
      Date.now() - Number(lastReloadAt) < RELOAD_COOLDOWN_MS
    ) {
      return false;
    }

    sessionStorage.setItem(RELOAD_STORAGE_KEY, String(Date.now()));
  } catch {
    // sessionStorage may be unavailable; still attempt a single reload.
  }

  globalThis.location.reload();
  return true;
}
