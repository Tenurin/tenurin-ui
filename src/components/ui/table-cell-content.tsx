import type { ReactNode } from 'react';

import { MiddleTruncatedText } from './middle-truncated-text';

type PrimitiveTableCellContent = string | number;

function isPrimitiveTableCellContent(
  content: ReactNode,
): content is PrimitiveTableCellContent {
  return typeof content === 'string' || typeof content === 'number';
}

export function renderTruncatedTableCellContent(
  content: ReactNode,
  forceTruncation = false,
): ReactNode {
  if (!forceTruncation && !isPrimitiveTableCellContent(content)) {
    return content;
  }

  if (forceTruncation && isPrimitiveTableCellContent(content)) {
    return (
      <MiddleTruncatedText
        text={String(content)}
        className="max-w-full pr-1 text-sm"
        charWidthPx={7}
        minChars={4}
      />
    );
  }

  return <div className="block min-w-0 max-w-full truncate">{content}</div>;
}
