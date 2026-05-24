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
  columnId: string;
  columnIds: readonly string[];
  event: ReactPointerEvent<HTMLButtonElement>;
  onEnd: () => void;
  onResize: (widths: ColumnWidthMap) => void;
  resolveMinimumWidth: ColumnMinimumWidthResolver;
  startingWidths: ColumnWidthMap;
}>;

const CAPTURE_LISTENER_OPTIONS: AddEventListenerOptions = {
  capture: true,
  passive: false,
};

const EMPTY_MEASURED_MINIMUM_WIDTHS: ColumnWidthMap = {};

export function startColumnResizeSession({
  columnId,
  columnIds,
  event,
  onEnd,
  onResize,
  resolveMinimumWidth,
  startingWidths,
}: StartColumnResizeSessionOptions): ColumnResizeSession {
  const captureTarget = event.currentTarget;
  const pointerId = event.pointerId;

  event.preventDefault();
  event.stopPropagation();

  if (captureTarget.setPointerCapture) {
    captureTarget.setPointerCapture(pointerId);
  }

  const startX = event.clientX;
  const ownerDocument = captureTarget.ownerDocument;
  const ownerWindow = ownerDocument.defaultView ?? globalThis;

  const bodyStyle = ownerDocument.body.style;
  const originalCursor = bodyStyle.cursor;
  const originalUserSelect = bodyStyle.userSelect;
  const originalTouchAction = bodyStyle.touchAction;

  bodyStyle.cursor = 'col-resize';
  bodyStyle.userSelect = 'none';
  bodyStyle.touchAction = 'none';

  let ended = false;

  const applyResize = (clientX: number) => {
    const delta = clientX - startX;
    const nextWidths = getResizedColumnWidths({
      baseWidths: startingWidths,
      columnId,
      columnIds,
      delta,
      measuredMinimumWidths: EMPTY_MEASURED_MINIMUM_WIDTHS,
      resolveMinimumWidth,
    });

    onResize(nextWidths);
  };

  const releasePointerCapture = () => {
    if (captureTarget.hasPointerCapture?.(pointerId)) {
      captureTarget.releasePointerCapture(pointerId);
    }
  };

  const finishSession = () => {
    if (ended) {
      return;
    }

    ended = true;
    ownerWindow.removeEventListener(
      'pointermove',
      handlePointerMove,
      CAPTURE_LISTENER_OPTIONS,
    );
    ownerWindow.removeEventListener(
      'pointerup',
      handlePointerUp,
      CAPTURE_LISTENER_OPTIONS,
    );
    ownerWindow.removeEventListener(
      'pointercancel',
      handlePointerCancel,
      CAPTURE_LISTENER_OPTIONS,
    );
    releasePointerCapture();
    bodyStyle.cursor = originalCursor;
    bodyStyle.userSelect = originalUserSelect;
    bodyStyle.touchAction = originalTouchAction;
    onEnd();
  };

  const handlePointerMove = (pointerEvent: PointerEvent) => {
    if (ended || pointerEvent.pointerId !== pointerId) {
      return;
    }

    pointerEvent.preventDefault();
    applyResize(pointerEvent.clientX);
  };

  const handlePointerUp = (pointerEvent: PointerEvent) => {
    if (pointerEvent.pointerId !== pointerId) {
      return;
    }

    pointerEvent.preventDefault();
    finishSession();
  };

  const handlePointerCancel = (pointerEvent: PointerEvent) => {
    if (pointerEvent.pointerId !== pointerId) {
      return;
    }

    pointerEvent.preventDefault();
    finishSession();
  };

  ownerWindow.addEventListener(
    'pointermove',
    handlePointerMove,
    CAPTURE_LISTENER_OPTIONS,
  );
  ownerWindow.addEventListener(
    'pointerup',
    handlePointerUp,
    CAPTURE_LISTENER_OPTIONS,
  );
  ownerWindow.addEventListener(
    'pointercancel',
    handlePointerCancel,
    CAPTURE_LISTENER_OPTIONS,
  );

  return {
    cleanup: () => finishSession(),
  };
}
