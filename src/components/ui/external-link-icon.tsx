import { ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

type ExternalLinkIconProps = Readonly<{
  href: string;
  ariaLabel: string;
  className?: string;
  /** Prevents parent interactive surfaces (e.g. collapsible triggers) from toggling. */
  stopPropagation?: boolean;
}>;

/** Compact icon-only external link with an accessible label. */
export function ExternalLinkIcon({
  href,
  ariaLabel,
  className,
  stopPropagation = true,
}: ExternalLinkIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={
        stopPropagation ? (event) => event.stopPropagation() : undefined
      }
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted/30 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <ExternalLink className="size-3.5" aria-hidden />
    </a>
  );
}
