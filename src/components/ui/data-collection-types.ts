import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
  Ref,
} from "react";

type DataCollectionTabKey = "listing" | "student" | "college";

type DataCollectionField = Readonly<{
  fieldId?: string;
  fieldName: string;
  fieldType: string;
  fieldValues?: readonly string[] | null;
  isRequired?: boolean;
}>;

type DataCollectionFields = Readonly<{
  collegeData: readonly DataCollectionField[];
  listingData: readonly DataCollectionField[];
  studentData: readonly DataCollectionField[];
}>;

type DataCollectionFieldTypeLabels = Readonly<Record<string, string>>;

type DataCollectionFieldCardProps = Readonly<{
  className?: string;
  field: DataCollectionField;
  fieldId?: string;
  fieldTypeLabels?: DataCollectionFieldTypeLabels;
  isEditing?: boolean;
  onToggle?: (fieldId: string, checked: boolean) => void;
  requiredLabel?: string;
  selected?: boolean;
}>;

type DataCollectionDefinitionCardProps = Readonly<{
  cardClassName?: string;
  className?: string;
  dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  field: DataCollectionField;
  fieldTypeLabels?: DataCollectionFieldTypeLabels;
  isDragging?: boolean;
  isReadOnly?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  optionalLabel?: ReactNode;
  requiredLabel?: ReactNode;
  rootRef?: Ref<HTMLDivElement>;
  showOptionalBadge?: boolean;
  style?: CSSProperties;
}>;

type DataCollectionFieldDisplay = "compact" | "definition";

type DataCollectionTabsProps = Readonly<{
  defaultTab?: DataCollectionTabKey;
  emptyMessage?: string;
  fieldTypeLabels?: DataCollectionFieldTypeLabels;
  listingFieldDisplay?: DataCollectionFieldDisplay;
  requiredData: DataCollectionFields;
}>;

type DataCollectionPanelProps = DataCollectionTabsProps &
  Readonly<{
    lockedMessage?: ReactNode;
    panelClassName?: string;
    panelTitle?: string;
    showLockedAlert?: boolean;
  }>;

const defaultFieldTypeLabels: DataCollectionFieldTypeLabels = {
  checkbox: "Checkbox",
  date: "Date",
  email: "Email",
  file: "File",
  image: "Image",
  number: "Number",
  radio: "Radio",
  text: "Short answer",
  textarea: "Paragraph",
};

export {
  defaultFieldTypeLabels,
  type DataCollectionField,
  type DataCollectionFields,
  type DataCollectionDefinitionCardProps,
  type DataCollectionFieldDisplay,
  type DataCollectionFieldCardProps,
  type DataCollectionFieldTypeLabels,
  type DataCollectionPanelProps,
  type DataCollectionTabsProps,
  type DataCollectionTabKey,
};
