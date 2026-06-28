export type {
  ProfileDisplaySkill,
  ProfileEducationDisplayProps,
  ProfileExperienceDisplayProps,
  ProfileProjectDisplayProps,
  ProfilePublicationDisplayProps,
  ProfileSocialDisplayProps,
  ProfileContentVariant,
} from './types';

export { ProfileEntryCardShell } from './primitives/entry-card-shell';
export type { ProfileEntryCardShellProps } from './primitives/entry-card-shell';
export { ProfileMetaChip } from './primitives/meta-chip';
export { ProfileCurrentBadge } from './primitives/current-badge';
export { ProfileSkillsList } from './primitives/skills-list';
export { ProfileEducationContent } from './content/education';
export { ProfileExperienceContent } from './content/experience';
export { ProfileProjectContent } from './content/project';
export { ProfilePublicationContent } from './content/publication';
export { ProfileSocialContent } from './content/social';
export {
  ProfileDisplaySection,
  ProfileDisplaySections,
} from './layout/section';
export {
  ProfileDisplaySectionNav,
  ProfileDisplayWithSectionNav,
} from './layout/section-nav';
export type { ProfileDisplaySectionNavItem } from './layout/section-nav';
export { useProfileSectionNav } from './layout/use-section-nav';
export { profileDisplaySectionLabelClassName } from './primitives/typography';

export type {
  ProfileApplicationEducation,
  ProfileApplicationExperience,
  ProfileApplicationGaps,
  ProfileApplicationLabelMaps,
  ProfileApplicationOmissions,
  ProfileApplicationProject,
  ProfileApplicationPublication,
  ProfileApplicationSnapshot,
  ProfileApplicationSocial,
} from './application/types';

export {
  buildEducationSummary,
  buildExperienceSummary,
  buildProfileApplicationGapMessages,
  buildProjectSummary,
  buildPublicationSummary,
  buildSocialSummary,
  educationHasExpandableDetails,
  experienceHasExpandableDetails,
  projectHasExpandableDetails,
  publicationHasExpandableDetails,
  socialHasExpandableDetails,
  toEducationDisplayProps,
  toExperienceDisplayProps,
  toProjectDisplayProps,
  toPublicationDisplayProps,
  toSocialDisplayProps,
} from './application/mappers';
export type { ProfileApplicationGapMessage } from './application/mappers';
export { ProfileApplicationEntryCollapsible } from './application/entry-collapsible';
export {
  ProfileApplicationEducationEntryHeader,
  ProfileApplicationExperienceEntryHeader,
  ProfileApplicationProjectEntryHeader,
  ProfileApplicationPublicationEntryHeader,
  ProfileApplicationSocialEntryHeader,
} from './application/entry-headers';
export { ProfileApplicationOmissionRow } from './application/omission-row';
export { ProfileApplicationSnapshotSections } from './application/snapshot-sections';
export {
  profileApplicationEntryGroupClassName,
  profileApplicationEntrySurfaceClassName,
  profileApplicationSectionStackClassName,
  profileApplicationSectionStackReadClassName,
} from './application/entry-surface';
