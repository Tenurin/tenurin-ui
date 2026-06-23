import { ProfileEntryCardShell } from './profile-entry-card-shell';
import { ProfileProjectContent } from './profile-project-content';
import type { ProfileProjectDisplayProps } from './types';

export function ProfileProjectDisplayCard(props: ProfileProjectDisplayProps) {
  return (
    <ProfileEntryCardShell
      reorderAriaLabel={`Project ${props.title}`}
      editAriaLabel="Edit project"
      deleteAriaLabel="Delete project"
    >
      <ProfileProjectContent {...props} />
    </ProfileEntryCardShell>
  );
}
