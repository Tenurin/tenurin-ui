import type { ComponentProps, ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';

import { cn } from '../../lib/utils';

type AlertSurfaceTone = 'default' | 'negative' | 'warm' | 'positive';

const alertSurfaceBaseClassName =
  'rounded-sm border shadow-none';

const alertSurfaceToneClassNames: Record<AlertSurfaceTone, string> = {
  default:
    'ui-app-accent-warm-surface [&_[data-slot=alert-surface-icon]]:text-current',
  negative:
    'ui-app-accent-negative-surface [&_[data-slot=alert-surface-icon]]:text-current',
  warm:
    'ui-app-accent-warm-surface [&_[data-slot=alert-surface-icon]]:text-current',
  positive:
    'ui-app-accent-positive-surface [&_[data-slot=alert-surface-icon]]:text-current',
};

type AlertSurfaceProps = Omit<ComponentProps<'div'>, 'title'> &
  Readonly<{
    contentClassName?: string;
    description?: ReactNode;
    icon?: ReactNode;
    title?: ReactNode;
    tone?: AlertSurfaceTone;
  }>;

function AlertSurface({
  children,
  className,
  contentClassName,
  description,
  icon = <CircleAlert className="size-5" />,
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
          className="text-base font-medium leading-6 text-current"
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
        alertSurfaceToneClassNames[tone],
        'flex w-full items-center gap-3 px-5 py-4',
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          data-slot="alert-surface-icon"
          className="shrink-0 text-current"
        >
          {icon}
        </span>
      ) : null}
      <div
        data-slot="alert-surface-content"
        className={cn(
          'min-w-0 text-sm font-medium leading-6 text-current',
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
  type AlertSurfaceProps,
  type AlertSurfaceTone,
};
