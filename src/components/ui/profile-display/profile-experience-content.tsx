import { CalendarDays } from 'lucide-react';
import { Badge } from '../badge';
import { ProfileCurrentBadge } from './profile-current-badge';
import { ProfileMetaChip } from './profile-meta-chip';
import { ProfileSkillsList } from './profile-skills-list';
import type { ProfileExperienceDisplayProps } from './types';

export function ProfileExperienceContent({
  organizationName,
  role,
  typeLabel,
  isCurrent = false,
  dateRange,
  details,
  skills = [],
}: ProfileExperienceDisplayProps) {
  const hasFooter = Boolean(details) || skills.length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="flex flex-col gap-1 text-base font-medium tracking-[-0.02em] text-[var(--foreground)] sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
          <span>{organizationName}</span>
          {role ? (
            <span className="text-sm font-normal text-muted-foreground">
              {role}
            </span>
          ) : null}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-sm px-2 py-0.5 text-xs font-normal ui-app-accent-warm-surface"
          >
            {typeLabel}
          </Badge>
          {isCurrent ? <ProfileCurrentBadge /> : null}
          {dateRange ? (
            <ProfileMetaChip icon={CalendarDays} label={dateRange} />
          ) : null}
        </div>
      </div>

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
