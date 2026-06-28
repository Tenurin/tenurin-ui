import type { ReactNode } from "react";
import {
  BookOpen,
  Briefcase,
  Download,
  GraduationCap,
  Rocket,
  Share2,
} from "lucide-react";

import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { Switch } from "./switch";
import type {
  DataCollectionProfileImportLabelMaps,
  DataCollectionStudentProfileImport,
} from "./data-collection-types";

type DataCollectionProfileImportSectionProps = Readonly<{
  labelMaps: DataCollectionProfileImportLabelMaps;
  profileImport: DataCollectionStudentProfileImport | null | undefined;
}>;

function studentProfileImportHasEnabled(
  profileImport: DataCollectionStudentProfileImport | null | undefined,
): boolean {
  if (!profileImport) {
    return false;
  }

  return (
    profileImport.education.enabled ||
    profileImport.experience.enabled ||
    profileImport.publications.enabled ||
    profileImport.projects.enabled ||
    profileImport.socialLinks.enabled
  );
}

type ProfileImportCategoryRowProps = Readonly<{
  children?: ReactNode;
  enabled: boolean;
  icon: ReactNode;
  id: string;
  label: string;
}>;

function ProfileImportCategoryRow({
  children,
  enabled,
  icon,
  id,
  label,
}: ProfileImportCategoryRowProps) {
  return (
    <div className="space-y-3 border-b border-border/60 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-x-3 gap-y-2">
        <Label
          htmlFor={id}
          className="min-w-0 flex-1 items-center gap-2 font-medium leading-snug"
        >
          <span className="shrink-0 text-muted-foreground">{icon}</span>
          <span className="min-w-0 truncate">{label}</span>
        </Label>
        <div className="shrink-0">
          <Switch id={id} checked={enabled} disabled />
        </div>
      </div>
      {children}
    </div>
  );
}

type ProfileImportCheckboxListProps = Readonly<{
  idPrefix: string;
  labelForValue: (value: string) => string;
  selectedValues: readonly string[];
}>;

function ProfileImportCheckboxList({
  idPrefix,
  labelForValue,
  selectedValues,
}: ProfileImportCheckboxListProps) {
  if (selectedValues.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3 pl-7">
      {selectedValues.map((value) => {
        const checkboxId = `${idPrefix}-${value}`;

        return (
          <div key={value} className="flex items-center gap-2">
            <Checkbox id={checkboxId} checked disabled />
            <Label htmlFor={checkboxId} className="text-sm font-normal">
              {labelForValue(value)}
            </Label>
          </div>
        );
      })}
    </div>
  );
}

export function DataCollectionProfileImportSection({
  labelMaps,
  profileImport,
}: DataCollectionProfileImportSectionProps) {
  const sectionHeader = (
    <div className="mb-4 flex items-center gap-2">
      <Download className="h-4 w-4 text-muted-foreground" aria-hidden />
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        Import From Student Profile
      </p>
    </div>
  );

  if (!studentProfileImportHasEnabled(profileImport)) {
    return (
      <div className="rounded-sm border border-border/60 bg-background/70 p-4">
        {sectionHeader}
        <p className="text-sm italic text-muted-foreground">
          No student profile sections configured for import.
        </p>
      </div>
    );
  }

  const config = profileImport as DataCollectionStudentProfileImport;

  return (
    <div className="rounded-sm border border-border/60 bg-background/70 p-4">
      {sectionHeader}

      {config.education.enabled ? (
        <ProfileImportCategoryRow
          enabled
          id="data-collection-profile-import-education"
          label="Education"
          icon={<GraduationCap className="h-4 w-4" />}
        >
          <ProfileImportCheckboxList
            idPrefix="data-collection-profile-import-education"
            labelForValue={labelMaps.educationTypeLabel}
            selectedValues={config.education.selectedTypes}
          />
        </ProfileImportCategoryRow>
      ) : null}

      {config.experience.enabled ? (
        <ProfileImportCategoryRow
          enabled
          id="data-collection-profile-import-experience"
          label="Experience"
          icon={<Briefcase className="h-4 w-4" />}
        >
          <p className="pl-7 text-sm text-muted-foreground">
            Import up to top {config.experience.limit}{" "}
            {labelMaps.limitCategoryLabels.experience} if any
          </p>
        </ProfileImportCategoryRow>
      ) : null}

      {config.publications.enabled ? (
        <ProfileImportCategoryRow
          enabled
          id="data-collection-profile-import-publications"
          label="Publications"
          icon={<BookOpen className="h-4 w-4" />}
        >
          <p className="pl-7 text-sm text-muted-foreground">
            Import up to top {config.publications.limit}{" "}
            {labelMaps.limitCategoryLabels.publications} if any
          </p>
        </ProfileImportCategoryRow>
      ) : null}

      {config.projects.enabled ? (
        <ProfileImportCategoryRow
          enabled
          id="data-collection-profile-import-projects"
          label="Projects"
          icon={<Rocket className="h-4 w-4" />}
        >
          <p className="pl-7 text-sm text-muted-foreground">
            Import up to top {config.projects.limit}{" "}
            {labelMaps.limitCategoryLabels.projects} if any
          </p>
        </ProfileImportCategoryRow>
      ) : null}

      {config.socialLinks.enabled ? (
        <ProfileImportCategoryRow
          enabled
          id="data-collection-profile-import-social-links"
          label="Social Links"
          icon={<Share2 className="h-4 w-4" />}
        >
          <ProfileImportCheckboxList
            idPrefix="data-collection-profile-import-social-links"
            labelForValue={labelMaps.socialPlatformLabel}
            selectedValues={config.socialLinks.selectedPlatforms}
          />
        </ProfileImportCategoryRow>
      ) : null}
    </div>
  );
}
