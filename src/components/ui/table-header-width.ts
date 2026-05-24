import type { CSSProperties, ReactNode } from 'react';

import type { ColumnWidthMap } from './table-column-resizing-utils';

const HEADER_TEXT_CHARACTER_WIDTH = 8;
const HEADER_TEXT_TRACKING_WIDTH = 3;
const HEADER_CELL_HORIZONTAL_RESERVED_WIDTH = 52;
const HEADER_MAX_ESTIMATED_MINIMUM_WIDTH = 220;

type HeaderWidthColumn = Readonly<{
  header: ReactNode;
  id: string;
  minimumWidth?: number;
}>;

function getHeaderText(header: ReactNode): string | undefined {
  if (typeof header === 'string' || typeof header === 'number') {
    return String(header);
  }

  return undefined;
}

export function getEstimatedHeaderMinimumWidth(
  header: ReactNode,
  fallbackMinimumWidth: number,
): number {
  const headerText = getHeaderText(header);

  if (headerText === undefined) {
    return fallbackMinimumWidth;
  }

  const textLength = headerText.trim().length;
  const trackingLength = Math.max(textLength - 1, 0);
  const estimatedWidth =
    textLength * HEADER_TEXT_CHARACTER_WIDTH +
    trackingLength * HEADER_TEXT_TRACKING_WIDTH +
    HEADER_CELL_HORIZONTAL_RESERVED_WIDTH;

  return Math.max(
    fallbackMinimumWidth,
    Math.min(Math.ceil(estimatedWidth), HEADER_MAX_ESTIMATED_MINIMUM_WIDTH),
  );
}

export function buildHeaderMinimumWidths(
  columns: readonly HeaderWidthColumn[],
  fallbackMinimumWidth: number,
): ColumnWidthMap {
  return Object.fromEntries(
    columns.map((column) => {
      const estimatedMinimumWidth = getEstimatedHeaderMinimumWidth(
        column.header,
        fallbackMinimumWidth,
      );

      return [
        column.id,
        Math.max(column.minimumWidth ?? 0, estimatedMinimumWidth),
      ];
    }),
  );
}

export function getHeaderMinimumWidthStyle(
  minimumWidth: number,
  style?: CSSProperties,
): CSSProperties {
  return {
    ...style,
    minWidth: `${minimumWidth}px`,
  };
}
