import { cn } from '../../lib/utils';

type MessagingSectionHeadingProps = Readonly<{
  title: string;
  className?: string;
}>;

export function MessagingSectionHeading({
  title,
  className,
}: MessagingSectionHeadingProps) {
  return (
    <p
      className={cn(
        'text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted-foreground',
        className,
      )}
    >
      {title}
    </p>
  );
}
