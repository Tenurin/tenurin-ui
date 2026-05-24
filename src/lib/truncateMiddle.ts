export type TruncateMiddleOptions = Readonly<{
  /**
   * When true (default), surrounding whitespace is removed before measuring.
   * Set false to preserve leading/trailing spaces in the result.
   */
  trim?: boolean;
}>;

/** Default cap when `truncateMiddle` is called without a second argument. */
export const defaultTruncateMiddleMaxChars = 18;

/**
 * Returns `text` shortened with `...` in the middle when it is longer than
 * `maxChars`, keeping both the start and end visible. Otherwise returns `text`
 * unchanged (aside from optional trimming). Not tied to any UI or domain.
 *
 * **Contract**
 *
 * - `maxChars` is the maximum **returned** string length, including the three
 *   ASCII dots (`...`). If `text` fits within that budget, it is returned as-is.
 * - Length is JavaScript **UTF-16 code units** (what `String.prototype.length`
 *   uses), not grapheme clusters. Surrogate pairs (many emoji) count as 2.
 * - This does not measure **pixel width**; pair with `MiddleTruncatedText` when
 *   the cap should follow a container width.
 *
 * @param maxChars - Defaults to {@link defaultTruncateMiddleMaxChars}. To pass only
 *   `options`, use an explicit length, e.g.
 *   `truncateMiddle(text, defaultTruncateMiddleMaxChars, { trim: false })`.
 *
 * @example
 * truncateMiddle('Internship + full-time')
 * // => 'Internsh...ll-time' (uses default max length)
 *
 * @example
 * truncateMiddle('Internship + full-time', 24)
 * // => 'Internship + full-time' (fits within 24)
 */
export function truncateMiddle(
  text: string,
  maxChars: number = defaultTruncateMiddleMaxChars,
  options?: TruncateMiddleOptions,
): string {
  const shouldTrim = options?.trim !== false;
  const t = shouldTrim ? text.trim() : text;
  const limit = Math.floor(maxChars);

  if (!Number.isFinite(limit) || limit < 1) {
    return t;
  }
  if (t.length <= limit) {
    return t;
  }
  if (limit < 5) {
    return `${t.slice(0, Math.max(0, limit - 1))}…`;
  }
  const leftLen = Math.ceil((limit - 3) / 2);
  const rightLen = Math.floor((limit - 3) / 2);
  return `${t.slice(0, leftLen)}...${t.slice(t.length - rightLen)}`;
}
