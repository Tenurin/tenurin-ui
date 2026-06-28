import { cn } from "../../lib/utils";
import { fieldSurfaceBorderClassName } from "./field-surface";
import type { ReactNode } from "react";

export {
  FormCheckboxTile,
  type FormCheckboxTileProps,
} from "./form-checkbox-tile";

export const formSectionEyebrowClassName =
  'text-[11px] uppercase tracking-[0.24em] text-muted-foreground';

type FormSectionProps = Readonly<{
  eyebrow: string;
  description?: string;
  eyebrowClassName?: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}>;

export default function FormSection({
  eyebrow,
  description,
  eyebrowClassName,
  className,
  contentClassName,
  children,
}: FormSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <p
          className={cn(formSectionEyebrowClassName, eyebrowClassName)}
        >
          {eyebrow}
        </p>
        {description ? (
          <p className="text-sm font-light text-[color-mix(in_oklab,var(--foreground)_85%,transparent)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className={cn('space-y-8', contentClassName)}>{children}</div>
    </section>
  );
}

type FormReadonlyValueProps = Readonly<{
  label: string;
  value: ReactNode;
  contentClassName?: string;
}>;

export function FormReadonlyValue({
  label,
  value,
  contentClassName,
}: FormReadonlyValueProps) {
  return (
    <div className="space-y-2.5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <div
        className={cn(
          `min-h-12 ${fieldSurfaceBorderClassName} px-4 py-3 text-sm text-[color-mix(in_oklab,var(--foreground)_58%,transparent)]`,
          contentClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}
