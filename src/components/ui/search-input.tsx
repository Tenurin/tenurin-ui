import type { ChangeEventHandler } from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Input } from './input';

type SearchInputProps = Readonly<{
  id: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  disabled?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  clearButtonClassName?: string;
}>;

export default function SearchInput({
  id,
  placeholder,
  value,
  onChange,
  onClear,
  disabled = false,
  wrapperClassName,
  inputClassName,
  iconClassName,
  clearButtonClassName,
}: SearchInputProps) {
  const hasSearchQuery = value.length > 0;

  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
        <Search
          className={cn('h-4 w-4 text-muted-foreground', iconClassName)}
        />
      </div>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'h-10 w-full rounded-sm bg-background focus-visible:border-foreground/20 focus-visible:ring-0 dark:bg-background dark:focus-visible:border-foreground/20',
          inputClassName,
        )}
        style={{
          paddingLeft: '3rem',
          paddingRight: hasSearchQuery ? '2.75rem' : undefined,
        }}
      />
      {hasSearchQuery ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'absolute inset-y-0 right-1 z-10 my-auto size-8 rounded-sm text-muted-foreground hover:text-[var(--foreground)]',
            clearButtonClassName,
          )}
          onClick={onClear}
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
