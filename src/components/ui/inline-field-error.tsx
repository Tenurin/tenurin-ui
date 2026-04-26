import { AlertCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils';

export const inlineFieldErrorClassName =
  'flex items-start gap-2 text-xs font-medium ui-app-accent-negative-fg';

export const inlineFieldErrorIconClassName =
  'mt-0.5 h-3.5 w-3.5 shrink-0';

export type InlineFieldErrorProps = Omit<
  ComponentProps<'div'>,
  'children'
> &
  Readonly<{
    children?: ReactNode;
    iconClassName?: string;
    message?: ReactNode;
  }>;

export function InlineFieldError({
  children,
  className,
  iconClassName,
  message,
  role = 'alert',
  ...props
}: InlineFieldErrorProps) {
  const content = message ?? children;

  if (!content) {
    return null;
  }

  return (
    <div
      role={role}
      className={cn(inlineFieldErrorClassName, className)}
      {...props}
    >
      <AlertCircle className={cn(inlineFieldErrorIconClassName, iconClassName)} />
      <div className="min-w-0">{content}</div>
    </div>
  );
}

export default InlineFieldError;
