import { ProfileEntryCardShell } from './profile-entry-card-shell';
import { ProfileSocialContent } from './profile-social-content';
import type { ProfileSocialDisplayProps } from './types';

export function ProfileSocialDisplayCard(props: ProfileSocialDisplayProps) {
  return (
    <ProfileEntryCardShell
      reorderAriaLabel={`Social link ${props.platformLabel}`}
      editAriaLabel="Edit social link"
      deleteAriaLabel="Delete social link"
    >
      <ProfileSocialContent {...props} />
    </ProfileEntryCardShell>
  );
}
