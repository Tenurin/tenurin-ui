import { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';

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
} from './multi-file-upload/actions';
import type { BlobApi, BlobScope } from '../../lib/blob-upload';

export type MultiFileBlobScope = BlobScope;

type MultiFilesFieldProps = Readonly<{
  /** React-hook-form path to a string array field, e.g. listingDetails.listingAttachments */
  name: string;
  blobApi: BlobApi;
  blobScope: MultiFileBlobScope;
  isEditing: boolean;
}>;

/**
 * Manages a react-hook-form string array for multiple blob uploads.
 */
export default function MultiFilesField({
  name,
  blobApi,
  blobScope,
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

    const uploadedBlobIds: string[] = [];
    for (const file of validFiles) {
      const uploadedBlobId = await uploadMultiFileWithProgress({
        file,
        blobApi,
        blobScope,
        setUploadProgress,
      });
      if (uploadedBlobId) {
        uploadedBlobIds.push(uploadedBlobId);
      }
    }

    if (uploadedBlobIds.length > 0) {
      field.onChange([...files, ...uploadedBlobIds]);
      toast.success(
        `${uploadedBlobIds.length} file${uploadedBlobIds.length > 1 ? 's' : ''} uploaded successfully.`,
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
    blobId: string,
  ) => {
    event.preventDefault();
    setIsPreviewLoading((prev) => ({ ...prev, [blobId]: true }));

    try {
      if (!blobApi.accessBlob) {
        throw new Error('File previews are not available.');
      }

      const { uri } = await blobApi.accessBlob(blobId, blobScope);
      globalThis.open(uri, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error('Could not load the file preview.');
      console.error(`Could not load the file preview. Error: ${error}`);
    } finally {
      setIsPreviewLoading((prev) => ({ ...prev, [blobId]: false }));
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
