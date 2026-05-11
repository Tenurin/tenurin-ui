import { useTheme } from 'next-themes';
import {
  CircleAlert,
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';
import type { ToastClassnames, ToasterProps } from 'sonner';

import { alertSurfaceBaseClassName } from './alert-surface';
import { cn } from '../../lib/utils';

/** Sonner injects `[data-icon]{ align-items:center }`; top-align SVG with first text line. */
const toastIconSlotAlignmentClassName =
  '[&_[data-icon]]:!items-start [&_[data-icon]]:!justify-start';

const toastIconClassNames = {
  default: cn(
    toastIconSlotAlignmentClassName,
    '[&_[data-icon]]:ui-app-accent-cool-fg [&_[data-icon]_svg]:ui-app-accent-cool-fg',
  ),
  error: cn(
    toastIconSlotAlignmentClassName,
    '[&_[data-icon]]:ui-app-accent-negative-fg [&_[data-icon]_svg]:ui-app-accent-negative-fg',
  ),
  info: cn(
    toastIconSlotAlignmentClassName,
    '[&_[data-icon]]:ui-app-accent-cool-fg [&_[data-icon]_svg]:ui-app-accent-cool-fg',
  ),
  loading: cn(
    toastIconSlotAlignmentClassName,
    '[&_[data-icon]]:ui-app-accent-cool-fg [&_[data-icon]_svg]:ui-app-accent-cool-fg',
  ),
  success: cn(
    toastIconSlotAlignmentClassName,
    '[&_[data-icon]]:ui-app-accent-positive-fg [&_[data-icon]_svg]:ui-app-accent-positive-fg',
  ),
  warning: cn(
    toastIconSlotAlignmentClassName,
    '[&_[data-icon]]:ui-app-accent-warm-fg [&_[data-icon]_svg]:ui-app-accent-warm-fg',
  ),
};

const toastClassNames = {
  toast: cn(
    alertSurfaceBaseClassName,
    // Sonner injects `[data-sonner-toast][data-styled]{ align-items:center }`; win
    // with important so the icon stays top-aligned with the first line of copy.
    'toast group flex w-full !items-start gap-3 !rounded-sm px-5 py-4',
  ),
  title: 'text-base font-medium leading-6 text-foreground',
  description: 'text-sm leading-5 text-muted-foreground',
  content: 'grid gap-1',
  icon: 'self-start ui-app-accent-cool-fg [&>svg]:size-5',
  closeButton:
    'border-border bg-sidebar text-muted-foreground hover:bg-muted hover:text-foreground',
  actionButton:
    'rounded-sm bg-primary px-3 py-2 text-sm font-medium text-primary-foreground',
  cancelButton:
    'rounded-sm border border-border bg-sidebar px-3 py-2 text-sm font-medium text-foreground',
  default: toastIconClassNames.default,
  error: toastIconClassNames.error,
  info: toastIconClassNames.info,
  loading: toastIconClassNames.loading,
  success: toastIconClassNames.success,
  warning: toastIconClassNames.warning,
} satisfies ToastClassnames;

const toastIcons = {
  error: <CircleAlert className="size-5" />,
  info: <Info className="size-5" />,
  loading: <Loader2 className="size-5 animate-spin" />,
  success: <CircleCheck className="size-5" />,
  warning: <TriangleAlert className="size-5" />,
};

const Toaster = ({ icons, style, toastOptions, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--sidebar)',
          '--normal-text': 'var(--sidebar-foreground)',
          '--normal-border': 'var(--border)',
          '--width': 'min(40rem, calc(100vw - 2rem))',
          ...style,
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        // Sonner injects `[data-sonner-toast][data-styled]{ align-items:center }`
        // after bundled CSS; inline `alignItems` wins so the icon lines up with the
        // first line of title + description.
        style: {
          alignItems: 'flex-start',
          ...toastOptions?.style,
        },
        classNames: {
          ...toastClassNames,
          ...toastOptions?.classNames,
        },
      }}
      icons={{
        ...toastIcons,
        ...icons,
      }}
      {...props}
    />
  );
};

export { Toaster };
export { toast } from 'sonner';
