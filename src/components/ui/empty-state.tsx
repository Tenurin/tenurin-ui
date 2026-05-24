import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type EmptyStateProps = Readonly<{
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  contentClassName?: string;
  iconContainerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}>;

const defaultIconContainerClassName =
  'flex h-16 w-16 items-center justify-center rounded-full border-2 border-neutral-300 dark:border-neutral-700';
const defaultTitleClassName =
  'mt-5 text-lg font-medium text-[var(--foreground)]';
const defaultDescriptionClassName =
  'mt-2 max-w-md text-sm text-muted-foreground';

export default function EmptyState({
  icon,
  title,
  description,
  className,
  contentClassName,
  iconContainerClassName,
  titleClassName,
  descriptionClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        className,
      )}
    >
      <div
        className={cn(defaultIconContainerClassName, iconContainerClassName)}
      >
        {icon}
      </div>
      <div className={contentClassName}>
        <h3 className={cn(defaultTitleClassName, titleClassName)}>{title}</h3>
        {description ? (
          <p className={cn(defaultDescriptionClassName, descriptionClassName)}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
