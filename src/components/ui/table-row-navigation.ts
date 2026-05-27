import type { KeyboardEvent, MouseEvent } from 'react';

const INTERACTIVE_ROW_TARGET_SELECTOR =
  'a, button, input, select, textarea, [role="button"], [role="menuitem"], [data-row-action]';

/**
 * Returns true when the event target is an interactive control inside a table row.
 */
export function isInteractiveTableRowTarget(
  target: EventTarget | null,
): boolean {
  return (
    target instanceof Element &&
    Boolean(target.closest(INTERACTIVE_ROW_TARGET_SELECTOR))
  );
}

/**
 * Returns true when a row-level navigation handler should ignore this event.
 */
export function shouldIgnoreTableRowNavigation(
  event: MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>,
): boolean {
  if ('button' in event && event.button !== 0) {
    return true;
  }

  return isInteractiveTableRowTarget(event.target);
}
