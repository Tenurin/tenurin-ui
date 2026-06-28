"use client";

import { Database, Info } from "lucide-react";

import { AlertSurface } from "./alert-surface";
import { DataCollectionDefinitionCard } from "./data-collection-definition-card";
import { DataCollectionFieldCard } from "./data-collection-field-card";
import { getDataCollectionFieldId } from "./data-collection-field-utils";
import { DataCollectionProfileImportSection } from "./data-collection-profile-import-section";
import {
  type DataCollectionField,
  type DataCollectionFieldDisplay,
  type DataCollectionFieldTypeLabels,
  type DataCollectionPanelProps,
  type DataCollectionProfileImportLabelMaps,
  type DataCollectionStudentProfileImport,
  type DataCollectionTabKey,
  type DataCollectionTabsProps,
} from "./data-collection-types";
import { DetailPanel } from "./detail-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const dataCollectionTabs: readonly Readonly<{
  key: DataCollectionTabKey;
  label: string;
}>[] = [
  { key: "listing", label: "Listing Specific" },
  { key: "student", label: "Student Profile" },
  { key: "college", label: "College Records" },
];

function DataCollectionPanel({
  defaultTab = "student",
  emptyMessage,
  fieldTypeLabels,
  listingFieldDisplay,
  lockedMessage = "Data fields cannot be changed after the listing is created.",
  panelClassName,
  panelTitle = "Data Collection",
  profileImportLabelMaps,
  requiredData,
  showLockedAlert = true,
}: DataCollectionPanelProps) {
  return (
    <DetailPanel
      title={panelTitle}
      icon={<Database className="h-4 w-4" />}
      className={panelClassName}
    >
      <div className="space-y-6">
        {showLockedAlert ? (
          <AlertSurface
            icon={<Info className="size-5" />}
            tone="warm"
            contentClassName="text-xs font-medium leading-5"
          >
            <span>{lockedMessage}</span>
          </AlertSurface>
        ) : null}

        <DataCollectionTabs
          defaultTab={defaultTab}
          emptyMessage={emptyMessage}
          fieldTypeLabels={fieldTypeLabels}
          listingFieldDisplay={listingFieldDisplay}
          profileImportLabelMaps={profileImportLabelMaps}
          requiredData={requiredData}
        />
      </div>
    </DetailPanel>
  );
}

function DataCollectionTabs({
  defaultTab = "student",
  emptyMessage = "No fields have been selected.",
  fieldTypeLabels,
  listingFieldDisplay = "compact",
  profileImportLabelMaps,
  requiredData,
}: DataCollectionTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {dataCollectionTabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <DataCollectionListingTabContent
        emptyMessage={emptyMessage}
        fieldDisplay={listingFieldDisplay}
        fieldTypeLabels={fieldTypeLabels}
        fields={requiredData.listingData}
        profileImport={requiredData.studentProfileImport}
        profileImportLabelMaps={profileImportLabelMaps}
      />
      <DataCollectionTabContent
        value="student"
        fields={requiredData.studentData}
        emptyMessage={emptyMessage}
        fieldDisplay="compact"
        fieldTypeLabels={fieldTypeLabels}
      />
      <DataCollectionTabContent
        value="college"
        fields={requiredData.collegeData}
        emptyMessage={emptyMessage}
        fieldDisplay="compact"
        fieldTypeLabels={fieldTypeLabels}
      />
    </Tabs>
  );
}

function DataCollectionListingTabContent({
  emptyMessage,
  fieldDisplay,
  fieldTypeLabels,
  fields,
  profileImport,
  profileImportLabelMaps,
}: Readonly<{
  emptyMessage: string;
  fieldDisplay: DataCollectionFieldDisplay;
  fieldTypeLabels?: DataCollectionFieldTypeLabels;
  fields: readonly DataCollectionField[];
  profileImport?: DataCollectionStudentProfileImport | null;
  profileImportLabelMaps?: DataCollectionProfileImportLabelMaps;
}>) {
  const showProfileImport =
    profileImport != null && profileImportLabelMaps != null;
  const hasListingFields = fields.length > 0;

  return (
    <TabsContent value="listing" className="mt-4">
      <div className="space-y-4">
        {showProfileImport ? (
          <DataCollectionProfileImportSection
            profileImport={profileImport}
            labelMaps={profileImportLabelMaps}
          />
        ) : null}

        {hasListingFields ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <DataCollectionTabField
                key={getDataCollectionFieldId(field)}
                fieldDisplay={fieldDisplay}
                field={field}
                fieldTypeLabels={fieldTypeLabels}
              />
            ))}
          </div>
        ) : showProfileImport ? null : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </div>
    </TabsContent>
  );
}

function DataCollectionTabContent({
  emptyMessage,
  fieldDisplay,
  fieldTypeLabels,
  fields,
  value,
}: Readonly<{
  emptyMessage: string;
  fieldDisplay: DataCollectionFieldDisplay;
  fieldTypeLabels?: DataCollectionFieldTypeLabels;
  fields: readonly DataCollectionField[];
  value: DataCollectionTabKey;
}>) {
  return (
    <TabsContent value={value} className="mt-4">
      {fields.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <DataCollectionTabField
              key={getDataCollectionFieldId(field)}
              fieldDisplay={fieldDisplay}
              field={field}
              fieldTypeLabels={fieldTypeLabels}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </TabsContent>
  );
}

function DataCollectionTabField({
  field,
  fieldDisplay,
  fieldTypeLabels,
}: Readonly<{
  field: DataCollectionField;
  fieldDisplay: DataCollectionFieldDisplay;
  fieldTypeLabels?: DataCollectionFieldTypeLabels;
}>) {
  if (fieldDisplay === "definition") {
    return (
      <DataCollectionDefinitionCard
        field={field}
        fieldTypeLabels={fieldTypeLabels}
        isReadOnly
      />
    );
  }

  return (
    <DataCollectionFieldCard
      field={field}
      fieldTypeLabels={fieldTypeLabels}
    />
  );
}

export {
  DataCollectionDefinitionCard,
  DataCollectionFieldCard,
  DataCollectionPanel,
  DataCollectionProfileImportSection,
  DataCollectionTabs,
};
export type {
  DataCollectionField,
  DataCollectionFields,
  DataCollectionDefinitionCardProps,
  DataCollectionFieldDisplay,
  DataCollectionFieldCardProps,
  DataCollectionFieldTypeLabels,
  DataCollectionPanelProps,
  DataCollectionProfileImportLabelMaps,
  DataCollectionStudentProfileImport,
  DataCollectionTabsProps,
  DataCollectionTabKey,
} from "./data-collection-types";
