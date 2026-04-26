'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '../../lib/utils';
import FormFieldShell from './form-field-shell';
import InlineFieldError from './inline-field-error';
import { Input } from './input';
import { Label } from './label';

export const authInputClassName =
  'h-12 rounded-sm border border-border/80 bg-neutral-50 px-4 text-sm text-[var(--foreground)] shadow-none placeholder:text-neutral-500 focus-visible:border-ring/60 focus-visible:ring-2 focus-visible:ring-ring/20 dark:!bg-neutral-800/30 dark:placeholder:text-neutral-400';

export const authInputErrorClassName = 'ui-app-accent-negative-input';

export const authLabelClassName =
  'text-[11px] uppercase text-muted-foreground';

export const authPrimaryButtonClassName =
  'mt-1 h-12 w-full rounded-sm border border-transparent !bg-primary text-base !text-primary-foreground transition hover:!bg-primary/90';

export const authFooterLinkClassName =
  'cursor-pointer font-medium !text-[var(--foreground)] underline underline-offset-4 transition hover:!text-[color-mix(in_oklab,var(--foreground)_80%,transparent)] disabled:cursor-not-allowed disabled:opacity-60';

export const authFooterTextClassName = 'text-muted-foreground';

export const authPanelContainerClassName =
  'w-full rounded-sm border border-sidebar-border bg-sidebar px-5 py-6 text-[var(--foreground)] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.55)] sm:px-6 sm:py-7 md:px-8 md:py-8';

export const authAuxiliaryLinkClassName =
  'cursor-pointer text-xs font-medium text-muted-foreground underline-offset-4 transition hover:text-[var(--foreground)] hover:underline disabled:cursor-not-allowed disabled:opacity-60';

export const authLegalLinkClassName =
  'text-[11px] font-medium uppercase text-muted-foreground transition hover:text-[var(--foreground)]';

export type AuthFieldErrorProps = Readonly<{
  className?: string;
  message?: string;
}>;

export function AuthFieldError({
  className,
  message,
}: AuthFieldErrorProps) {
  if (!message) {
    return null;
  }

  return <InlineFieldError className={className} message={message} />;
}

type AuthInputProps = Omit<
  ComponentProps<typeof Input>,
  'aria-invalid' | 'className' | 'id' | 'placeholder' | 'type'
> &
  Readonly<{
    className?: string;
  }>;

export type AuthTextFieldProps = Readonly<{
  id: string;
  label: ReactNode;
  type?: ComponentProps<typeof Input>['type'];
  placeholder?: string;
  errorMessage?: string;
  inputProps?: AuthInputProps;
}>;

export function AuthTextField({
  id,
  label,
  type = 'text',
  placeholder,
  errorMessage,
  inputProps,
}: AuthTextFieldProps) {
  const { className, ...restInputProps } = inputProps ?? {};

  return (
    <FormFieldShell
      htmlFor={id}
      label={label}
      labelClassName={authLabelClassName}
      errorMessage={errorMessage}
      errorClassName="text-xs"
      className="space-y-2"
    >
      <Input
        {...restInputProps}
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(errorMessage)}
        className={cn(
          authInputClassName,
          errorMessage ? authInputErrorClassName : undefined,
          className,
        )}
      />
    </FormFieldShell>
  );
}

type AuthPasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  'aria-invalid' | 'className' | 'id' | 'placeholder' | 'type'
> &
  Readonly<{
    className?: string;
  }>;

export type AuthPasswordFieldProps = Readonly<{
  id: string;
  label: ReactNode;
  placeholder?: string;
  errorMessage?: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  labelAction?: ReactNode;
  inputProps?: AuthPasswordInputProps;
}>;

export function AuthPasswordField({
  id,
  label,
  placeholder,
  errorMessage,
  isVisible,
  onToggleVisibility,
  labelAction,
  inputProps,
}: AuthPasswordFieldProps) {
  const { className, ...restInputProps } = inputProps ?? {};
  const visibilityLabel = isVisible ? 'Hide password' : 'Show password';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className={authLabelClassName}>
          {label}
        </Label>
        {labelAction}
      </div>

      <div className="relative">
        <Input
          {...restInputProps}
          id={id}
          placeholder={placeholder}
          type={isVisible ? 'text' : 'password'}
          aria-invalid={Boolean(errorMessage)}
          className={cn(
            authInputClassName,
            'pr-12',
            errorMessage ? authInputErrorClassName : undefined,
            className,
          )}
        />
        <button
          type="button"
          aria-label={visibilityLabel}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-[var(--foreground)]"
          onClick={onToggleVisibility}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      <AuthFieldError message={errorMessage} />
    </div>
  );
}
