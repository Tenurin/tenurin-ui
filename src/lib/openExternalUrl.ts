/**
 * Opens a blank tab/window during a user gesture so a URL from an async request
 * can be loaded without mobile popup blockers (Safari, Chrome on iOS).
 */
export function openTransientBrowsingContext(): Window | null {
  try {
    return globalThis.open('about:blank', '_blank', 'noopener,noreferrer');
  } catch {
    return null;
  }
}

/**
 * Navigates a transient popup when available; otherwise uses same-tab navigation
 * (reliable on iOS Safari when popups are blocked).
 */
export function navigateToExternalUrl(
  url: string,
  popup: Window | null = null,
): void {
  if (popup && !popup.closed) {
    try {
      popup.location.replace(url);
      return;
    } catch {
      // Fall through to same-tab navigation.
    }
  }

  globalThis.location.assign(url);
}

/**
 * Closes a transient popup opened for an attachment/preview that failed.
 */
export function closeTransientBrowsingContext(popup: Window | null): void {
  if (popup && !popup.closed) {
    popup.close();
  }
}
