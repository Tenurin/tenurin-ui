"use client";

import {
  type ArrayPath,
  type FieldValues,
  type Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import { cn } from "../../lib/utils";
import EditableFormFieldInput, { type FormFieldData } from "./form-field-input";
import FormFieldShell from "./form-field-shell";
import type { FileUploadBlobScope } from "./file-upload-field";
import type { BlobApi } from "../../lib/blob-upload";

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
}>;

export default function EditableFormFieldList<TFormValues extends FieldValues>({
  name,
  formData,
  emptyMessage,
  placeholder,
  blobApi,
  blobScope,
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
            ? "rounded-sm border border-border/60 bg-neutral-50 p-4 shadow-none dark:!bg-neutral-800/30"
            : undefined;

          return (
            <div key={fields[index]?.id ?? field.fieldId ?? field.fieldName}>
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
                />
              </FormFieldShell>
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
