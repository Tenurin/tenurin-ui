"use client";

import { EditIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { cn } from "../../lib/utils";
import type { DataCollectionDefinitionCardProps } from "./data-collection-types";
import {
  getDataCollectionFieldIcon,
  getDataCollectionFieldTypeLabel,
  isDataCollectionOptionField,
} from "./data-collection-field-utils";

function DataCollectionDefinitionCard({
  cardClassName,
  className,
  dragHandleProps,
  field,
  fieldTypeLabels,
  isDragging = false,
  isReadOnly = true,
  onEdit,
  onRemove,
  optionalLabel = "Optional",
  requiredLabel = "Required",
  rootRef,
  showOptionalBadge = false,
  style,
}: DataCollectionDefinitionCardProps) {
  const typeName = getDataCollectionFieldTypeLabel(
    field.fieldType,
    fieldTypeLabels,
  );
  const fieldValues = field.fieldValues ?? [];
  const statusLabel = field.isRequired ? requiredLabel : optionalLabel;
  const showActions = !isReadOnly && Boolean(onEdit || onRemove);
  const showDragHandle = !isReadOnly && Boolean(dragHandleProps);
  const showStatusBadge = field.isRequired || showOptionalBadge;

  return (
    <div ref={rootRef} style={style} className={cn("group", className)}>
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5 ring-2 ring-primary/40"
            : "bg-card",
          showDragHandle ? "hover:border-primary/50 hover:shadow-md" : "",
          cardClassName,
        )}
      >
        <CardContent className="flex items-start gap-3 p-4">
          {showDragHandle ? (
            <button
              {...dragHandleProps}
              type="button"
              aria-label={
                dragHandleProps?.["aria-label"] ??
                `Drag field ${field.fieldName} to reorder`
              }
              className={cn(
                "mt-0.5 grid h-7 w-7 shrink-0 cursor-grab place-items-center rounded-sm text-muted-foreground/70 transition-colors hover:bg-muted/60 hover:text-foreground active:cursor-grabbing",
                dragHandleProps?.className,
              )}
            >
              <GripVerticalIcon className="h-4 w-4" />
            </button>
          ) : null}

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 truncate text-sm font-medium">
                {getDataCollectionFieldIcon(field.fieldType)}
                <span className="truncate" title={field.fieldName}>
                  {field.fieldName}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {showStatusBadge ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 shrink-0 rounded-sm px-1.5 text-[10px]",
                      field.isRequired
                        ? "ui-app-accent-negative-surface"
                        : "ui-app-accent-warm-surface",
                    )}
                  >
                    {statusLabel}
                  </Badge>
                ) : null}

                {showActions ? (
                  <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                    {onEdit ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-sm text-muted-foreground hover:text-primary"
                        onClick={onEdit}
                        aria-label={`Edit field ${field.fieldName}`}
                      >
                        <EditIcon className="h-3.5 w-3.5" />
                      </Button>
                    ) : null}
                    {onRemove ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ui-app-accent-negative-fg h-7 w-7 rounded-sm hover:bg-destructive/10 hover:text-[var(--app-accent-negative-fg)]"
                        onClick={onRemove}
                        aria-label={`Remove field ${field.fieldName}`}
                      >
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground/80">Type:</span>{" "}
                {typeName}
              </div>

              {isDataCollectionOptionField(field.fieldType) &&
              fieldValues.length > 0 ? (
                <div className="truncate" title={fieldValues.join(", ")}>
                  <span className="font-medium text-foreground/80">
                    Options:
                  </span>{" "}
                  {fieldValues.join(", ")}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { DataCollectionDefinitionCard };
