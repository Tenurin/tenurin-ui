import { cn } from '../../lib/utils';

const loadingWidthClassNames = [
  'w-5/6',
  'w-3/4',
  'w-2/3',
  'w-1/2',
] as const;

function getFallbackLoadingWidthClassName(index: number) {
  return loadingWidthClassNames[index % loadingWidthClassNames.length];
}

export function getTableLoadingSkeletonClassName({
  index,
  className,
  isActionsColumn = false,
  isCentered = false,
}: Readonly<{
  index: number;
  className?: string;
  isActionsColumn?: boolean;
  isCentered?: boolean;
}>) {
  if (className) {
    return cn(className, isCentered ? 'mx-auto' : null);
  }

  if (isActionsColumn) {
    return cn('h-8 w-8 rounded-full', isCentered ? 'mx-auto' : 'ml-auto');
  }

  return cn(
    'h-4 rounded-sm',
    getFallbackLoadingWidthClassName(index),
    isCentered ? 'mx-auto' : null,
  );
}
