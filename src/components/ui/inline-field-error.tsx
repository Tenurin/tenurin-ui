import { AlertCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '../../lib/utils';

export const inlineFieldErrorClassName =
  'flex gap-2 text-xs font-medium leading-5 ui-app-accent-negative-fg';

export const inlineFieldErrorIconClassName = 'h-3.5 w-3.5 shrink-0';

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
      <span
        aria-hidden
        className="inline-flex h-5 shrink-0 items-center"
      >
        <AlertCircle className={cn(inlineFieldErrorIconClassName, iconClassName)} />
      </span>
      <div className="min-w-0 text-pretty">{content}</div>
    </div>
  );
}

export default InlineFieldError;
