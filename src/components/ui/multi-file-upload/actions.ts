import type { Dispatch, SetStateAction } from 'react';

import { toast } from '../sonner';
import type { PresignedKeyResponse } from '../file-upload-field';
import {
  defaultMultiFileAllowedMimeTypes,
  defaultMultiFileMaxSizeBytes,
  defaultMultiFileMaxSizeMb,
} from './constants';

export type MultiFilePresignedKeyGetter = (
  fileNameOrS3Key: string,
  presignedKeyType: 'get' | 'post',
) => Promise<PresignedKeyResponse>;

type UploadFileParams = Readonly<{
  file: File;
  presignedKeyGetter: MultiFilePresignedKeyGetter;
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
 * Uploads one file to a presigned POST URL and reports progress by temp id.
 */
export async function uploadMultiFileWithProgress({
  file,
  presignedKeyGetter,
  setUploadProgress,
}: UploadFileParams): Promise<string | null> {
  const tempId = `${file.name}-${Date.now()}`;
  setUploadProgress((prev) => ({ ...prev, [tempId]: 0 }));

  try {
    const { uri, fields, key } = await presignedKeyGetter(file.name, 'post');
    const formData = new FormData();
    Object.entries(fields).forEach(([fieldKey, value]) =>
      formData.append(fieldKey, value),
    );
    formData.append('Content-Type', file.type);
    formData.append('file', file);

    await uploadToPresignedUri(uri, formData, tempId, setUploadProgress);
    return key;
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

function uploadToPresignedUri(
  uri: string,
  formData: FormData,
  tempId: string,
  setUploadProgress: Dispatch<SetStateAction<Record<string, number>>>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uri, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded * 100) / event.total);
        setUploadProgress((prev) => ({
          ...prev,
          [tempId]: percentComplete,
        }));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      reject(new Error('Upload failed. Please try again.'));
    };

    xhr.onerror = () => {
      reject(new Error('Upload failed. Network error.'));
    };

    xhr.send(formData);
  });
}
