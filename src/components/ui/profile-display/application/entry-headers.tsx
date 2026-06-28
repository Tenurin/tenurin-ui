import { Award, CalendarDays } from 'lucide-react';
import { Badge } from '../../badge';
import { cn } from '../../../../lib/utils';
import { ProfileCurrentBadge } from '../primitives/current-badge';
import { ExternalLinkIcon } from '../../external-link-icon';
import { ProfileMetaChip } from '../primitives/meta-chip';
import type {
  ProfileEducationDisplayProps,
  ProfileExperienceDisplayProps,
  ProfileProjectDisplayProps,
  ProfilePublicationDisplayProps,
  ProfileSocialDisplayProps,
} from '../types';

const profileApplicationEntryHeaderRowClassName =
  'flex min-h-6 min-w-0 flex-wrap items-center gap-x-3 gap-y-1';

const profileApplicationEntryHeaderTitleClassName =
  'inline-flex items-center text-sm leading-none tracking-[-0.02em] text-[var(--foreground)]';

const profileApplicationEntryHeaderMetaClassName =
  'inline-flex items-center text-xs leading-none text-muted-foreground';

export function ProfileApplicationEducationEntryHeader({
  instituteName,
  typeLabel,
  fieldOfStudy,
  isCurrent = false,
  score,
}: ProfileEducationDisplayProps) {
  return (
    <div className={profileApplicationEntryHeaderRowClassName}>
      <span className={profileApplicationEntryHeaderTitleClassName}>
        {instituteName}
      </span>
      <Badge
        variant="outline"
        className="rounded-sm px-2 py-0.5 text-xs font-normal ui-app-accent-warm-surface"
      >
        {typeLabel}
      </Badge>
      {isCurrent ? <ProfileCurrentBadge /> : null}
      {fieldOfStudy ? (
        <span className={profileApplicationEntryHeaderMetaClassName}>
          {fieldOfStudy}
        </span>
      ) : null}
      {score ? <ProfileMetaChip icon={Award} label={score} /> : null}
    </div>
  );
}

export function ProfileApplicationExperienceEntryHeader({
  organizationName,
  role,
  isCurrent = false,
  dateRange,
}: ProfileExperienceDisplayProps) {
  return (
    <div className={profileApplicationEntryHeaderRowClassName}>
      <span className={profileApplicationEntryHeaderTitleClassName}>
        {organizationName}
      </span>
      {role ? (
        <span className={profileApplicationEntryHeaderMetaClassName}>{role}</span>
      ) : null}
      {isCurrent ? <ProfileCurrentBadge /> : null}
      {dateRange ? (
        <ProfileMetaChip icon={CalendarDays} label={dateRange} />
      ) : null}
    </div>
  );
}

export function ProfileApplicationProjectEntryHeader({
  title,
  dateLabel,
  linkHref,
}: ProfileProjectDisplayProps) {
  return (
    <div className={profileApplicationEntryHeaderRowClassName}>
      <span className={profileApplicationEntryHeaderTitleClassName}>{title}</span>
      {dateLabel ? (
        <ProfileMetaChip icon={CalendarDays} label={dateLabel} />
      ) : null}
      {linkHref ? (
        <ExternalLinkIcon
          href={linkHref}
          ariaLabel={`Open ${title}`}
        />
      ) : null}
    </div>
  );
}

export function ProfileApplicationPublicationEntryHeader({
  title,
  publisher,
  dateLabel,
  linkHref,
}: ProfilePublicationDisplayProps) {
  return (
    <div className={profileApplicationEntryHeaderRowClassName}>
      <span className={profileApplicationEntryHeaderTitleClassName}>{title}</span>
      {publisher ? (
        <span className={profileApplicationEntryHeaderMetaClassName}>
          {publisher}
        </span>
      ) : null}
      {dateLabel ? (
        <ProfileMetaChip icon={CalendarDays} label={dateLabel} />
      ) : null}
      {linkHref ? (
        <ExternalLinkIcon
          href={linkHref}
          ariaLabel={`Open ${title}`}
        />
      ) : null}
    </div>
  );
}

export function ProfileApplicationSocialEntryHeader({
  platformLabel,
  linkHref,
}: ProfileSocialDisplayProps) {
  return (
    <div className={cn(profileApplicationEntryHeaderRowClassName, 'gap-x-2')}>
      <span className={profileApplicationEntryHeaderTitleClassName}>
        {platformLabel}
      </span>
      {linkHref ? (
        <ExternalLinkIcon
          href={linkHref}
          ariaLabel={`Open ${platformLabel}`}
        />
      ) : null}
    </div>
  );
}
