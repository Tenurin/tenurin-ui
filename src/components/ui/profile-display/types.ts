export type ProfileDisplaySkill = Readonly<{
  skillId: string;
  name?: string;
}>;

export type ProfileContentVariant = 'full' | 'details-only';

export type ProfileEducationDisplayProps = Readonly<{
  instituteName: string;
  typeLabel: string;
  fieldOfStudy?: string;
  isCurrent?: boolean;
  yearRange?: string;
  score?: string;
  details?: string;
  skills?: readonly ProfileDisplaySkill[];
}>;

export type ProfileExperienceDisplayProps = Readonly<{
  organizationName: string;
  role?: string;
  typeLabel: string;
  isCurrent?: boolean;
  dateRange?: string;
  details?: string;
  skills?: readonly ProfileDisplaySkill[];
}>;

export type ProfileProjectDisplayProps = Readonly<{
  title: string;
  dateLabel?: string;
  linkHref?: string | null;
  linkLabel?: string;
  description?: string;
  skills?: readonly ProfileDisplaySkill[];
}>;

export type ProfilePublicationDisplayProps = Readonly<{
  title: string;
  publisher?: string;
  dateLabel?: string;
  linkHref?: string | null;
  linkLabel?: string;
  description?: string;
  skills?: readonly ProfileDisplaySkill[];
}>;

export type ProfileSocialDisplayProps = Readonly<{
  platformLabel: string;
  url: string;
  linkHref?: string | null;
}>;
