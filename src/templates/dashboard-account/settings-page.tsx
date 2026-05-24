'use client';

import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

const defaultSettingsTitle = 'Settings';
const defaultSettingsDescription =
  'Manage your account preferences and security.';

export type DashboardSettingsPageTemplateProps = Readonly<{
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  title?: ReactNode;
}>;

/**
 * Shared dashboard Settings route chrome (max width, heading, body slot).
 * Apps supply tab content and account mutations as `children`.
 */
export function DashboardSettingsPageTemplate({
  children,
  className,
  description = defaultSettingsDescription,
  title = defaultSettingsTitle,
}: DashboardSettingsPageTemplateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-3xl px-6 py-8', className)}>
      <div className="mb-8">
        <h1 className="text-2xl tracking-[-0.03em] text-[var(--foreground)]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
