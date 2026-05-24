import { Suspense } from 'react';
import { Outlet, useRouteError } from 'react-router';
import { cn } from '../../lib/utils';
import { DashboardContentErrorView } from '../../lib/dashboardContentErrorView';

export { DashboardContentErrorView } from '../../lib/dashboardContentErrorView';
export { shouldRevalidateDashboardChildNavigation } from '../../lib/shouldRevalidateDashboardChildNavigation';

type DefaultLoaderProps = Readonly<{
  label?: string;
}>;

export function DefaultLoader({ label = 'Loading...' }: DefaultLoaderProps) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full flex-1 items-center justify-center bg-background px-6 py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="loader-mark-turn relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--foreground)_14%,transparent)]" />
          <div className="absolute inset-0 animate-pulse rounded-full bg-[radial-gradient(circle_at_35%_35%,color-mix(in_oklab,var(--foreground)_28%,transparent)_0,color-mix(in_oklab,var(--foreground)_20%,transparent)_48%,transparent_48%)]" />
          <div className="absolute inset-[18%] rounded-full bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--foreground)_30%,transparent)_0_4px,transparent_4px_8px)] opacity-80 [clip-path:polygon(0_44%,58%_100%,0_100%)]" />
        </div>

        <p className="text-lg font-medium tracking-[-0.02em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

type DashboardContentLayoutProps = Readonly<{
  className?: string;
}>;

/**
 * Dashboard main content shell. Keeps a themed surface behind lazy route outlets
 * without replacing the sidebar/header when child routes load.
 */
export function DashboardContentLayout({
  className,
}: DashboardContentLayoutProps) {
  return (
    <div
      className={cn(
        'relative min-h-[calc(100svh-4rem)] bg-background',
        className,
      )}
    >
      <Suspense fallback={<DefaultLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

/**
 * Error UI for dashboard child routes. Renders inside the content column only so
 * the sidebar and header stay mounted.
 */
export function DashboardContentError() {
  const error = useRouteError();

  return <DashboardContentErrorView error={error} />;
}

/** @deprecated Use {@link DashboardContentLayout} */
export const DashboardRouteOutlet = DashboardContentLayout;

export default DefaultLoader;
