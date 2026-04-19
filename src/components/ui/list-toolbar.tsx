import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type ListToolbarProps = Readonly<{
  search: ReactNode;
  filter?: ReactNode;
  action?: ReactNode;
  className?: string;
  searchSlotClassName?: string;
  sideSlotClassName?: string;
}>;

export default function ListToolbar({
  search,
  filter,
  action,
  className,
  searchSlotClassName,
  sideSlotClassName,
}: ListToolbarProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 bg-sidebar py-8 md:flex-row md:gap-8',
        className,
      )}
    >
      <div className={cn('min-w-0 w-full md:w-3/5', searchSlotClassName)}>
        {search}
      </div>
      <div
        className={cn(
          'flex w-full flex-col gap-4 md:ml-auto md:w-auto md:flex-row md:items-center md:justify-end',
          sideSlotClassName,
        )}
      >
        {filter ? <div className="flex-shrink-0 w-fit max-w-full">{filter}</div> : null}
        {action ? <div className="flex-shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
