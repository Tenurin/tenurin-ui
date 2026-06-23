import type { LucideIcon } from 'lucide-react';
import { badgeVariants } from '../badge';
import { cn } from '../../../lib/utils';

type ProfileMetaChipProps = Readonly<{
  icon: LucideIcon;
  label: string;
}>;

/** Compact metadata chip for profile entry cards (dates, scores, etc.). */
export function ProfileMetaChip({ icon: Icon, label }: ProfileMetaChipProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant: 'outline' }),
        'inline-flex h-6 items-center gap-1.5 rounded-sm border-border/60 bg-muted/15 px-2 text-xs font-normal text-[var(--foreground)]',
      )}
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      {label}
    </span>
  );
}
