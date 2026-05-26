export const defaultMultiFileMaxSizeMb = 5;
export const defaultMultiFileMaxSizeBytes =
  defaultMultiFileMaxSizeMb * 1024 * 1024;
export const defaultMultiFileAllowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;
