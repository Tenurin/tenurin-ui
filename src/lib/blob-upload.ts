export const BLOB_OWNER_TYPE = {
  batchRequiredData: 'batch_required_data',
  listingApplicationData: 'listing_application_data',
  applicationSnapshotData: 'application_snapshot_data',
  listingAttachment: 'listing_attachment',
  messageAttachment: 'message_attachment',
  userAvatar: 'user_avatar',
  listingDownload: 'listing_download',
  provisionalListing: 'provisional_listing',
  provisionalBatchRelation: 'provisional_batch_relation',
} as const;

export const BLOB_FORM_TYPE = {
  student: 'student',
  college: 'college',
} as const;

export type BlobOwnerType =
  (typeof BLOB_OWNER_TYPE)[keyof typeof BLOB_OWNER_TYPE];

export type BlobFormType = (typeof BLOB_FORM_TYPE)[keyof typeof BLOB_FORM_TYPE];

export type BlobScope = Readonly<{
  ownerType?: BlobOwnerType;
  ownerId?: string;
  ownerKey?: string;
  /** Used by file-upload-field to derive ownerKey when not set explicitly. */
  fieldId?: string;
  formType?: BlobFormType;
}>;

export type BlobInitRequest = Readonly<{
  sha256: string;
  contentType: string;
  sizeBytes: number;
  fileName?: string;
  scope: BlobScope;
}>;

export type BlobInitResponse = Readonly<{
  blobId: string;
  sessionId: string;
  uri: string;
  fields: Record<string, string>;
}>;

export type BlobConfirmResponse = Readonly<{
  blobId: string;
  canonicalized: boolean;
}>;

export type BlobAccessResponse = Readonly<{
  uri: string;
  blobId: string;
}>;

export type BlobApi = Readonly<{
  initUpload: (request: BlobInitRequest) => Promise<BlobInitResponse>;
  confirmUpload: (
    blobId: string,
    request: { sessionId: string },
  ) => Promise<BlobConfirmResponse>;
  accessBlob?: (blobId: string, scope: BlobScope) => Promise<BlobAccessResponse>;
}>;

export type UploadBlobOptions = Readonly<{
  file: File;
  scope: BlobScope;
  api: BlobApi;
  onProgress?: (percentComplete: number) => void;
}>;

export async function computeSha256Hex(file: File): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    await file.arrayBuffer(),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function uploadBlob({
  file,
  scope,
  api,
  onProgress,
}: UploadBlobOptions): Promise<string> {
  const sha256 = await computeSha256Hex(file);
  const contentType = file.type || 'application/octet-stream';
  const init = await api.initUpload({
    sha256,
    contentType,
    sizeBytes: file.size,
    fileName: file.name,
    scope,
  });

  await uploadToBlobStaging(init, file, contentType, onProgress);
  const confirmed = await api.confirmUpload(init.blobId, {
    sessionId: init.sessionId,
  });
  return confirmed.blobId;
}

function uploadToBlobStaging(
  init: BlobInitResponse,
  file: File,
  contentType: string,
  onProgress?: (percentComplete: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    Object.entries(init.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('Content-Type', contentType);
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', init.uri, true);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return;
      }
      onProgress(Math.round((event.loaded * 100) / event.total));
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
