'use client';

import type { ReactNode } from 'react';
import { cn } from '../../../../lib/utils';
import { useProfileSectionNav } from './use-section-nav';

export type ProfileDisplaySectionNavItem = Readonly<{
  id: string;
  label: string;
}>;

type ProfileDisplaySectionNavProps = Readonly<{
  items: readonly ProfileDisplaySectionNavItem[];
  activeSectionId: string;
  onSelect: (sectionId: string) => void;
  className?: string;
}>;

export function ProfileDisplaySectionNav({
  items,
  activeSectionId,
  onSelect,
  className,
}: ProfileDisplaySectionNavProps) {
  return (
    <nav
      aria-label="Profile sections"
      className={cn('relative border-l border-border/60 pl-4', className)}
    >
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === activeSectionId;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'relative w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-muted/40 text-[var(--foreground)] before:absolute before:inset-y-1.5 before:-left-4 before:w-1 before:rounded-full before:bg-[var(--foreground)] before:content-[""]'
                    : 'text-muted-foreground hover:text-[var(--foreground)]',
                )}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type ProfileDisplayWithSectionNavProps = Readonly<{
  items: readonly ProfileDisplaySectionNavItem[];
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  navClassName?: string;
}>;

export function ProfileDisplayWithSectionNav({
  items,
  children,
  className,
  contentClassName,
  navClassName,
}: ProfileDisplayWithSectionNavProps) {
  const sectionIds = items.map((item) => item.id);
  const { activeSectionId, scrollToSection } =
    useProfileSectionNav(sectionIds);

  return (
    <div className={cn('flex items-start gap-10 xl:gap-14', className)}>
      <div className={cn('min-w-0 flex-1', contentClassName)}>{children}</div>

      <aside className="sticky top-24 hidden w-44 shrink-0 self-start lg:block xl:w-48">
        <ProfileDisplaySectionNav
          items={items}
          activeSectionId={activeSectionId}
          onSelect={scrollToSection}
          className={navClassName}
        />
      </aside>
    </div>
  );
}
