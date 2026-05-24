'use client';

import * as React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { Link, type To } from 'react-router';

import { Button } from '../../components/ui/button';
import { Logo } from '../../components/ui/logo';
import { cn } from '../../lib/utils';

type StatusPageTone = 'default' | 'negative' | 'positive' | 'warm';

const toneIconClassNames: Record<StatusPageTone, string> = {
  default: 'ui-app-accent-neutral-surface',
  negative: 'ui-app-accent-negative-surface',
  positive: 'ui-app-accent-positive-surface',
  warm: 'ui-app-accent-warm-surface',
};

const toneIcons: Record<Exclude<StatusPageTone, 'default'>, ReactNode> = {
  negative: React.createElement(CircleAlert, { className: 'size-7' }),
  positive: React.createElement(CircleCheck, { className: 'size-7' }),
  warm: React.createElement(TriangleAlert, { className: 'size-7' }),
};

export type StatusPageTemplateProps = Omit<
  ComponentProps<'section'>,
  'children' | 'title'
> &
  Readonly<{
    actionLabel?: ReactNode;
    actionTo?: To;
    contentClassName?: string;
    description?: ReactNode;
    icon?: ReactNode;
    minHeightClassName?: string;
    onAction?: () => void;
    showLogo?: boolean;
    title: ReactNode;
    tone?: StatusPageTone;
  }>;

function getStatusPageIcon(tone: StatusPageTone): ReactNode {
  if (tone === 'default') {
    return <Info className="size-7" />;
  }

  return toneIcons[tone];
}

export function StatusPageTemplate({
  actionLabel,
  actionTo,
  className,
  contentClassName,
  description,
  icon,
  minHeightClassName = 'min-h-screen',
  onAction,
  showLogo = true,
  title,
  tone = 'default',
  ...props
}: StatusPageTemplateProps) {
  const action =
    actionLabel && actionTo ? (
      <Button asChild className="h-11 rounded-sm px-6 text-sm">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
    ) : actionLabel ? (
      <Button
        type="button"
        onClick={onAction}
        className="h-11 rounded-sm px-6 text-sm"
      >
        {actionLabel}
      </Button>
    ) : null;

  return (
    <section
      data-slot="status-page-template"
      className={cn(
        'flex items-center justify-center bg-background px-6 py-12 text-foreground',
        minHeightClassName,
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-xl flex-col items-center text-center',
          contentClassName,
        )}
      >
        {showLogo ? (
          <Logo className="h-16 w-auto object-contain brightness-125" />
        ) : (
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-full border',
              toneIconClassNames[tone],
            )}
          >
            {icon ?? getStatusPageIcon(tone)}
          </div>
        )}

        <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-lg text-pretty text-sm leading-6 text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}

        {action ? <div className="mt-8">{action}</div> : null}
      </div>
    </section>
  );
}

export type { StatusPageTone };
