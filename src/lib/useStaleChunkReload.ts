'use client';

import { useEffect } from 'react';

import {
  isStaleChunkLoadError,
  reloadOnceForStaleChunk,
} from './staleChunkLoadError';

/**
 * Triggers a one-time full reload when a lazy route chunk from a previous deploy fails to load.
 */
export function useStaleChunkReload(error: unknown): boolean {
  const isStaleChunk = isStaleChunkLoadError(error);

  useEffect(() => {
    if (isStaleChunk) {
      reloadOnceForStaleChunk();
    }
  }, [error, isStaleChunk]);

  return isStaleChunk;
}
