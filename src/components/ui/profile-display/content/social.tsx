import { ExternalLink } from 'lucide-react';
import type { ProfileContentVariant, ProfileSocialDisplayProps } from '../types';

export function ProfileSocialContent({
  platformLabel,
  url,
  linkHref,
  variant = 'full',
}: ProfileSocialDisplayProps & { variant?: ProfileContentVariant }) {
  if (variant === 'details-only') {
    if (!url?.trim()) {
      return null;
    }

    return (
      <p className="text-sm text-muted-foreground break-all">{url}</p>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium tracking-[-0.02em] text-[var(--foreground)]">
        {platformLabel}
      </h3>
      <p className="text-sm text-muted-foreground break-all">{url}</p>
      {linkHref ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--foreground)]"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          Open link
        </a>
      ) : null}
    </div>
  );
}
