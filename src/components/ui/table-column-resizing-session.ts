import type { PointerEvent as ReactPointerEvent } from 'react';

import {
  getResizedColumnWidths,
  type ColumnMinimumWidthResolver,
} from './table-column-resizing-measurement';
import type {
  ColumnResizeSession,
  ColumnWidthMap,
} from './table-column-resizing-utils';

type StartColumnResizeSessionOptions = Readonly<{
  adjacentColumnId: string;
  adjacentColumnWidth: number;
  columnId: string;
  columnWidth: number;
  event: ReactPointerEvent<HTMLButtonElement>;
  measuredMinimumWidths: ColumnWidthMap;
  onEnd: () => void;
  onResize: (widths: ColumnWidthMap) => void;
  resolveMinimumWidth: ColumnMinimumWidthResolver;
  startingWidths: ColumnWidthMap;
}>;

export function startColumnResizeSession({
  adjacentColumnId,
  adjacentColumnWidth,
  columnId,
  columnWidth,
  event,
  measuredMinimumWidths,
  onEnd,
  onResize,
  resolveMinimumWidth,
  startingWidths,
}: StartColumnResizeSessionOptions): ColumnResizeSession {
  event.preventDefault();

  const startX = event.clientX;
  const ownerDocument = event.currentTarget.ownerDocument;
  const bodyStyle = ownerDocument.body.style;
  const originalCursor = bodyStyle.cursor;
  const originalUserSelect = bodyStyle.userSelect;

  bodyStyle.cursor = 'col-resize';
  bodyStyle.userSelect = 'none';

  const handlePointerMove = (pointerEvent: PointerEvent) => {
    onResize(
      getResizedColumnWidths({
        adjacentColumnId,
        adjacentColumnWidth,
        baseWidths: startingWidths,
        columnId,
        columnWidth,
        delta: pointerEvent.clientX - startX,
        measuredMinimumWidths,
        resolveMinimumWidth,
      }),
    );
  };

  const cleanup = () => {
    ownerDocument.removeEventListener('pointermove', handlePointerMove);
    ownerDocument.removeEventListener('pointerup', cleanup);
    ownerDocument.removeEventListener('pointercancel', cleanup);
    bodyStyle.cursor = originalCursor;
    bodyStyle.userSelect = originalUserSelect;
    onEnd();
  };

  ownerDocument.addEventListener('pointermove', handlePointerMove);
  ownerDocument.addEventListener('pointerup', cleanup, { once: true });
  ownerDocument.addEventListener('pointercancel', cleanup, { once: true });

  return { cleanup };
}
