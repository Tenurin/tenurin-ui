import { cn } from '../../lib/utils';

export type MessagingMessageContentProps = Readonly<{
  content: string;
  className?: string;
}>;

/**
 * Renders chat message text so soft wraps stay tight within a paragraph while
 * explicit newlines become visually distinct paragraph breaks.
 */
export function MessagingMessageContent({
  content,
  className,
}: MessagingMessageContentProps) {
  const paragraphs = content.split(/\r?\n/);

  return (
    <div className={cn('flex flex-col gap-2 text-[15px]', className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="break-words leading-snug">
          {paragraph.length > 0 ? paragraph : '\u00A0'}
        </p>
      ))}
    </div>
  );
}
