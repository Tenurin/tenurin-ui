import type { ReactNode } from 'react';
import { Badge } from './badge';
import InlineFieldError from './inline-field-error';
import { Label } from './label';
import { cn } from '../../lib/utils';

type DetailPanelProps = Readonly<{
  title: string;
  icon?: ReactNode;
  className?: string;
  headerSuffix?: ReactNode;
  children: ReactNode;
}>;

export function DetailPanel({
  title,
  icon,
  className,
  headerSuffix,
  children,
}: DetailPanelProps) {
  return (
    <section
      className={cn(
        'rounded-sm border border-border/60 bg-sidebar p-6',
        className,
      )}
    >
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <span className="text-muted-foreground/80">{icon}</span>
          <span>{title}</span>
        </div>
        {headerSuffix}
      </div>
      {children}
    </section>
  );
}

type DetailMetaItemProps = Readonly<{
  label: string;
  value: ReactNode;
  className?: string;
}>;

export function DetailMetaItem({
  label,
  value,
  className,
}: DetailMetaItemProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-medium text-[var(--foreground)]">
        {value}
      </div>
    </div>
  );
}

type DetailValueBoxProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function DetailValueBox({ children, className }: DetailValueBoxProps) {
  return (
    <div
      className={cn(
        'rounded-sm border border-border/60 bg-background/70 px-4 py-3 text-sm text-[var(--foreground)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

type DetailFieldProps = Readonly<{
  label: string;
  htmlFor?: string;
  className?: string;
  error?: ReactNode;
  children: ReactNode;
}>;

export function DetailField({
  label,
  htmlFor,
  className,
  error,
  children,
}: DetailFieldProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Label
        htmlFor={htmlFor}
        className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
      >
        {label}
      </Label>
      {children}
      <InlineFieldError message={error} />
    </div>
  );
}

type DetailInnerPanelProps = Readonly<{
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}>;

export function DetailInnerPanel({
  title,
  description,
  children,
  className,
}: DetailInnerPanelProps) {
  return (
    <div
      className={cn(
        'rounded-sm border border-border/60 bg-background/70 p-5',
        className,
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium leading-tight">{title}</p>
          {children}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type DetailPillProps = Readonly<{
  label: string;
  tone?: 'default' | 'positive' | 'warning' | 'negative' | 'cool';
  className?: string;
}>;

const pillToneClassName: Record<
  NonNullable<DetailPillProps['tone']>,
  string
> = {
  default: 'ui-app-accent-neutral-surface',
  positive: 'ui-app-accent-positive-surface',
  warning: 'ui-app-accent-warm-surface',
  negative: 'ui-app-accent-negative-surface',
  cool: 'ui-app-accent-cool-surface',
};

export function DetailPill({
  label,
  tone = 'default',
  className,
}: DetailPillProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-sm border px-2.5 py-1 text-sm uppercase',
        pillToneClassName[tone],
        className,
      )}
    >
      {label}
    </Badge>
  );
}

export function DetailEmptyState({ message }: Readonly<{ message: string }>) {
  return <p className="text-sm text-muted-foreground">{message}</p>;
}
