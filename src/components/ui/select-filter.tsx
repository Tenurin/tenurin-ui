import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';

export type SelectFilterOption = Readonly<{
  value: string;
  label: string;
}>;

type SelectFilterProps = Readonly<{
  value: string;
  options: readonly SelectFilterOption[];
  onValueChange: (value: string) => void;
  placeholder: string;
  prefixLabel?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  renderTrigger?: (
    selectedOption: SelectFilterOption | undefined,
    placeholder: string,
  ) => ReactNode;
}>;

export default function SelectFilter({
  value,
  options,
  onValueChange,
  placeholder,
  prefixLabel,
  disabled = false,
  className,
  contentClassName,
  renderTrigger,
}: SelectFilterProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          'h-10 rounded-sm border-border bg-background px-4 text-[var(--foreground)] shadow-none transition-colors hover:border-foreground/20 focus-visible:border-foreground/20 focus-visible:ring-0 data-[size=default]:h-10 dark:bg-background',
          className,
        )}
      >
        {renderTrigger ? (
          renderTrigger(selectedOption, placeholder)
        ) : prefixLabel ? (
          <span className="truncate">
            <span style={{ color: 'var(--muted-foreground)' }}>
              {prefixLabel}:
            </span>{' '}
            <span style={{ color: 'var(--foreground)' }}>
              {selectedOption?.label ?? placeholder}
            </span>
          </span>
        ) : (
          <span className="truncate">
            {selectedOption?.label ?? placeholder}
          </span>
        )}
      </SelectTrigger>
      <SelectContent className={cn(contentClassName)}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
