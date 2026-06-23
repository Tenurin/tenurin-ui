import { ProfileEducationContent } from './profile-education-content';
import { ProfileEntryCardShell } from './profile-entry-card-shell';
import type { ProfileEducationDisplayProps } from './types';

export function ProfileEducationDisplayCard(props: ProfileEducationDisplayProps) {
  return (
    <ProfileEntryCardShell
      reorderAriaLabel={`Education ${props.instituteName}`}
      editAriaLabel="Edit education"
      deleteAriaLabel="Delete education"
    >
      <ProfileEducationContent {...props} />
    </ProfileEntryCardShell>
  );
}
