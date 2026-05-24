import { Skeleton } from './skeleton';
import { cn } from '../../lib/utils';

type PlaceholderBubble = Readonly<{
  lineWidths: readonly string[];
  corner: 'first' | 'middle' | 'last' | 'single';
}>;

type PlaceholderGroup = Readonly<{
  isMine: boolean;
  showLabel: boolean;
  labelWidth: string;
  bubbles: readonly PlaceholderBubble[];
  timeWidth: string;
}>;

const placeholderGroups: readonly PlaceholderGroup[] = [
  {
    isMine: false,
    showLabel: true,
    labelWidth: 'w-24',
    bubbles: [
      { lineWidths: ['w-[18rem]', 'w-[14rem]'], corner: 'single' },
    ],
    timeWidth: 'w-12',
  },
  {
    isMine: true,
    showLabel: false,
    labelWidth: 'w-10',
    bubbles: [
      { lineWidths: ['w-[10rem]'], corner: 'first' },
      { lineWidths: ['w-[8rem]'], corner: 'middle' },
      { lineWidths: ['w-[12rem]'], corner: 'last' },
    ],
    timeWidth: 'w-10',
  },
  {
    isMine: false,
    showLabel: true,
    labelWidth: 'w-20',
    bubbles: [
      { lineWidths: ['w-[13rem]'], corner: 'single' },
    ],
    timeWidth: 'w-11',
  },
  {
    isMine: true,
    showLabel: false,
    labelWidth: 'w-10',
    bubbles: [
      { lineWidths: ['w-[16rem]'], corner: 'first' },
      { lineWidths: ['w-[20rem]', 'w-[12rem]'], corner: 'last' },
    ],
    timeWidth: 'w-12',
  },
];

function getSkeletonBubbleCornerClassName(
  isMine: boolean,
  corner: PlaceholderBubble['corner'],
): string {
  if (isMine) {
    if (corner === 'single' || corner === 'first') {
      return '!rounded-tr-none';
    }

    return 'rounded-lg';
  }

  if (corner === 'single' || corner === 'first') {
    return '!rounded-tl-none';
  }

  return 'rounded-lg';
}

export function MessagingChatMessageListSkeleton() {
  return (
    <div className="space-y-4">
      {placeholderGroups.map((group, groupIndex) => (
        <div
          key={`chat-message-skeleton-group-${groupIndex}`}
          className={cn(
            'flex w-full flex-col gap-1 text-sm',
            group.isMine ? 'items-end' : 'items-start',
          )}
        >
          {group.showLabel ? (
            <Skeleton className={cn('h-4 rounded-sm', group.labelWidth)} />
          ) : null}

          {group.bubbles.map((bubble, bubbleIndex) => (
            <div
              key={`chat-message-skeleton-bubble-${groupIndex}-${bubbleIndex}`}
              className={cn(
                'w-fit rounded-lg px-3 py-3 md:max-w-4/5',
                getSkeletonBubbleCornerClassName(group.isMine, bubble.corner),
                group.isMine
                  ? 'ui-app-accent-own-surface'
                  : 'ui-app-accent-neutral-surface',
              )}
            >
              <div className="space-y-2">
                {bubble.lineWidths.map((width, lineIndex) => (
                  <Skeleton
                    key={`chat-message-line-${groupIndex}-${bubbleIndex}-${lineIndex}`}
                    className={cn('h-4 rounded-sm', width)}
                  />
                ))}
              </div>
            </div>
          ))}

          <Skeleton className={cn('mt-1 h-3 rounded-sm', group.timeWidth)} />
        </div>
      ))}
    </div>
  );
}
