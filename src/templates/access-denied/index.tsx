'use client';

import type { ComponentProps, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

import { SurfaceCard } from '../../components/ui/surface-card';
import { cn } from '../../lib/utils';

export type AccessDeniedTemplateProps = Omit<
  ComponentProps<'div'>,
  'children' | 'title'
> &
  Readonly<{
    actions?: ReactNode;
    description?: ReactNode;
    detailDescription?: ReactNode;
    detailIcon?: ReactNode;
    detailTitle?: ReactNode;
    eyebrow?: ReactNode;
    icon?: ReactNode;
    title?: ReactNode;
  }>;

export function AccessDeniedTemplate({
  actions,
  className,
  description = 'Your current access does not include this area.',
  detailDescription = 'Ask an administrator to update your access if you need to use this page.',
  detailIcon,
  detailTitle = 'Access is restricted',
  eyebrow = 'Access control',
  icon = <ShieldAlert className="size-5" />,
  title = 'This area is unavailable',
  ...props
}: AccessDeniedTemplateProps) {
  return (
    <SurfaceCard
      className={cn('w-full max-w-xl p-6 shadow-sm', className)}
      {...props}
    >
      <div className="flex gap-4">
        <span className="ui-app-accent-warm-surface flex size-10 shrink-0 items-center justify-center rounded-sm border">
          {icon}
        </span>
        <div className="min-w-0 flex-1 space-y-5">
          <div className="min-w-0 space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {eyebrow}
            </p>
            <h1 className="text-xl font-medium leading-tight text-[var(--foreground)]">
              {title}
            </h1>
          </div>

          <div className="space-y-3">
            {description ? (
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}

            {detailTitle || detailDescription ? (
              <div className="flex gap-3 border-l border-border/70 pl-4">
                {detailIcon ? (
                  <span className="mt-0.5 shrink-0 text-muted-foreground">
                    {detailIcon}
                  </span>
                ) : null}
                <div className="min-w-0 space-y-1">
                  {detailTitle ? (
                    <p className="text-sm font-medium leading-5 text-[var(--foreground)]">
                      {detailTitle}
                    </p>
                  ) : null}
                  {detailDescription ? (
                    <p className="text-sm leading-5 text-muted-foreground">
                      {detailDescription}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          {actions ? (
            <div className="flex flex-wrap justify-end gap-3">{actions}</div>
          ) : null}
        </div>
      </div>
    </SurfaceCard>
  );
}
