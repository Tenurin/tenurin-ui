import * as React from 'react';

const MOBILE_BREAKPOINT = 1024;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function getMobileMatches(): boolean {
  if (typeof globalThis.window === 'undefined') {
    return false;
  }

  return globalThis.window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

function subscribeMobile(onStoreChange: () => void): () => void {
  if (typeof globalThis.window === 'undefined') {
    return () => {};
  }

  const mql = globalThis.window.matchMedia(MOBILE_MEDIA_QUERY);
  const notify = () => {
    onStoreChange();
  };

  mql.addEventListener('change', notify);
  globalThis.window.addEventListener('resize', notify);

  return () => {
    mql.removeEventListener('change', notify);
    globalThis.window.removeEventListener('resize', notify);
  };
}

/**
 * True when the viewport is below the large breakpoint (under 1024px width).
 * Uses `matchMedia` plus `resize` so the value tracks real layout, not a one-shot `innerWidth` read.
 */
export function useIsMobile(): boolean {
  return React.useSyncExternalStore(
    subscribeMobile,
    getMobileMatches,
    () => false,
  );
}
