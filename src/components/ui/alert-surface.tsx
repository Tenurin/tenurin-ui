import type { ComponentProps, ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';

import { cn } from '../../lib/utils';

type AlertSurfaceTone = 'default' | 'negative' | 'warm' | 'positive' | 'info';

const alertSurfaceBaseClassName = 'rounded-sm border shadow-none';

const alertSurfaceLayoutClassName =
  'inline-grid w-fit max-w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 px-3 py-2';

const alertSurfaceToneClassNames: Record<AlertSurfaceTone, string> = {
  default:
    'ui-app-accent-warm-surface [&_[data-slot=alert-surface-icon]]:text-current',
  negative:
    'ui-app-accent-negative-surface [&_[data-slot=alert-surface-icon]]:text-current',
  warm:
    'ui-app-accent-warm-surface [&_[data-slot=alert-surface-icon]]:text-current',
  positive:
    'ui-app-accent-positive-surface [&_[data-slot=alert-surface-icon]]:text-current',
  info:
    'ui-app-accent-triad-c-surface [&_[data-slot=alert-surface-icon]]:text-current',
};

type AlertSurfaceProps = Omit<ComponentProps<'div'>, 'title'> &
  Readonly<{
    contentClassName?: string;
    description?: ReactNode;
    icon?: ReactNode;
    iconClassName?: string;
    title?: ReactNode;
    tone?: AlertSurfaceTone;
  }>;

function AlertSurface({
  children,
  className,
  contentClassName,
  description,
  icon = <CircleAlert />,
  iconClassName,
  role = 'alert',
  title,
  tone = 'default',
  ...props
}: AlertSurfaceProps) {
  const content = children ?? (
    <>
      {title ? (
        <div
          data-slot="alert-surface-title"
          className="text-sm font-medium leading-5 text-current"
        >
          {title}
        </div>
      ) : null}
      {description ? (
        <div
          data-slot="alert-surface-description"
          className="text-sm leading-5 text-current/80"
        >
          {description}
        </div>
      ) : null}
    </>
  );

  return (
    <div
      data-slot="alert-surface"
      role={role}
      className={cn(
        alertSurfaceBaseClassName,
        alertSurfaceLayoutClassName,
        alertSurfaceToneClassNames[tone],
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          data-slot="alert-surface-icon"
          className={cn(
            'col-start-1 row-start-1 mt-0.5 flex size-4 shrink-0 items-center justify-center self-start text-current [&_svg]:size-full',
            iconClassName,
          )}
        >
          {icon}
        </span>
      ) : null}
      <div
        data-slot="alert-surface-content"
        className={cn(
          'col-start-2 row-start-1 min-w-0 text-sm font-medium leading-5 text-current',
          icon == null && 'col-start-1',
          contentClassName,
        )}
      >
        {content}
      </div>
    </div>
  );
}

export {
  AlertSurface,
  alertSurfaceBaseClassName,
  alertSurfaceLayoutClassName,
  type AlertSurfaceProps,
  type AlertSurfaceTone,
};
