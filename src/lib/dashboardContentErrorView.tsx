import DefaultLoader from '../components/ui/default-loader';
import { isTransientDevRenderError } from './transientDevRenderError';

/**
 * Renders dashboard content-column error UI from a route error value.
 */
export function DashboardContentErrorView({
  error,
}: Readonly<{ error: unknown }>) {
  if (isTransientDevRenderError(error)) {
    return <DefaultLoader />;
  }

  const message =
    error instanceof Error
      ? error.message
      : 'Something went wrong loading this page.';

  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-background px-6 py-16">
      <p className="max-w-md text-center text-sm leading-7 text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
