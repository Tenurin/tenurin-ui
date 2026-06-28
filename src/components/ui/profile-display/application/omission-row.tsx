import { profileApplicationEntrySurfaceClassName } from './entry-surface';
import { cn } from '../../../../lib/utils';

type ProfileApplicationOmissionRowProps = Readonly<{
  label: string;
  className?: string;
}>;

export function ProfileApplicationOmissionRow({
  label,
  className,
}: ProfileApplicationOmissionRowProps) {
  return (
    <div
      className={cn(
        profileApplicationEntrySurfaceClassName,
        'px-3 py-2 text-sm text-muted-foreground',
        className,
      )}
    >
      <span className="text-[var(--foreground)]">{label}</span>
      <span className="text-muted-foreground"> — omitted intentionally</span>
    </div>
  );
}
