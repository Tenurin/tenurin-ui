import type { ComponentProps, ReactNode } from 'react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../button';
import { settingsAccountSectionSurfaceClassName } from '../settings-account';
import { cn } from '../../../lib/utils';

type DragHandleProps = ComponentProps<'button'>;

export type ProfileEntryCardShellProps = Readonly<{
  children: ReactNode;
  reorderAriaLabel: string;
  editAriaLabel: string;
  deleteAriaLabel: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isReorderMode?: boolean;
  isDragging?: boolean;
  dragHandleProps?: DragHandleProps;
}>;

export function ProfileEntryCardShell({
  children,
  reorderAriaLabel,
  editAriaLabel,
  deleteAriaLabel,
  onEdit,
  onDelete,
  isReorderMode = false,
  isDragging = false,
  dragHandleProps,
}: ProfileEntryCardShellProps) {
  const showActions = onEdit != null || onDelete != null;
  const dragRailClassName =
    'flex w-10 shrink-0 items-center justify-center self-stretch rounded-l-sm border-r border-sidebar-border text-muted-foreground';

  let dragRail: ReactNode = null;
  if (isReorderMode) {
    if (dragHandleProps) {
      dragRail = (
        <button
          type="button"
          className={cn(
            dragRailClassName,
            'cursor-grab touch-none hover:bg-muted hover:text-foreground active:cursor-grabbing',
          )}
          aria-label={reorderAriaLabel}
          {...dragHandleProps}
        >
          <GripVertical className="size-3.5" />
        </button>
      );
    } else {
      dragRail = (
        <div aria-hidden className={cn(dragRailClassName, 'bg-muted/30')}>
          <GripVertical className="size-3.5" />
        </div>
      );
    }
  }

  return (
    <article
      className={cn(
        settingsAccountSectionSurfaceClassName,
        'p-2',
        isReorderMode && 'flex items-stretch gap-0 p-0',
        isDragging && 'shadow-md ring-2 ring-primary/40',
      )}
    >
      {dragRail}

      {showActions && !isReorderMode ? (
        <div className="text-right">
          {onEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7"
              onClick={onEdit}
              aria-label={editAriaLabel}
            >
              <Pencil className="size-3.5" />
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="ui-app-accent-negative-fg size-7 rounded-sm hover:bg-destructive/10 hover:text-[var(--app-accent-negative-fg)]"
              onClick={onDelete}
              aria-label={deleteAriaLabel}
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn('min-w-0 flex-1 p-3', isReorderMode ? undefined : 'pt-2')}
      >
        {children}
      </div>
    </article>
  );
}
