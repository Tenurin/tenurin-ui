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

type DataCollectionStudentProfileImportEducation = Readonly<{
  enabled: boolean;
  selectedTypes: readonly string[];
}>;

type DataCollectionStudentProfileImportCategoryLimit = Readonly<{
  enabled: boolean;
  limit: number;
}>;

type DataCollectionStudentProfileImportSocialLinks = Readonly<{
  enabled: boolean;
  selectedPlatforms: readonly string[];
}>;

type DataCollectionStudentProfileImport = Readonly<{
  education: DataCollectionStudentProfileImportEducation;
  experience: DataCollectionStudentProfileImportCategoryLimit;
  publications: DataCollectionStudentProfileImportCategoryLimit;
  projects: DataCollectionStudentProfileImportCategoryLimit;
  socialLinks: DataCollectionStudentProfileImportSocialLinks;
}>;

type DataCollectionProfileImportLabelMaps = Readonly<{
  educationTypeLabel: (type: string) => string;
  limitCategoryLabels: Readonly<{
    experience: string;
    publications: string;
    projects: string;
  }>;
  socialPlatformLabel: (platform: string) => string;
}>;

type DataCollectionFields = Readonly<{
  collegeData: readonly DataCollectionField[];
  listingData: readonly DataCollectionField[];
  studentData: readonly DataCollectionField[];
  studentProfileImport?: DataCollectionStudentProfileImport | null;
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
  profileImportLabelMaps?: DataCollectionProfileImportLabelMaps;
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
  type DataCollectionProfileImportLabelMaps,
  type DataCollectionStudentProfileImport,
  type DataCollectionTabsProps,
  type DataCollectionTabKey,
};
