'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '../../components/ui/sidebar';
import type { AppSidebarUser } from './types';

type AppSidebarUserMenuProps = Readonly<{
  user: AppSidebarUser;
}>;

function buildFallbackLabel(user: AppSidebarUser): string {
  if (user.name != null && user.name.trim().length > 0) {
    return user.name.slice(0, 2).toUpperCase();
  }

  return (user.fallbackLabel ?? 'TN').slice(0, 2).toUpperCase();
}

export function AppSidebarUserMenu({ user }: AppSidebarUserMenuProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="grid min-h-12 w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-sm px-2 py-2 text-left text-xs text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:grid-cols-1 group-data-[collapsible=icon]:justify-items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0"
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-sm">
                <AvatarImage src={user.avatar} alt={user.name ?? 'User'} />
                <AvatarFallback
                  className="rounded-sm border"
                  style={{
                    backgroundColor:
                      'color-mix(in oklab, var(--app-accent-triad-c-fg) 14%, transparent)',
                    borderColor:
                      'color-mix(in oklab, var(--app-accent-triad-c-fg) 22%, var(--border))',
                    color: 'var(--app-accent-triad-c-fg)',
                  }}
                >
                  {buildFallbackLabel(user)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 overflow-hidden text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                <span className="block truncate font-medium text-[var(--foreground)]">
                  {user.name ?? 'User'}
                </span>
              </div>
              <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-sm"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {user.menuEntries.map((entry, index) =>
              entry.type === 'separator' ? (
                <DropdownMenuSeparator key={`separator-${index}`} />
              ) : (
                <DropdownMenuItem
                  key={`${entry.label}-${index}`}
                  className="cursor-pointer"
                  onClick={entry.onSelect}
                >
                  <entry.icon className="mr-2 inline" />
                  {entry.label}
                  {entry.trailingIcon ? (
                    <entry.trailingIcon className="ml-2 inline" />
                  ) : null}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
