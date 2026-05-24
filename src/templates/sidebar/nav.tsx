'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '../../components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { cn } from '../../lib/utils';
import type { AppSidebarNavItem, AppSidebarNavSection } from './types';

type AppSidebarNavProps = Readonly<{
  sections: readonly AppSidebarNavSection[];
}>;

const sidebarLeadingIconClassName = '!size-3.5';
const collapsibleIndicatorClassName =
  'shrink-0 opacity-90 transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90';
const inactiveSidebarItemClassName = 'h-8 cursor-pointer rounded-sm text-xs';
const nestedSidebarItemClassName =
  'h-8 pl-3 text-xs leading-none flex-nowrap [&>span]:min-w-0 [&>span]:truncate [&>span]:whitespace-nowrap [&>span]:leading-none [&>svg:first-child]:-translate-y-px';

function withSubItemTooltip(node: ReactNode, title: string): ReactNode {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{node}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {title}
      </TooltipContent>
    </Tooltip>
  );
}

function renderSubItems(
  items: readonly AppSidebarNavItem[],
  addIndentation: boolean,
  depth: number,
  onNavigate?: () => void,
): ReactNode {
  return (
    <SidebarMenuSub
      className={
        addIndentation ? 'border-l-0 py-0' : 'mx-2 border-l-0 px-0 py-0'
      }
    >
      {items.map((item) => {
        const itemUrl = item.url;

        if (item.items !== undefined) {
          const content = (
            <SidebarMenuSubButton className={nestedSidebarItemClassName}>
              {item.icon && (
                <item.icon
                  className={cn(sidebarLeadingIconClassName, item.iconClassName)}
                  style={item.iconStyle}
                />
              )}
              <span>{item.title}</span>
              <ChevronDown className={collapsibleIndicatorClassName} />
            </SidebarMenuSubButton>
          );

          return (
            <SidebarMenuSubItem key={item.title}>
              <Collapsible className="group/collapsible">
                {depth >= 2 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>{content}</CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <CollapsibleTrigger asChild>{content}</CollapsibleTrigger>
                )}
                <CollapsibleContent>
                  {renderSubItems(item.items, true, depth + 1, onNavigate)}
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuSubItem>
          );
        }

        const content = (
          <SidebarMenuSubButton className={nestedSidebarItemClassName}>
            {item.icon && (
              <item.icon
                className={cn(sidebarLeadingIconClassName, item.iconClassName)}
                style={item.iconStyle}
              />
            )}
            <span>{item.title}</span>
          </SidebarMenuSubButton>
        );

        if (itemUrl == null) {
          return (
            <SidebarMenuSubItem key={item.title}>
              {depth >= 2 ? withSubItemTooltip(content, item.title) : content}
            </SidebarMenuSubItem>
          );
        }

        return (
          <SidebarMenuSubItem key={item.title}>
            <NavLink to={itemUrl} onClick={onNavigate}>
              {({ isActive }) => {
                const linkContent = (
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive}
                    className={nestedSidebarItemClassName}
                  >
                    <span>
                      {item.icon && (
                        <item.icon
                          className={cn(
                            sidebarLeadingIconClassName,
                            item.iconClassName,
                          )}
                          style={item.iconStyle}
                        />
                      )}
                      <span>{item.title}</span>
                    </span>
                  </SidebarMenuSubButton>
                );

                return depth >= 2
                  ? withSubItemTooltip(linkContent, item.title)
                  : linkContent;
              }}
            </NavLink>
          </SidebarMenuSubItem>
        );
      })}
    </SidebarMenuSub>
  );
}

export function AppSidebarNav({ sections }: AppSidebarNavProps) {
  const { isMobile, setOpenMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {sections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`}>
            {section.separated ? (
              <div
                aria-hidden
                className="mx-auto mt-3 mb-3 w-3/5 max-w-full border-t border-border pt-3"
              />
            ) : null}
            {section.items.map((item) =>
              item.items !== undefined ? (
                <Collapsible
                  key={item.title}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="h-8 rounded-sm text-xs"
                        tooltip={item.title}
                      >
                        {item.icon && (
                          <item.icon
                            className={cn(
                              sidebarLeadingIconClassName,
                              item.iconClassName,
                            )}
                            style={item.iconStyle}
                          />
                        )}
                        {!isCollapsed && <span>{item.title}</span>}
                        {!isCollapsed && (
                          <ChevronDown
                            className={collapsibleIndicatorClassName}
                          />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {renderSubItems(item.items, false, 1, handleNavigation)}
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  {item.url == null ? (
                    <SidebarMenuButton
                      className="h-8 rounded-sm text-xs"
                      tooltip={item.title}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            sidebarLeadingIconClassName,
                            item.iconClassName,
                          )}
                          style={item.iconStyle}
                        />
                      )}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <NavLink to={item.url} onClick={handleNavigation}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={
                            isActive
                              ? 'h-8 rounded-sm text-xs'
                              : inactiveSidebarItemClassName
                          }
                          tooltip={item.title}
                        >
                          <span>
                            {item.icon && (
                              <item.icon
                                className={cn(
                                  sidebarLeadingIconClassName,
                                  item.iconClassName,
                                )}
                                style={item.iconStyle}
                              />
                            )}
                            <span>{item.title}</span>
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  )}
                </SidebarMenuItem>
              ),
            )}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
