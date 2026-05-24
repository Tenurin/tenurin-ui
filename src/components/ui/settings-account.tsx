'use client';

import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';

import { badgeVariants } from './badge';
import { cn } from '../../lib/utils';

/** Default account-settings panel (linked emails, reset password, etc.). */
export const settingsAccountSectionSurfaceClassName =
  'rounded-sm border border-sidebar-border bg-sidebar p-6';

/** Delete-account panel: same neutral surface as other settings rows, with a destructive left accent only. */
export const settingsAccountDangerSurfaceClassName =
  'rounded-sm border border-sidebar-border border-l-2 border-l-destructive bg-sidebar p-6';

/** Quiet `DialogTitle` for account-settings modals (small, regular weight). */
export const settingsAccountDialogTitleClassName =
  'text-lg font-normal tracking-[-0.02em]';

/** Destructive account dialog title (delete account confirmation). */
export const settingsAccountDialogDangerTitleClassName =
  'text-sm font-normal tracking-[-0.02em] text-destructive';

/**
 * Linked-email row: compact chip trigger (use on a `button` with a truncated label + optional chevron).
 */
export const settingsAccountLinkedEmailChipClassName = cn(
  badgeVariants({ variant: 'outline' }),
  'inline-flex h-7 max-w-[min(100%,20rem)] min-h-7 min-w-0 cursor-pointer items-center gap-1 rounded-sm border-border/60 bg-muted/15 py-0 pl-2 pr-1 font-normal text-foreground shadow-none hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
);

export type SettingsAccountRootProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

/**
 * Vertical stack for account settings tab sections (spacing only).
 */
export function SettingsAccountRoot({ children, className }: SettingsAccountRootProps) {
  return <div className={cn('space-y-5', className)}>{children}</div>;
}

export type SettingsAccountSectionVariant = 'default' | 'danger';

export type SettingsAccountSectionProps = Readonly<{
  children: ReactNode;
  /** Shown below the title with a leading alert icon. */
  description?: ReactNode;
  headingSpacing?: 'comfortable' | 'compact';
  icon: ReactNode;
  sectionClassName?: string;
  title: ReactNode;
  variant?: SettingsAccountSectionVariant;
}>;

/**
 * Presentation-only section for dashboard account settings.
 * Apps supply `children` (forms, dialogs, lists); keep API calls in app code.
 */
export function SettingsAccountSection({
  children,
  description,
  headingSpacing = 'compact',
  icon,
  sectionClassName,
  title,
  variant = 'default',
}: SettingsAccountSectionProps) {
  const isDanger = variant === 'danger';
  const surfaceClassName =
    sectionClassName ??
    (isDanger
      ? settingsAccountDangerSurfaceClassName
      : settingsAccountSectionSurfaceClassName);

  return (
    <section className={surfaceClassName}>
      <div
        className={cn(
          'flex items-center gap-2.5',
          headingSpacing === 'comfortable' ? 'mb-5' : 'mb-4',
        )}
      >
        <span
          className={cn(
            'flex shrink-0 [&>svg]:h-4 [&>svg]:w-4',
            isDanger ? 'text-foreground' : '',
          )}
        >
          {icon}
        </span>
        <h2
          className={cn(
            'text-sm font-medium',
            isDanger ? 'text-foreground' : '',
          )}
        >
          {title}
        </h2>
      </div>

      {description != null ? (
        <p
          className="mb-4 flex items-center gap-2 text-xs"
        >
          <CircleAlert
            className="text-foreground size-3.5"
            aria-hidden />
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}
