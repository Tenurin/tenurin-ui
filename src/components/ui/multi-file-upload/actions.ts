import type { Dispatch, SetStateAction } from 'react';

import { toast } from '../sonner';
import { uploadBlob, type BlobApi, type BlobScope } from '../../../lib/blob-upload';
import {
  defaultMultiFileAllowedMimeTypes,
  defaultMultiFileMaxSizeBytes,
  defaultMultiFileMaxSizeMb,
} from './constants';

type UploadFileParams = Readonly<{
  file: File;
  blobApi: BlobApi;
  blobScope: BlobScope;
  setUploadProgress: Dispatch<SetStateAction<Record<string, number>>>;
}>;

/**
 * Validates a file for multi-file upload fields.
 */
export function validateMultiFileUpload(file: File): boolean {
  if (file.size > defaultMultiFileMaxSizeBytes) {
    toast.error(
      `File "${file.name}" is too large. Max size is ${defaultMultiFileMaxSizeMb}MB.`,
    );
    return false;
  }

  if (!(defaultMultiFileAllowedMimeTypes as readonly string[]).includes(file.type)) {
    toast.error(
      `File "${file.name}" has an invalid type. Please upload one of: ${defaultMultiFileAllowedMimeTypes.join(', ')}`,
    );
    return false;
  }

  return true;
}

/**
 * Uploads one file to blob storage and reports progress by temp id.
 */
export async function uploadMultiFileWithProgress({
  file,
  blobApi,
  blobScope,
  setUploadProgress,
}: UploadFileParams): Promise<string | null> {
  const tempId = `${file.name}-${Date.now()}`;
  setUploadProgress((prev) => ({ ...prev, [tempId]: 0 }));

  try {
    return await uploadBlob({
      file,
      scope: blobScope,
      api: blobApi,
      onProgress: (percentComplete) => {
        setUploadProgress((prev) => ({
          ...prev,
          [tempId]: percentComplete,
        }));
      },
    });
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : `Upload failed for ${file.name}.`,
    );
    return null;
  } finally {
    setUploadProgress((prev) => {
      const nextState = { ...prev };
      delete nextState[tempId];
      return nextState;
    });
  }
}
