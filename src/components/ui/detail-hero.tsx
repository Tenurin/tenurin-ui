import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type DetailHeroProps = Readonly<{
  title: ReactNode;
  status?: ReactNode;
  eyebrow?: ReactNode;
  metadata?: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  actionClassName?: string;
}>;

type DetailHeroMetadataProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

type DetailHeroMetadataItemProps = Readonly<{
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}>;

export default function DetailHero({
  title,
  status,
  eyebrow,
  metadata,
  action,
  className,
  contentClassName,
  headerClassName,
  titleClassName,
  actionClassName,
}: DetailHeroProps) {
  const hasHeader = status != null || eyebrow != null;

  return (
    <section
      className={cn(
        'flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between',
        className,
      )}
    >
      <div
        className={cn(
          'min-w-0 max-w-6xl space-y-5 sm:space-y-6',
          contentClassName,
        )}
      >
        {hasHeader ? (
          <div
            className={cn('flex flex-wrap items-center gap-3', headerClassName)}
          >
            {status}
            {eyebrow}
          </div>
        ) : null}

        <div className="space-y-4 sm:space-y-5">
          <h1
            className={cn(
              'break-words text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-[2.5rem]',
              titleClassName,
            )}
          >
            {title}
          </h1>

          {metadata}
        </div>
      </div>

      {action ? (
        <div className={cn('shrink-0 pt-0 lg:pt-2', actionClassName)}>
          {action}
        </div>
      ) : null}
    </section>
  );
}

export function DetailHeroMetadata({
  children,
  className,
}: DetailHeroMetadataProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:gap-x-8 sm:gap-y-3 sm:text-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DetailHeroMetadataItem({
  icon,
  children,
  className,
}: DetailHeroMetadataItemProps) {
  return (
    <span
      className={cn(
        'inline-flex min-w-0 max-w-full items-center gap-2',
        className,
      )}
    >
      {icon}
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}
