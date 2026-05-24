import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/utils';

type UploadSurfaceProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    selectedLabel?: ReactNode;
  }
>;

export default function UploadSurface({
  icon,
  title,
  description,
  selectedLabel,
  className,
  type = 'button',
  ...props
}: UploadSurfaceProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex w-full cursor-pointer flex-col items-center gap-3 rounded-sm border border-dashed border-border/80 bg-background/30 px-6 py-8 text-center transition hover:border-foreground/30 hover:bg-background/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/60">
        {icon}
      </div>

      {selectedLabel ? (
        <p className="max-w-full truncate text-sm font-medium text-[var(--foreground)]">
          {selectedLabel}
        </p>
      ) : (
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            {title}
          </p>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      )}
    </button>
  );
}
