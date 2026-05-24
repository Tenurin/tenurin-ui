import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';

import { cn } from '../../lib/utils';
import { MiddleTruncatedText } from './middle-truncated-text';
import { RESIZABLE_TABLE_HEADER_LABEL_ATTRIBUTE } from './table-column-resizing-utils';

type ResizableTableHeaderContentProps = Readonly<{
  children: ReactNode;
  columnId: string;
  enabled: boolean;
  label: string;
  onResizePointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    columnId: string,
  ) => void;
  onResizeKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    columnId: string,
  ) => void;
}>;

function getHeaderLabelText(children: ReactNode): string | undefined {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  return undefined;
}

function renderHeaderLabel(children: ReactNode): ReactNode {
  const headerText = getHeaderLabelText(children);

  if (headerText === undefined) {
    return (
      <span
        {...{ [RESIZABLE_TABLE_HEADER_LABEL_ATTRIBUTE]: '' }}
        className="min-w-0 whitespace-nowrap leading-snug"
      >
        {children}
      </span>
    );
  }

  return (
    <span
      {...{ [RESIZABLE_TABLE_HEADER_LABEL_ATTRIBUTE]: '' }}
      className="block min-w-0 flex-1"
    >
      <MiddleTruncatedText
        text={headerText}
        className="min-w-0 leading-snug"
        measureWidth
      />
    </span>
  );
}

export function ResizableTableHeaderContent({
  children,
  columnId,
  enabled,
  label,
  onResizePointerDown,
  onResizeKeyDown,
}: ResizableTableHeaderContentProps) {
  return (
    <div
      className={cn(
        'relative -mx-2 flex min-w-0 items-center px-2',
        enabled ? 'pr-5' : undefined,
      )}
    >
      {renderHeaderLabel(children)}
      {enabled ? (
        <button
          type="button"
          aria-label={`Resize ${label} column`}
          aria-orientation="vertical"
          role="separator"
          className={cn(
            'absolute inset-y-0 right-0 z-20 w-3 cursor-col-resize touch-none',
            'bg-transparent outline-none select-none',
            'after:absolute after:inset-y-2 after:left-1/2 after:w-px',
            'after:-translate-x-1/2 after:bg-border after:opacity-0',
            'hover:after:opacity-100 focus-visible:after:opacity-100',
          )}
          onPointerDown={(event) => onResizePointerDown(event, columnId)}
          onKeyDown={(event) => onResizeKeyDown(event, columnId)}
        />
      ) : null}
    </div>
  );
}
