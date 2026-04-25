import { Skeleton } from '../../components/ui/skeleton';
import { cn } from '../../lib/utils';

const placeholderMessages = [
  {
    isMine: false,
    labelWidth: 'w-24',
    lineWidths: ['w-[18rem]', 'w-[14rem]'],
    timeWidth: 'w-12',
  },
  {
    isMine: true,
    labelWidth: 'w-10',
    lineWidths: ['w-[16rem]', 'w-[10rem]'],
    timeWidth: 'w-10',
  },
  {
    isMine: false,
    labelWidth: 'w-20',
    lineWidths: ['w-[13rem]'],
    timeWidth: 'w-11',
  },
  {
    isMine: true,
    labelWidth: 'w-10',
    lineWidths: ['w-[20rem]', 'w-[12rem]'],
    timeWidth: 'w-12',
  },
  {
    isMine: false,
    labelWidth: 'w-28',
    lineWidths: ['w-[15rem]', 'w-[11rem]'],
    timeWidth: 'w-10',
  },
  {
    isMine: true,
    labelWidth: 'w-10',
    lineWidths: ['w-[12rem]'],
    timeWidth: 'w-11',
  },
] as const;

export function MessagingChatMessageListSkeleton() {
  return (
    <div className="space-y-6">
      {placeholderMessages.map((item, index) => (
        <div
          key={`chat-message-skeleton-${index}`}
          className={cn(
            'flex w-full flex-col gap-2 text-sm',
            item.isMine && 'items-end',
          )}
        >
          <Skeleton className={cn('h-4 rounded-sm', item.labelWidth)} />

          <div
            className={cn(
              'w-fit rounded-lg px-3 py-3 md:max-w-4/5',
              item.isMine
                ? '!rounded-tr-none ui-app-accent-inverse-surface'
                : '!rounded-tl-none ui-app-accent-neutral-surface',
            )}
          >
            <div className="space-y-2">
              {item.lineWidths.map((width, lineIndex) => (
                <Skeleton
                  key={`chat-message-line-${index}-${lineIndex}`}
                  className={cn('h-4 rounded-sm', width)}
                />
              ))}
            </div>
          </div>

          <Skeleton className={cn('h-3 rounded-sm', item.timeWidth)} />
        </div>
      ))}
    </div>
  );
}
