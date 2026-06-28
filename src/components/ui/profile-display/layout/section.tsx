import type { ReactNode } from 'react';
import { SettingsAccountRoot } from '../../settings-account';
import { cn } from '../../../../lib/utils';
import { profileDisplaySectionLabelClassName } from '../primitives/typography';

type ProfileDisplaySectionProps = Readonly<{
  sectionId: string;
  title: string;
  description?: string;
  emptyMessage: string;
  isEmpty: boolean;
  children: ReactNode;
  className?: string;
  stackClassName?: string;
}>;

function ProfileDisplaySectionEmptyState({
  message,
}: Readonly<{ message: string }>) {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-muted/10 px-6 py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ProfileDisplaySection({
  sectionId,
  title,
  description,
  emptyMessage,
  isEmpty,
  children,
  className,
  stackClassName,
}: ProfileDisplaySectionProps) {
  return (
    <section
      id={sectionId}
      className={cn('scroll-mt-24 space-y-2', className)}
    >
      <p className={profileDisplaySectionLabelClassName}>{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {isEmpty ? (
        <ProfileDisplaySectionEmptyState message={emptyMessage} />
      ) : (
        <SettingsAccountRoot className={stackClassName}>{children}</SettingsAccountRoot>
      )}
    </section>
  );
}

type ProfileDisplaySectionsProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function ProfileDisplaySections({
  children,
  className,
}: ProfileDisplaySectionsProps) {
  return <div className={cn('space-y-12', className)}>{children}</div>;
}
