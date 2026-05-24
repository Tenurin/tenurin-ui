import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export const compensationFrequency = Object.freeze({
  annual: 'annual',
  monthly: 'monthly',
  weekly: 'weekly',
  daily: 'daily',
  hourly: 'hourly',
  oneTime: 'one-time',
  custom: 'custom',
});

export type CompensationFrequency =
  (typeof compensationFrequency)[keyof typeof compensationFrequency];

const compensationFrequencyLabels: Record<CompensationFrequency, string> = {
  [compensationFrequency.annual]: 'Per year',
  [compensationFrequency.monthly]: 'Per month',
  [compensationFrequency.weekly]: 'Per week',
  [compensationFrequency.daily]: 'Per day',
  [compensationFrequency.hourly]: 'Per hour',
  [compensationFrequency.oneTime]: 'One-time',
  [compensationFrequency.custom]: 'Custom',
};

type CompensationFrequencyLabelOptions = Readonly<{
  numberOfHours?: number | null;
}>;

export function getCompensationFrequencyLabel(
  frequency: CompensationFrequency,
  options: CompensationFrequencyLabelOptions = {},
): string {
  if (
    frequency === compensationFrequency.custom &&
    isPositiveNumber(options.numberOfHours)
  ) {
    return formatHours(options.numberOfHours);
  }

  return compensationFrequencyLabels[frequency];
}

type CompensationFrequencyPillProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> &
  Readonly<{
    frequency: CompensationFrequency;
    numberOfHours?: number | null;
  }>;

export function CompensationFrequencyPill({
  frequency,
  numberOfHours,
  className,
  ...props
}: CompensationFrequencyPillProps) {
  return (
    <span
      className={cn(
        'ui-app-accent-neutral-surface inline-flex shrink-0 items-center rounded-sm border px-2 py-1 text-[11px] font-medium leading-none',
        className,
      )}
      {...props}
    >
      {getCompensationFrequencyLabel(frequency, { numberOfHours })}
    </span>
  );
}

function isPositiveNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function formatHours(numberOfHours: number): string {
  const formattedHours = numberOfHours.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });
  const unit = numberOfHours === 1 ? 'hour' : 'hours';

  return `${formattedHours} ${unit}`;
}
