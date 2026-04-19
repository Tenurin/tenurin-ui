import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';

export type AppSidebarNavItem = Readonly<{
  icon?: LucideIcon;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  items?: readonly AppSidebarNavItem[];
  title: string;
  url?: string;
}>;

export type AppSidebarNavSection = Readonly<{
  items: readonly AppSidebarNavItem[];
  separated?: boolean;
}>;

export type AppSidebarUserMenuEntry =
  | Readonly<{
      icon: LucideIcon;
      label: string;
      onSelect: () => void;
      trailingIcon?: LucideIcon;
      type: 'item';
    }>
  | Readonly<{
      type: 'separator';
    }>;

export type AppSidebarUser = Readonly<{
  avatar?: string;
  fallbackLabel?: string;
  menuEntries: readonly AppSidebarUserMenuEntry[];
  name: string | null;
}>;
