import { useEffect, useState } from 'react';

export const MESSAGING_COMPACT_BREAKPOINT_PX = 1280;

export function useIsMessagingCompact(): boolean {
  const [isCompact, setIsCompact] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(
      `(max-width: ${MESSAGING_COMPACT_BREAKPOINT_PX - 1}px)`,
    );
    const updateCompactState = () => {
      setIsCompact(globalThis.innerWidth < MESSAGING_COMPACT_BREAKPOINT_PX);
    };

    mediaQuery.addEventListener('change', updateCompactState);
    updateCompactState();

    return () => mediaQuery.removeEventListener('change', updateCompactState);
  }, []);

  return !!isCompact;
}
