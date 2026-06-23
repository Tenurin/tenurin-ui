import { Award, CalendarDays } from 'lucide-react';
import { Badge } from '../badge';
import { ProfileCurrentBadge } from './profile-current-badge';
import { ProfileMetaChip } from './profile-meta-chip';
import { ProfileSkillsList } from './profile-skills-list';
import type { ProfileEducationDisplayProps } from './types';

export function ProfileEducationContent({
  instituteName,
  typeLabel,
  fieldOfStudy,
  isCurrent = false,
  yearRange,
  score,
  details,
  skills = [],
}: ProfileEducationDisplayProps) {
  const hasMeta = Boolean(yearRange) || Boolean(score);
  const hasFooter = Boolean(details) || skills.length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-base font-medium tracking-[-0.02em] text-[var(--foreground)]">
          {instituteName}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-sm px-2 py-0.5 text-xs font-normal ui-app-accent-warm-surface"
          >
            {typeLabel}
          </Badge>
          {isCurrent ? <ProfileCurrentBadge /> : null}
          {fieldOfStudy ? (
            <span className="text-sm text-muted-foreground">{fieldOfStudy}</span>
          ) : null}
        </div>
      </div>

      {hasMeta ? (
        <div className="flex flex-wrap gap-2">
          {yearRange ? (
            <ProfileMetaChip icon={CalendarDays} label={yearRange} />
          ) : null}
          {score ? <ProfileMetaChip icon={Award} label={score} /> : null}
        </div>
      ) : null}

      {hasFooter ? (
        <div className="space-y-4 border-t border-border/60 pt-4">
          {details ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {details}
            </p>
          ) : null}
          <ProfileSkillsList skills={skills} />
        </div>
      ) : null}
    </div>
  );
}
