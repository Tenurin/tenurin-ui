"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Checkbox } from "./checkbox";
import FileUploadFieldBase, {
  type FileUploadBlobScope,
} from "./file-upload-field";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Textarea } from "./textarea";
import type { BlobApi } from "../../lib/blob-upload";

export type FormFieldData = Readonly<{
  fieldId?: string;
  fieldName: string;
  fieldType:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "date"
    | "radio"
    | "checkbox"
    | "file"
    | "image";
  fieldValues: string[];
  isRequired: boolean;
}>;

const formFieldSurfaceClassName =
  "rounded-sm border-border/60 bg-neutral-50 text-sm shadow-none dark:!bg-neutral-800/30";
const fileUploadSurfaceClassName =
  "border-border/60 bg-neutral-50 hover:bg-neutral-100 dark:!bg-neutral-800/30 dark:hover:!bg-neutral-800/40";

export type FileFieldRenderProps<TFormValues extends FieldValues = FieldValues> =
  Readonly<{
    fieldPath: Path<TFormValues>;
    formField: FormFieldData;
    blobApi?: BlobApi;
    blobScope?: FileUploadBlobScope;
  }>;

export type RenderFileField<TFormValues extends FieldValues = FieldValues> = (
  props: FileFieldRenderProps<TFormValues>,
) => ReactNode | null | undefined;

type FormFieldInputProps<TFormValues extends FieldValues> = Readonly<{
  fieldPath: Path<TFormValues>;
  formField: FormFieldData;
  placeholder?: string;
  blobApi?: BlobApi;
  blobScope?: FileUploadBlobScope;
  renderFileField?: RenderFileField<TFormValues>;
}>;

export default function FormFieldInput<TFormValues extends FieldValues>({
  fieldPath,
  formField,
  placeholder = "Add your response here...",
  blobApi,
  blobScope,
  renderFileField,
}: FormFieldInputProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  switch (formField.fieldType) {
    case "file":
    case "image": {
      if (formField.fieldType === "file" && renderFileField) {
        const customField = renderFileField({
          fieldPath,
          formField,
          blobApi,
          blobScope,
        });
        if (customField != null) {
          return customField;
        }
      }

      return (
        <Controller
          name={fieldPath}
          control={control}
          render={({ field }) => (
            <FileUploadFieldBase
              value={typeof field.value === "string" ? field.value : null}
              onChange={field.onChange}
              fieldId={formField.fieldId}
              fieldType={formField.fieldType === "image" ? "image" : "file"}
              blobApi={blobApi}
              blobScope={blobScope}
              surfaceClassName={fileUploadSurfaceClassName}
            />
          )}
        />
      );
    }

    case "textarea":
      return (
        <Controller
          name={fieldPath}
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value ?? ""}
              className={`min-h-[140px] ${formFieldSurfaceClassName}`}
              placeholder={placeholder}
            />
          )}
        />
      );

    case "radio":
      return (
        <Controller
          name={fieldPath}
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              {formField.fieldValues.map((option) => (
                <ChoiceLabel key={option} label={option}>
                  <RadioGroupItem
                    value={option}
                    id={`${fieldPath}-${option}`}
                    className="data-[state=checked]:!border-primary data-[state=checked]:!bg-primary data-[state=checked]:!text-primary-foreground"
                    style={choiceControlStyle(field.value === option)}
                  />
                </ChoiceLabel>
              ))}
            </RadioGroup>
          )}
        />
      );

    case "checkbox":
      return (
        <Controller
          name={fieldPath}
          control={control}
          render={({ field }) => {
            const selectedValues: string[] = Array.isArray(field.value)
              ? field.value.filter(
                  (value: unknown): value is string =>
                    typeof value === "string",
                )
              : [];

            return (
              <div className="space-y-3">
                {formField.fieldValues.map((option) => (
                  <ChoiceLabel key={option} label={option}>
                    <Checkbox
                      checked={selectedValues.includes(option)}
                      className="data-[state=checked]:!border-primary data-[state=checked]:!bg-primary data-[state=checked]:!text-primary-foreground"
                      style={choiceControlStyle(
                        selectedValues.includes(option),
                      )}
                      onCheckedChange={(checked) => {
                        const nextValues = checked
                          ? [...selectedValues, option]
                          : selectedValues.filter(
                              (currentValue: string) => currentValue !== option,
                            );

                        field.onChange(nextValues);
                      }}
                    />
                  </ChoiceLabel>
                ))}
              </div>
            );
          }}
        />
      );

    case "date":
      return (
        <Controller
          name={fieldPath}
          control={control}
          render={({ field }) => (
            <DateField
              value={field.value}
              onChange={(date) =>
                field.onChange(date ? date.toISOString() : null)
              }
            />
          )}
        />
      );

    case "number":
    case "text":
    case "email":
      return (
        <Controller
          name={fieldPath}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ""}
              type={formField.fieldType}
              className={`h-10 ${formFieldSurfaceClassName}`}
              placeholder={placeholder}
            />
          )}
        />
      );

    default:
      return null;
  }
}

function choiceControlStyle(isSelected: boolean) {
  if (isSelected) {
    return undefined;
  }

  return {
    backgroundColor: "var(--app-accent-neutral-bg)",
    borderColor: "var(--app-accent-neutral-border)",
  };
}

type ChoiceLabelProps = Readonly<{
  label: string;
  children: ReactNode;
}>;

function ChoiceLabel({ label, children }: ChoiceLabelProps) {
  return (
    <label className="flex cursor-pointer text-sm items-center gap-3 px-4">
      {children}
      <span className="text-sm text-[var(--foreground)]">{label}</span>
    </label>
  );
}

type DateFieldProps = Readonly<{
  value: unknown;
  onChange: (date: Date | undefined) => void;
}>;

function DateField({ value, onChange }: DateFieldProps) {
  const date =
    typeof value === "string" || value instanceof Date
      ? new Date(value)
      : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `h-10 px-4 ${formFieldSurfaceClassName}`,
            "w-full justify-start text-left font-normal",
            date == null ? "text-muted-foreground" : null,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
