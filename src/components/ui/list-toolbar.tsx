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
        'flex w-full flex-col gap-4 bg-sidebar py-8 md:flex-row md:items-start md:gap-8',
        className,
      )}
    >
      <div
        className={cn(
          'min-w-0 w-full md:min-w-[24rem] md:max-w-[44rem] md:flex-1',
          searchSlotClassName,
        )}
      >
        {search}
      </div>
      <div
        className={cn(
          'flex w-full flex-col gap-4 md:w-auto md:flex-row md:flex-wrap md:items-start md:justify-start',
          sideSlotClassName,
        )}
      >
        {filter ? (
          <div className="w-full max-w-full flex-shrink-0 md:w-auto">
            {filter}
          </div>
        ) : null}
        {action ? <div className="flex-shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
