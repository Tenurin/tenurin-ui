"use client";

import {
  AlignLeftIcon,
  CalendarIcon,
  CheckSquareIcon,
  FileIcon,
  HashIcon,
  ImageIcon,
  ListIcon,
  MailIcon,
  TypeIcon,
} from "lucide-react";

import {
  defaultFieldTypeLabels,
  type DataCollectionField,
  type DataCollectionFieldTypeLabels,
} from "./data-collection-types";

function getDataCollectionFieldId(field: DataCollectionField): string {
  return field.fieldId ?? field.fieldName;
}

function getDataCollectionFieldTypeLabel(
  fieldType: string,
  labels: DataCollectionFieldTypeLabels = defaultFieldTypeLabels,
): string {
  return labels[fieldType] ?? fieldType;
}

function isDataCollectionOptionField(fieldType: string): boolean {
  return fieldType === "radio" || fieldType === "checkbox";
}

function getDataCollectionFieldIcon(
  type: string,
  className = "h-3.5 w-3.5 text-muted-foreground",
) {
  switch (type) {
    case "textarea":
      return <AlignLeftIcon className={className} />;
    case "number":
      return <HashIcon className={className} />;
    case "email":
      return <MailIcon className={className} />;
    case "date":
      return <CalendarIcon className={className} />;
    case "radio":
      return <ListIcon className={className} />;
    case "checkbox":
      return <CheckSquareIcon className={className} />;
    case "file":
      return <FileIcon className={className} />;
    case "image":
      return <ImageIcon className={className} />;
    default:
      return <TypeIcon className={className} />;
  }
}

export {
  getDataCollectionFieldIcon,
  getDataCollectionFieldId,
  getDataCollectionFieldTypeLabel,
  isDataCollectionOptionField,
};
