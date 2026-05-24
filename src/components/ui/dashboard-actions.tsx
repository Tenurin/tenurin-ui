import type { ComponentProps } from 'react';
import { CircleHelpIcon, Moon, Sun } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from './button';

export type DashboardTheme = 'dark' | 'light' | 'system';

export type DashboardActionButtonProps = ComponentProps<typeof Button>;

export const dashboardActionButtonClassName =
  'cursor-pointer border-sidebar-border bg-sidebar text-sidebar-foreground shadow-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';

export function getNextDashboardTheme(theme: DashboardTheme): DashboardTheme {
  if (theme === 'dark') {
    return 'light';
  }

  return 'dark';
}

export function DashboardActionButton({
  className,
  size = 'icon',
  type = 'button',
  variant = 'outline',
  ...props
}: Readonly<DashboardActionButtonProps>) {
  return (
    <Button
      className={cn(dashboardActionButtonClassName, className)}
      size={size}
      type={type}
      variant={variant}
      {...props}
    />
  );
}

export type DashboardHelpActionButtonProps = Omit<
  DashboardActionButtonProps,
  'children'
>;

export function DashboardHelpActionButton({
  'aria-label': ariaLabel = 'Open help request',
  ...props
}: Readonly<DashboardHelpActionButtonProps>) {
  return (
    <DashboardActionButton aria-label={ariaLabel} {...props}>
      <CircleHelpIcon />
    </DashboardActionButton>
  );
}

export type DashboardThemeToggleProps = Omit<
  DashboardActionButtonProps,
  'children' | 'onClick'
> & {
  onThemeChange: (theme: DashboardTheme) => void;
  theme: DashboardTheme;
};

export function DashboardThemeToggle({
  'aria-label': ariaLabel = 'Toggle theme',
  onThemeChange,
  theme,
  ...props
}: Readonly<DashboardThemeToggleProps>) {
  return (
    <DashboardActionButton
      aria-label={ariaLabel}
      onClick={() => onThemeChange(getNextDashboardTheme(theme))}
      {...props}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </DashboardActionButton>
  );
}
