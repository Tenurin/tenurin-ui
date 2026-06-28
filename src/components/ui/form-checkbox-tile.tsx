import { Checkbox } from './checkbox';
import { Label } from './label';
import { cn } from '../../lib/utils';
import { fieldSurfaceBorderClassName } from './field-surface';

export type FormCheckboxTileProps = Readonly<{
  checked: boolean;
  className?: string;
  description: string;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}>;

export function FormCheckboxTile({
  checked,
  className,
  description,
  id,
  label,
  onCheckedChange,
}: FormCheckboxTileProps) {
  return (
    <div
      className={cn(
        fieldSurfaceBorderClassName,
        'flex min-h-16 items-start gap-3 px-4 py-3',
        className,
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
        className="mt-1"
      />
      <div className="min-w-0 space-y-1">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default FormCheckboxTile;
