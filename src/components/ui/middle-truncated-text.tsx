'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '../../lib/utils';
import {
  defaultTruncateMiddleMaxChars,
  truncateMiddle,
} from '../../lib/truncateMiddle';

export type MiddleTruncatedTextProps = Readonly<{
  text: string;
  className?: string;
  /**
   * Rough average pixels per character at the applied font size (Inter, Latin).
   * Tune slightly down for dense glyphs or monospace.
   */
  charWidthPx?: number;
  /** Lower bound for the computed character budget from width. */
  minChars?: number;
  /** Upper bound so very wide cells do not render enormous strings. */
  maxChars?: number;
  /**
   * When false, skips `ResizeObserver` and uses `defaultTruncateMiddleMaxChars`
   * as the character budget.
   */
  measureWidth?: boolean;
}>;

/**
 * Single-line label that applies `truncateMiddle` with a character budget
 * derived from the element width (`ResizeObserver`), so middle ellipsis tracks
 * resizable table columns and viewport changes.
 *
 * Avoid for **currency or numeric ranges** in very narrow cells: the width →
 * character estimate can be too small, and middle ellipsis may hide the amounts
 * (keep those as start-visible `truncate` + `title` instead).
 */
export function MiddleTruncatedText({
  text,
  className,
  charWidthPx = 7,
  minChars = 6,
  maxChars = 96,
  measureWidth = true,
}: MiddleTruncatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [charBudget, setCharBudget] = useState(defaultTruncateMiddleMaxChars);

  useLayoutEffect(() => {
    if (!measureWidth || typeof ResizeObserver === 'undefined') {
      setCharBudget(defaultTruncateMiddleMaxChars);
      return undefined;
    }

    const el = ref.current;
    if (!el) {
      return undefined;
    }

    const update = () => {
      const width = el.clientWidth;
      if (width <= 0) {
        setCharBudget(defaultTruncateMiddleMaxChars);
        return;
      }
      const estimated = Math.floor(width / charWidthPx);
      setCharBudget(Math.min(maxChars, Math.max(minChars, estimated)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, charWidthPx, minChars, maxChars, measureWidth]);

  const display = truncateMiddle(text, charBudget);

  return (
    <span
      ref={ref}
      className={cn(
        'flex min-h-4 min-w-0 w-full items-center whitespace-nowrap text-start leading-none',
        className,
      )}
      title={text}
    >
      {display}
    </span>
  );
}
