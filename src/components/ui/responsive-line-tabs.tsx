import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import { authInputClassName } from './auth-form';
import { cn } from '../../lib/utils';

export type ResponsiveLineTabItem = Readonly<{
  value: string;
  label: string;
  disabled?: boolean;
}>;

export type ResponsiveLineTabsProps = Readonly<{
  items: readonly ResponsiveLineTabItem[];
  value: string;
  onValueChange: (value: string) => void;
  isValidValue?: (value: string) => boolean;
  mobileAriaLabel?: string;
  className?: string;
  tabsListClassName?: string;
  tabTriggerClassName?: string;
}>;

export const responsiveLineTabTriggerClassName =
  'flex-none px-0 pb-4 text-sm text-muted-foreground data-[state=active]:text-[var(--foreground)]';

const mobileSelectTriggerClassName = cn(authInputClassName, '!h-9 w-fit');

export function ResponsiveLineTabs({
  items,
  value,
  onValueChange,
  isValidValue,
  mobileAriaLabel = 'Section',
  className,
  tabsListClassName,
  tabTriggerClassName = responsiveLineTabTriggerClassName,
}: ResponsiveLineTabsProps) {
  const handleValueChange = (nextValue: string) => {
    if (isValidValue && !isValidValue(nextValue)) {
      return;
    }

    onValueChange(nextValue);
  };

  return (
    <div className={className}>
      <div className="sm:hidden">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger
            className={mobileSelectTriggerClassName}
            aria-label={mobileAriaLabel}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <Tabs
          value={value}
          onValueChange={handleValueChange}
          className="gap-0"
        >
          <TabsList
            variant="line"
            className={cn('gap-8 border-none px-0 sm:gap-10', tabsListClassName)}
          >
            {items.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={tabTriggerClassName}
                disabled={item.disabled}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
