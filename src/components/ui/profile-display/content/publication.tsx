import { CalendarDays, ExternalLink } from 'lucide-react';
import { ProfileMetaChip } from '../primitives/meta-chip';
import { ProfileSkillsList } from '../primitives/skills-list';
import type { ProfileContentVariant, ProfilePublicationDisplayProps } from '../types';

export function ProfilePublicationContent({
  title,
  publisher,
  dateLabel,
  linkHref,
  linkLabel = 'View publication',
  description,
  skills = [],
  variant = 'full',
}: ProfilePublicationDisplayProps & { variant?: ProfileContentVariant }) {
  const hasFooter = Boolean(description) || skills.length > 0;

  if (variant === 'details-only') {
    if (!hasFooter) {
      return null;
    }

    return (
      <div className="space-y-3">
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        <ProfileSkillsList skills={skills} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="flex flex-col gap-1 text-base font-medium tracking-[-0.02em] text-[var(--foreground)] sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
          <span>{title}</span>
          {publisher ? (
            <span className="text-sm font-normal text-muted-foreground">
              {publisher}
            </span>
          ) : null}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {dateLabel ? (
            <ProfileMetaChip icon={CalendarDays} label={dateLabel} />
          ) : null}
          {linkHref ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--foreground)]"
            >
              <ExternalLink className="size-3.5" aria-hidden />
              {linkLabel}
            </a>
          ) : null}
        </div>
      </div>

      {hasFooter ? (
        <div className="space-y-4 border-t border-border/60 pt-4">
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          <ProfileSkillsList skills={skills} />
        </div>
      ) : null}
    </div>
  );
}
