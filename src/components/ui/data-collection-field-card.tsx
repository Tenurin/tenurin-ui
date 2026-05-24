"use client";

import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { Checkbox } from "./checkbox";
import { cn } from "../../lib/utils";
import {
  type DataCollectionField,
  type DataCollectionFieldCardProps,
} from "./data-collection-types";
import {
  getDataCollectionFieldIcon,
  getDataCollectionFieldId,
  getDataCollectionFieldTypeLabel,
  isDataCollectionOptionField,
} from "./data-collection-field-utils";

function DataCollectionFieldCard({
  className,
  field,
  fieldId,
  fieldTypeLabels,
  isEditing = false,
  onToggle,
  requiredLabel = "Required",
  selected = false,
}: DataCollectionFieldCardProps) {
  const resolvedFieldId = fieldId ?? getDataCollectionFieldId(field);
  const typeName = getDataCollectionFieldTypeLabel(
    field.fieldType,
    fieldTypeLabels,
  );
  const fieldValues = field.fieldValues ?? [];
  const isSelectable = isEditing && Boolean(onToggle);

  const handleToggle = (checked: boolean) => {
    onToggle?.(resolvedFieldId, checked);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        isSelectable
          ? "cursor-pointer hover:border-primary/50 hover:shadow-md"
          : "",
        selected && isSelectable
          ? "border-primary bg-primary/5 ring-2 ring-primary"
          : "bg-card",
        className,
      )}
      onClick={() => {
        if (isSelectable) handleToggle(!selected);
      }}
    >
      <CardContent className="flex items-start gap-3 p-4">
        {isSelectable ? (
          <div className="mt-1" onClick={(event) => event.stopPropagation()}>
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => handleToggle(Boolean(checked))}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 truncate text-sm font-medium">
              {getDataCollectionFieldIcon(field.fieldType)}
              <span className="truncate" title={field.fieldName}>
                {field.fieldName}
              </span>
            </div>

            {field.isRequired ? (
              <Badge
                variant="outline"
                className="ui-app-accent-negative-surface h-5 shrink-0 rounded-sm px-1.5 text-[10px]"
              >
                {requiredLabel}
              </Badge>
            ) : null}
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground/80">Type:</span>{" "}
              {typeName}
            </div>

            {isDataCollectionOptionField(field.fieldType) &&
            fieldValues.length > 0 ? (
              <div className="truncate" title={fieldValues.join(", ")}>
                <span className="font-medium text-foreground/80">Options:</span>{" "}
                {fieldValues.join(", ")}
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getFieldId(field: DataCollectionField): string {
  return getDataCollectionFieldId(field);
}

export { DataCollectionFieldCard, getFieldId };
