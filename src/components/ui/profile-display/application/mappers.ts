import { format, parseISO } from 'date-fns';
import type {
  ProfileApplicationEducation,
  ProfileApplicationExperience,
  ProfileApplicationGaps,
  ProfileApplicationLabelMaps,
  ProfileApplicationOmissions,
  ProfileApplicationProject,
  ProfileApplicationPublication,
  ProfileApplicationSkill,
  ProfileApplicationSocial,
} from './types';
import type {
  ProfileDisplaySkill,
  ProfileEducationDisplayProps,
  ProfileExperienceDisplayProps,
  ProfileProjectDisplayProps,
  ProfilePublicationDisplayProps,
  ProfileSocialDisplayProps,
} from '../types';

function mapSkills(
  skills: readonly ProfileApplicationSkill[] | undefined,
): ProfileDisplaySkill[] {
  if (!skills?.length) {
    return [];
  }

  return skills.flatMap((skill, index) => {
    const skillId = skill.skillId ?? skill.name ?? `skill-${index}`;
    if (!skillId) {
      return [];
    }
    return [{ skillId, name: skill.name ?? undefined }];
  });
}

function formatProfileMonthYear(value: string): string {
  return format(parseISO(value), 'MMM yyyy');
}

function formatEducationYearRange(
  education: ProfileApplicationEducation,
): string {
  const start = education.startYear?.toString() ?? '';
  const end = education.isCurrent
    ? 'Present'
    : (education.endYear?.toString() ?? '');
  if (start && end) {
    return `${start} – ${end}`;
  }
  if (start) {
    return start;
  }
  if (end) {
    return end;
  }
  return '';
}

function formatExperienceDateRange(
  experience: ProfileApplicationExperience,
): string {
  const start = formatProfileMonthYear(experience.startDate);
  let end = '';
  if (experience.isCurrent) {
    end = 'Present';
  } else if (experience.endDate) {
    end = formatProfileMonthYear(experience.endDate);
  }
  if (start && end) {
    return `${start} – ${end}`;
  }
  if (start) {
    return start;
  }
  if (end) {
    return end;
  }
  return '';
}

function normalizeHttpUrl(url: string | undefined): string | null {
  if (!url?.trim()) {
    return null;
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function toEducationDisplayProps(
  education: ProfileApplicationEducation,
  labelMaps: ProfileApplicationLabelMaps,
): ProfileEducationDisplayProps {
  const typeLabel =
    education.educationType == null
      ? 'Education'
      : labelMaps.educationTypeLabel(education.educationType);

  return {
    instituteName: education.instituteName,
    typeLabel,
    fieldOfStudy: education.fieldOfStudy || undefined,
    isCurrent: education.isCurrent,
    yearRange: formatEducationYearRange(education) || undefined,
    score: education.score || undefined,
    details: education.details || undefined,
    skills: mapSkills(education.skills),
  };
}

export function toExperienceDisplayProps(
  experience: ProfileApplicationExperience,
  labelMaps: ProfileApplicationLabelMaps,
): ProfileExperienceDisplayProps {
  const typeLabel =
    experience.employmentType == null
      ? 'Experience'
      : labelMaps.employmentTypeLabel(experience.employmentType);

  return {
    organizationName: experience.organizationName,
    role: experience.role || undefined,
    typeLabel,
    isCurrent: experience.isCurrent,
    dateRange: formatExperienceDateRange(experience) || undefined,
    details: experience.details || undefined,
    skills: mapSkills(experience.skills),
  };
}

export function toProjectDisplayProps(
  project: ProfileApplicationProject,
): ProfileProjectDisplayProps {
  return {
    title: project.title,
    dateLabel: project.dateCompleted
      ? formatProfileMonthYear(project.dateCompleted)
      : undefined,
    linkHref: normalizeHttpUrl(project.link),
    description: project.description || undefined,
    skills: mapSkills(project.skills),
  };
}

export function toPublicationDisplayProps(
  publication: ProfileApplicationPublication,
): ProfilePublicationDisplayProps {
  return {
    title: publication.title,
    publisher: publication.publisher ?? undefined,
    dateLabel: publication.datePublished
      ? formatProfileMonthYear(publication.datePublished)
      : undefined,
    linkHref: normalizeHttpUrl(publication.link),
    description: publication.description || undefined,
    skills: mapSkills(publication.skills),
  };
}

export function toSocialDisplayProps(
  social: ProfileApplicationSocial,
  labelMaps: ProfileApplicationLabelMaps,
): ProfileSocialDisplayProps {
  return {
    platformLabel: labelMaps.socialPlatformLabel(social.platform),
    url: social.url,
    linkHref: normalizeHttpUrl(social.url),
  };
}

export function buildEducationSummary(
  education: ProfileApplicationEducation,
  labelMaps: ProfileApplicationLabelMaps,
): string {
  const parts = [
    education.instituteName,
    labelMaps.educationTypeLabel(education.educationType ?? 'other'),
    education.score ?? undefined,
    formatEducationYearRange(education) || undefined,
  ].filter(Boolean);
  return parts.join(' · ');
}

export function buildExperienceSummary(
  experience: ProfileApplicationExperience,
): string {
  const parts = [
    experience.organizationName,
    experience.role,
    formatExperienceDateRange(experience) || undefined,
  ].filter(Boolean);
  return parts.join(' · ');
}

export function buildProjectSummary(project: ProfileApplicationProject): string {
  const parts = [
    project.title,
    project.dateCompleted
      ? formatProfileMonthYear(project.dateCompleted)
      : undefined,
    project.link?.trim() || undefined,
  ].filter(Boolean);
  return parts.join(' · ');
}

export function buildPublicationSummary(
  publication: ProfileApplicationPublication,
): string {
  const parts = [
    publication.title,
    publication.publisher ?? undefined,
    publication.datePublished
      ? formatProfileMonthYear(publication.datePublished)
      : undefined,
  ].filter(Boolean);
  return parts.join(' · ');
}

export function buildSocialSummary(
  social: ProfileApplicationSocial,
  labelMaps: ProfileApplicationLabelMaps,
): string {
  return labelMaps.socialPlatformLabel(social.platform);
}

export function educationHasExpandableDetails(
  education: ProfileApplicationEducation,
): boolean {
  return (
    Boolean(education.details?.trim()) ||
    Boolean(education.skills?.length) ||
    Boolean(education.startYear) ||
    Boolean(education.endYear) ||
    education.isCurrent === true
  );
}

export function experienceHasExpandableDetails(
  experience: ProfileApplicationExperience,
): boolean {
  return (
    Boolean(experience.details?.trim()) ||
    Boolean(experience.skills?.length) ||
    Boolean(experience.employmentType)
  );
}

export function projectHasExpandableDetails(
  project: ProfileApplicationProject,
): boolean {
  return (
    Boolean(project.description?.trim()) || Boolean(project.skills?.length)
  );
}

export function publicationHasExpandableDetails(
  publication: ProfileApplicationPublication,
): boolean {
  return (
    Boolean(publication.description?.trim()) ||
    Boolean(publication.skills?.length)
  );
}

export function socialHasExpandableDetails(
  social: ProfileApplicationSocial,
): boolean {
  return Boolean(social.url?.trim());
}

export type ProfileApplicationGapMessage = Readonly<{
  id: string;
  label: string;
  message: string;
  omissionKey: keyof ProfileApplicationOmissions;
  value: string | boolean;
}>;

export function buildProfileApplicationGapMessages(
  gaps: ProfileApplicationGaps,
  labelMaps: ProfileApplicationLabelMaps,
): ProfileApplicationGapMessage[] {
  const messages: ProfileApplicationGapMessage[] = [];

  for (const educationType of gaps.educationTypes ?? []) {
    const educationLabel = labelMaps.educationTypeLabel(educationType);
    messages.push({
      id: `education-${educationType}`,
      label: educationLabel,
      message: `Add ${educationLabel} education to your student profile for it to appear here.`,
      omissionKey: 'educationTypes',
      value: educationType,
    });
  }

  if (gaps.experience) {
    messages.push({
      id: 'experience',
      label: 'Experience',
      message:
        'Add experience to your student profile for it to appear here.',
      omissionKey: 'experience',
      value: true,
    });
  }

  if (gaps.publications) {
    messages.push({
      id: 'publications',
      label: 'Publications',
      message:
        'Add publications to your student profile for them to appear here.',
      omissionKey: 'publications',
      value: true,
    });
  }

  if (gaps.projects) {
    messages.push({
      id: 'projects',
      label: 'Projects',
      message: 'Add projects to your student profile for them to appear here.',
      omissionKey: 'projects',
      value: true,
    });
  }

  for (const platform of gaps.socialPlatforms ?? []) {
    const platformLabel = labelMaps.socialPlatformLabel(platform);
    messages.push({
      id: `social-${platform}`,
      label: platformLabel,
      message: `Add your ${platformLabel} link in your student profile for it to appear here.`,
      omissionKey: 'socialPlatforms',
      value: platform,
    });
  }

  return messages;
}
