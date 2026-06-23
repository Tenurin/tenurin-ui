import { ProfileEntryCardShell } from './profile-entry-card-shell';
import { ProfileExperienceContent } from './profile-experience-content';
import type { ProfileExperienceDisplayProps } from './types';

export function ProfileExperienceDisplayCard(
  props: ProfileExperienceDisplayProps,
) {
  return (
    <ProfileEntryCardShell
      reorderAriaLabel={`Experience ${props.organizationName}`}
      editAriaLabel="Edit experience"
      deleteAriaLabel="Delete experience"
    >
      <ProfileExperienceContent {...props} />
    </ProfileEntryCardShell>
  );
}
