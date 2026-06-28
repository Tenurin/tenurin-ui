import type { ReactNode } from 'react';
import {
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
} from './mappers';
import {
  ProfileApplicationEducationEntryHeader,
  ProfileApplicationExperienceEntryHeader,
  ProfileApplicationProjectEntryHeader,
  ProfileApplicationPublicationEntryHeader,
  ProfileApplicationSocialEntryHeader,
} from './entry-headers';
import { profileApplicationSectionStackReadClassName } from './entry-surface';
import { ProfileApplicationEntryCollapsible } from './entry-collapsible';
import { ProfileApplicationOmissionRow } from './omission-row';
import { ProfileDisplaySection } from '../layout/section';
import { ProfileEducationContent } from '../content/education';
import { ProfileExperienceContent } from '../content/experience';
import { ProfileProjectContent } from '../content/project';
import { ProfilePublicationContent } from '../content/publication';
import { ProfileSocialContent } from '../content/social';
import type {
  ProfileApplicationLabelMaps,
  ProfileApplicationSnapshot,
} from './types';

type ProfileApplicationSnapshotSectionsProps = Readonly<{
  snapshot: ProfileApplicationSnapshot;
  labelMaps: ProfileApplicationLabelMaps;
}>;

/** Read-only imported profile snapshot for college application review. */
export function ProfileApplicationSnapshotSections({
  snapshot,
  labelMaps,
}: ProfileApplicationSnapshotSectionsProps) {
  const persistedOmissions = snapshot.omissions;
  const sections: ReactNode[] = [];

  if (
    snapshot.education?.length ||
    persistedOmissions?.educationTypes?.length
  ) {
    sections.push(
      <ProfileDisplaySection
        key="education"
        sectionId="profile-application-education"
        title="Education"
        emptyMessage="No education was imported."
        isEmpty={
          !snapshot.education?.length &&
          !persistedOmissions?.educationTypes?.length
        }
        stackClassName={profileApplicationSectionStackReadClassName}
      >
        {snapshot.education?.map((education) => {
          const displayProps = toEducationDisplayProps(education, labelMaps);

          return (
            <ProfileApplicationEntryCollapsible
              key={education.educationId}
              expandable={educationHasExpandableDetails(education)}
              trigger={
                <ProfileApplicationEducationEntryHeader {...displayProps} />
              }
            >
              <ProfileEducationContent {...displayProps} variant="details-only" />
            </ProfileApplicationEntryCollapsible>
          );
        })}
        {persistedOmissions?.educationTypes?.map((educationType) => (
          <ProfileApplicationOmissionRow
            key={`education-omission-${educationType}`}
            label={labelMaps.educationTypeLabel(educationType)}
          />
        ))}
      </ProfileDisplaySection>,
    );
  }

  if (snapshot.experience?.length || persistedOmissions?.experience) {
    sections.push(
      <ProfileDisplaySection
        key="experience"
        sectionId="profile-application-experience"
        title="Experience"
        emptyMessage="No experience was imported."
        isEmpty={
          !snapshot.experience?.length && !persistedOmissions?.experience
        }
        stackClassName={profileApplicationSectionStackReadClassName}
      >
        {snapshot.experience?.map((experience) => {
          const displayProps = toExperienceDisplayProps(experience, labelMaps);

          return (
            <ProfileApplicationEntryCollapsible
              key={experience.experienceId}
              expandable={experienceHasExpandableDetails(experience)}
              trigger={
                <ProfileApplicationExperienceEntryHeader {...displayProps} />
              }
            >
              <ProfileExperienceContent
                {...displayProps}
                variant="details-only"
              />
            </ProfileApplicationEntryCollapsible>
          );
        })}
        {persistedOmissions?.experience ? (
          <ProfileApplicationOmissionRow label="Experience" />
        ) : null}
      </ProfileDisplaySection>,
    );
  }

  if (snapshot.projects?.length || persistedOmissions?.projects) {
    sections.push(
      <ProfileDisplaySection
        key="projects"
        sectionId="profile-application-projects"
        title="Projects"
        emptyMessage="No projects were imported."
        isEmpty={!snapshot.projects?.length && !persistedOmissions?.projects}
        stackClassName={profileApplicationSectionStackReadClassName}
      >
        {snapshot.projects?.map((project) => {
          const displayProps = toProjectDisplayProps(project);

          return (
            <ProfileApplicationEntryCollapsible
              key={project.projectId}
              expandable={projectHasExpandableDetails(project)}
              trigger={<ProfileApplicationProjectEntryHeader {...displayProps} />}
            >
              <ProfileProjectContent {...displayProps} variant="details-only" />
            </ProfileApplicationEntryCollapsible>
          );
        })}
        {persistedOmissions?.projects ? (
          <ProfileApplicationOmissionRow label="Projects" />
        ) : null}
      </ProfileDisplaySection>,
    );
  }

  if (snapshot.publications?.length || persistedOmissions?.publications) {
    sections.push(
      <ProfileDisplaySection
        key="publications"
        sectionId="profile-application-publications"
        title="Publications"
        emptyMessage="No publications were imported."
        isEmpty={
          !snapshot.publications?.length && !persistedOmissions?.publications
        }
        stackClassName={profileApplicationSectionStackReadClassName}
      >
        {snapshot.publications?.map((publication) => {
          const displayProps = toPublicationDisplayProps(publication);

          return (
            <ProfileApplicationEntryCollapsible
              key={publication.publicationId}
              expandable={publicationHasExpandableDetails(publication)}
              trigger={
                <ProfileApplicationPublicationEntryHeader {...displayProps} />
              }
            >
              <ProfilePublicationContent
                {...displayProps}
                variant="details-only"
              />
            </ProfileApplicationEntryCollapsible>
          );
        })}
        {persistedOmissions?.publications ? (
          <ProfileApplicationOmissionRow label="Publications" />
        ) : null}
      </ProfileDisplaySection>,
    );
  }

  if (
    snapshot.socialLinks?.length ||
    persistedOmissions?.socialPlatforms?.length
  ) {
    sections.push(
      <ProfileDisplaySection
        key="social"
        sectionId="profile-application-social"
        title="Social Links"
        emptyMessage="No social links were imported."
        isEmpty={
          !snapshot.socialLinks?.length &&
          !persistedOmissions?.socialPlatforms?.length
        }
        stackClassName={profileApplicationSectionStackReadClassName}
      >
        {snapshot.socialLinks?.map((social) => {
          const displayProps = toSocialDisplayProps(social, labelMaps);

          return (
            <ProfileApplicationEntryCollapsible
              key={social.platform}
              expandable={socialHasExpandableDetails(social)}
              trigger={<ProfileApplicationSocialEntryHeader {...displayProps} />}
            >
              <ProfileSocialContent {...displayProps} variant="details-only" />
            </ProfileApplicationEntryCollapsible>
          );
        })}
        {persistedOmissions?.socialPlatforms?.map((platform) => (
          <ProfileApplicationOmissionRow
            key={`social-omission-${platform}`}
            label={labelMaps.socialPlatformLabel(platform)}
          />
        ))}
      </ProfileDisplaySection>,
    );
  }

  if (!sections.length) {
    return null;
  }

  return <div className="space-y-8">{sections}</div>;
}
