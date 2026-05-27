import { useEffect, useState } from 'react';

export const MESSAGING_COMPACT_BREAKPOINT_PX = 1280;

const compactMediaQuery = `(max-width: ${MESSAGING_COMPACT_BREAKPOINT_PX - 1}px)`;

function readIsMessagingCompact(): boolean {
  if (typeof globalThis.matchMedia !== 'function') {
    return false;
  }

  return globalThis.matchMedia(compactMediaQuery).matches;
}

export function useIsMessagingCompact(): boolean {
  const [isCompact, setIsCompact] = useState(readIsMessagingCompact);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(compactMediaQuery);
    const updateCompactState = () => {
      setIsCompact(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', updateCompactState);
    updateCompactState();

    return () => mediaQuery.removeEventListener('change', updateCompactState);
  }, []);

  return isCompact;
}
