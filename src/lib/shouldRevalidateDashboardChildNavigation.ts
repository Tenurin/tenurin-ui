import type { ShouldRevalidateFunctionArgs } from 'react-router';

/**
 * Keeps dashboard loaders from re-running on in-dashboard child navigations,
 * which can briefly unmount route outlets during dev HMR.
 */
export function shouldRevalidateDashboardChildNavigation({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs): boolean {
  if (
    currentUrl.pathname.startsWith('/dashboard') &&
    nextUrl.pathname.startsWith('/dashboard')
  ) {
    return false;
  }

  return defaultShouldRevalidate;
}
