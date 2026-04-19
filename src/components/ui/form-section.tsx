import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

type FormSectionProps = Readonly<{
  eyebrow: string;
  description?: string;
  eyebrowClassName?: string;
  children: ReactNode;
}>;

export default function FormSection({
  eyebrow,
  description,
  eyebrowClassName,
  children,
}: FormSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p
          className={cn(
            'text-[11px] uppercase tracking-[0.24em] text-muted-foreground',
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
        {description ? (
          <p className="text-sm font-light text-[color-mix(in_oklab,var(--foreground)_85%,transparent)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

type FormReadonlyValueProps = Readonly<{
  label: string;
  value: string | number;
}>;

export function FormReadonlyValue({ label, value }: FormReadonlyValueProps) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <div className="min-h-12 rounded-sm border border-border/80 bg-neutral-50 px-4 py-3 text-sm text-[var(--foreground)] shadow-none dark:bg-neutral-800/30">
        {value}
      </div>
    </div>
  );
}
