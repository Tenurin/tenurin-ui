import { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';

import {
  closeTransientBrowsingContext,
  navigateToExternalUrl,
  openTransientBrowsingContext,
} from '../../lib/openExternalUrl';
import { Input } from './input';
import { toast } from './sonner';
import UploadSurface from './upload-surface';
import {
  defaultMultiFileAllowedMimeTypes,
  defaultMultiFileMaxSizeMb,
} from './multi-file-upload/constants';
import { MultiFileAttachmentList } from './multi-file-upload/multi-file-attachment-list';
import { MultiFileUploadProgressList } from './multi-file-upload/multi-file-upload-progress-list';
import {
  uploadMultiFileWithProgress,
  validateMultiFileUpload,
  type MultiFilePresignedKeyGetter,
} from './multi-file-upload/actions';

export type { MultiFilePresignedKeyGetter } from './multi-file-upload/actions';

type MultiFilesFieldProps = Readonly<{
  /** React-hook-form path to a string array field, e.g. listingDetails.listingAttachments */
  name: string;
  presignedKeyGetter: MultiFilePresignedKeyGetter;
  isEditing: boolean;
}>;

/**
 * Manages a react-hook-form string array for multiple presigned file uploads.
 */
export default function MultiFilesField({
  name,
  presignedKeyGetter,
  isEditing,
}: MultiFilesFieldProps) {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const { field } = useController({
    name,
    control,
  });

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState<
    Record<string, boolean>
  >({});

  const isUploading = Object.keys(uploadProgress).length > 0;
  const files: string[] = Array.isArray(field.value) ? field.value : [];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    const validFiles = Array.from(selectedFiles).filter(validateMultiFileUpload);
    if (validFiles.length === 0) {
      return;
    }

    const uploadedKeys: string[] = [];
    for (const file of validFiles) {
      const uploadedKey = await uploadMultiFileWithProgress({
        file,
        presignedKeyGetter,
        setUploadProgress,
      });
      if (uploadedKey) {
        uploadedKeys.push(uploadedKey);
      }
    }

    if (uploadedKeys.length > 0) {
      field.onChange([...files, ...uploadedKeys]);
      toast.success(
        `${uploadedKeys.length} file${uploadedKeys.length > 1 ? 's' : ''} uploaded successfully.`,
      );
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    field.onChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  const handlePreviewClick = async (
    event: React.MouseEvent,
    fileKey: string,
  ) => {
    event.preventDefault();
    setIsPreviewLoading((prev) => ({ ...prev, [fileKey]: true }));
    const popup = openTransientBrowsingContext();

    try {
      const { uri } = await presignedKeyGetter(fileKey, 'get');
      navigateToExternalUrl(uri, popup);
    } catch (error) {
      closeTransientBrowsingContext(popup);
      toast.error('Could not load the file preview.');
      console.error(`Could not load the file preview. Error: ${error}`);
    } finally {
      setIsPreviewLoading((prev) => ({ ...prev, [fileKey]: false }));
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept={defaultMultiFileAllowedMimeTypes.join(',')}
        disabled={!isEditing || isUploading}
      />

      {isEditing ? (
        <UploadSurface
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
          icon={
            isUploading ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <UploadCloud className="size-4 text-muted-foreground" />
            )
          }
          title={isUploading ? 'Uploading...' : 'Select files'}
          description={`PDF, DOC, DOCX, JPEG, PNG, GIF (max ${defaultMultiFileMaxSizeMb}MB each)`}
        />
      ) : null}

      <MultiFileUploadProgressList uploadProgress={uploadProgress} />

      <MultiFileAttachmentList
        files={files}
        isEditing={isEditing}
        isPreviewLoading={isPreviewLoading}
        isUploading={isUploading}
        onPreview={handlePreviewClick}
        onRemove={handleRemoveFile}
      />
    </div>
  );
}
