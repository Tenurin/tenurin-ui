import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type SurfaceCardProps = HTMLAttributes<HTMLElement>;

export function SurfaceCard({ className, ...props }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        'rounded-sm border border-border/60 bg-sidebar px-5 py-5',
        className,
      )}
      {...props}
    />
  );
}
