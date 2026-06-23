import { ProfileEntryCardShell } from './profile-entry-card-shell';
import { ProfilePublicationContent } from './profile-publication-content';
import type { ProfilePublicationDisplayProps } from './types';

export function ProfilePublicationDisplayCard(
  props: ProfilePublicationDisplayProps,
) {
  return (
    <ProfileEntryCardShell
      reorderAriaLabel={`Publication ${props.title}`}
      editAriaLabel="Edit publication"
      deleteAriaLabel="Delete publication"
    >
      <ProfilePublicationContent {...props} />
    </ProfileEntryCardShell>
  );
}
