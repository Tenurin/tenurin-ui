export type ProfileApplicationSkill = Readonly<{
  skillId?: string | null;
  name?: string | null;
}>;

export type ProfileApplicationEducation = Readonly<{
  educationId: string;
  educationType?: string | null;
  instituteName: string;
  fieldOfStudy?: string;
  score?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  isCurrent?: boolean;
  details?: string;
  skills?: readonly ProfileApplicationSkill[];
}>;

export type ProfileApplicationExperience = Readonly<{
  experienceId: string;
  organizationName: string;
  role?: string;
  employmentType?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  details?: string;
  skills?: readonly ProfileApplicationSkill[];
}>;

export type ProfileApplicationProject = Readonly<{
  projectId: string;
  title: string;
  description?: string;
  link?: string;
  dateCompleted?: string | null;
  skills?: readonly ProfileApplicationSkill[];
}>;

export type ProfileApplicationPublication = Readonly<{
  publicationId: string;
  title: string;
  publisher?: string | null;
  description?: string;
  datePublished?: string | null;
  link?: string;
  skills?: readonly ProfileApplicationSkill[];
}>;

export type ProfileApplicationSocial = Readonly<{
  platform: string;
  url: string;
}>;

export type ProfileApplicationOmissions = Readonly<{
  educationTypes?: readonly string[];
  experience?: boolean;
  publications?: boolean;
  projects?: boolean;
  socialPlatforms?: readonly string[];
}>;

export type ProfileApplicationGaps = Readonly<{
  educationTypes?: readonly string[];
  experience?: boolean;
  publications?: boolean;
  projects?: boolean;
  socialPlatforms?: readonly string[];
}>;

export type ProfileApplicationSnapshot = Readonly<{
  education?: readonly ProfileApplicationEducation[];
  experience?: readonly ProfileApplicationExperience[];
  publications?: readonly ProfileApplicationPublication[];
  projects?: readonly ProfileApplicationProject[];
  socialLinks?: readonly ProfileApplicationSocial[];
  omissions?: ProfileApplicationOmissions | null;
}>;

export type ProfileApplicationLabelMaps = Readonly<{
  educationTypeLabel: (type: string) => string;
  employmentTypeLabel: (type: string) => string;
  socialPlatformLabel: (platform: string) => string;
}>;
