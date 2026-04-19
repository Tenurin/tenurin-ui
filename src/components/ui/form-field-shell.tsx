import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Label } from './label';

type FormFieldShellProps = Readonly<{
  label: ReactNode;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  contentWrapperClassName?: string;
  htmlFor?: string;
  labelClassName?: string;
  errorClassName?: string;
  children: ReactNode;
}>;

export default function FormFieldShell({
  label,
  required = false,
  errorMessage,
  className,
  contentWrapperClassName,
  htmlFor,
  labelClassName,
  errorClassName,
  children,
}: FormFieldShellProps) {
  const content = contentWrapperClassName ? (
    <div className={contentWrapperClassName}>{children}</div>
  ) : (
    children
  );

  return (
    <div className={cn('space-y-3', className)}>
      <Label
        htmlFor={htmlFor}
        className={cn('text-sm text-[var(--foreground)]', labelClassName)}
      >
        {label}
        {required ? (
          <span className="ml-1 text-red-500 dark:text-red-400">*</span>
        ) : null}
      </Label>

      {content}

      {errorMessage ? (
        <p className={cn('text-sm text-destructive', errorClassName)}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
