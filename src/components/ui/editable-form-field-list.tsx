"use client";

import {
  type ArrayPath,
  type FieldValues,
  type Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import type { ReactNode } from "react";

import { cn } from "../../lib/utils";
import { fieldSurfaceBorderClassName } from "./field-surface";
import EditableFormFieldInput, {
  type FormFieldData,
  type RenderFileField,
} from "./form-field-input";
import FormFieldShell from "./form-field-shell";
import type { FileUploadBlobScope } from "./file-upload-field";
import type { BlobApi } from "../../lib/blob-upload";

export type { FileFieldRenderProps, RenderFileField } from "./form-field-input";

type FieldErrorLike = Readonly<{
  fieldValue?: Readonly<{
    message?: unknown;
  }>;
}>;

type EditableFormFieldListProps<TFormValues extends FieldValues> = Readonly<{
  name: ArrayPath<TFormValues>;
  formData: FormFieldData[] | null;
  emptyMessage: string;
  placeholder?: string;
  blobApi?: BlobApi;
  blobScope?: FileUploadBlobScope;
  renderFileField?: RenderFileField<TFormValues>;
  renderFieldFooter?: (
    field: FormFieldData,
    index: number,
  ) => ReactNode;
}>;

export default function EditableFormFieldList<TFormValues extends FieldValues>({
  name,
  formData,
  emptyMessage,
  placeholder,
  blobApi,
  blobScope,
  renderFileField,
  renderFieldFooter,
}: EditableFormFieldListProps<TFormValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();
  const { fields } = useFieldArray({ control, name });

  if (formData?.length) {
    return (
      <div className="space-y-10">
        {formData.map((field, index) => {
          const fieldPath = `${name}.${index}.fieldValue` as Path<TFormValues>;
          const fieldErrors = errors[name as keyof typeof errors];
          const errorMessage = getFieldErrorMessage(fieldErrors, index);
          const isChoiceField =
            field.fieldType === "checkbox" || field.fieldType === "radio";
          const shellClassName = isChoiceField
            ? `${fieldSurfaceBorderClassName} p-4`
            : undefined;

          return (
            <div
              key={fields[index]?.id ?? field.fieldId ?? field.fieldName}
              className="space-y-3"
            >
              <FormFieldShell
                label={field.fieldName}
                required={field.isRequired}
                errorMessage={errorMessage}
                className={cn(shellClassName)}
              >
                <EditableFormFieldInput
                  fieldPath={fieldPath}
                  formField={field}
                  placeholder={placeholder}
                  blobApi={blobApi}
                  blobScope={blobScope}
                  renderFileField={renderFileField}
                />
              </FormFieldShell>
              {renderFieldFooter?.(field, index) ?? null}
            </div>
          );
        })}
      </div>
    );
  }

  return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
}

function getFieldErrorMessage(
  fieldErrors: unknown,
  index: number,
): string | undefined {
  if (Array.isArray(fieldErrors)) {
    const fieldError = fieldErrors[index] as FieldErrorLike | undefined;
    const message = fieldError?.fieldValue?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return undefined;
}
