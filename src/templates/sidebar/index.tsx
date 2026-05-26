'use client';

import type { ComponentProps } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../../components/ui/sidebar';
import { Logo } from '../../components/ui/logo';
import { cn } from '../../lib/utils';
import { AppSidebarNav } from './nav';
import type { AppSidebarNavSection, AppSidebarUser } from './types';
import { AppSidebarUserMenu } from './user-menu';

export type {
  AppSidebarNavItem,
  AppSidebarNavSection,
  AppSidebarUser,
  AppSidebarUserMenuEntry,
} from './types';

export type AppSidebarTemplateProps = ComponentProps<typeof Sidebar> &
  Readonly<{
    brandLabel?: string;
    sections: readonly AppSidebarNavSection[];
    user: AppSidebarUser;
    navHintMode?: 'responsive' | 'tooltip';
  }>;

export function AppSidebarTemplate({
  brandLabel = 'Tenurin',
  className,
  sections,
  user,
  navHintMode = 'responsive',
  ...props
}: AppSidebarTemplateProps) {
  return (
    <Sidebar
      collapsible="icon"
      className={cn('border-none', className)}
      {...props}
    >
      <SidebarHeader className="ml-2 h-16 justify-center">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="overflow-hidden text-md leading-tight text-[var(--foreground)]">
            {brandLabel}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarNav sections={sections} hintMode={navHintMode} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUserMenu user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
