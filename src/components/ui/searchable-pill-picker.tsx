import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Badge } from './badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { DetailEmptyState } from './detail-section';
import InlineFieldError from './inline-field-error';
import { cn } from '../../lib/utils';

export type SearchablePillOption = Readonly<{
  id: string;
  label: string;
}>;

export type SearchablePillPickerProps = Readonly<{
  availableGroupHeading?: string;
  beforeSearch?: ReactNode;
  className?: string;
  commandClassName?: string;
  commandListClassName?: string;
  disabled?: boolean;
  emptySearchMessage?: string;
  emptySelectedMessage?: string;
  errorMessage?: string | null;
  hideSearch?: boolean;
  hideSelected?: boolean;
  hideSelectedHeader?: boolean;
  maxSelected?: number;
  onAdd: (option: SearchablePillOption) => void;
  onRemove: (id: string) => void;
  options: SearchablePillOption[];
  readOnly?: boolean;
  renderOption?: (option: SearchablePillOption) => ReactNode;
  searchPlaceholder?: string;
  selected: SearchablePillOption[];
  selectedHeading?: string;
}>;

/**
 * Searchable command list for picking items, with selected values shown as removable pills.
 */
export function SearchablePillPicker({
  availableGroupHeading = 'Available',
  beforeSearch,
  className,
  commandClassName,
  commandListClassName,
  disabled = false,
  emptySearchMessage = 'No results found.',
  emptySelectedMessage = 'Nothing selected.',
  errorMessage,
  hideSearch = false,
  hideSelected = false,
  hideSelectedHeader = false,
  maxSelected,
  onAdd,
  onRemove,
  options,
  readOnly = false,
  renderOption,
  searchPlaceholder = 'Search to add...',
  selected,
  selectedHeading = 'Selected',
}: SearchablePillPickerProps) {
  const canAdd =
    !readOnly &&
    !hideSearch &&
    (maxSelected == null || selected.length < maxSelected);

  const handleAdd = (option: SearchablePillOption) => {
    if (disabled || !canAdd) {
      return;
    }

    onAdd(option);
  };

  const handleRemove = (id: string) => {
    if (disabled || readOnly) {
      return;
    }

    onRemove(id);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {beforeSearch}

      {canAdd ? (
        <Command
          className={cn(
            'rounded-sm border border-border/60 bg-background/70 shadow-none',
            commandClassName,
          )}
        >
          <CommandInput placeholder={searchPlaceholder} disabled={disabled} />
          <CommandList className={commandListClassName}>
            <CommandEmpty>{emptySearchMessage}</CommandEmpty>
            <CommandGroup heading={availableGroupHeading}>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  onSelect={() => handleAdd(option)}
                  disabled={disabled}
                  className="cursor-pointer"
                >
                  {renderOption ? renderOption(option) : option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      ) : null}

      {hideSelected ? null : (
        <div className="space-y-4">
          {hideSelectedHeader ? null : (
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {selectedHeading}
              </p>
              <Badge variant="outline" className="ui-app-accent-neutral-surface">
                {maxSelected == null
                  ? selected.length
                  : `${selected.length} / ${maxSelected}`}
              </Badge>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {selected.length > 0 ? (
              selected.map((option) => (
                <Badge
                  key={option.id}
                  variant="outline"
                  className={cn(
                    'ui-app-accent-neutral-surface gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium',
                    readOnly
                      ? null
                      : 'cursor-pointer transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive',
                  )}
                  onClick={
                    readOnly ? undefined : () => handleRemove(option.id)
                  }
                >
                  {option.label}
                  {readOnly ? null : <X className="size-2.5" />}
                </Badge>
              ))
            ) : (
              <DetailEmptyState message={emptySelectedMessage} />
            )}
          </div>
        </div>
      )}

      {hideSelected ? null : (
        <InlineFieldError message={errorMessage ?? null} />
      )}
    </div>
  );
}
