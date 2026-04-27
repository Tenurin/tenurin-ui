import type { ReactNode } from 'react';

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

  return <div className="block min-w-0 max-w-full truncate">{content}</div>;
}
