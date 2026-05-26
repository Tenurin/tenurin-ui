import { useRef, useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Progress } from './progress';
import UploadSurface from './upload-surface';
import { toast } from './sonner';
import { cn } from '../../lib/utils';
import { Loader2, Paperclip, UploadCloud, XIcon } from 'lucide-react';

const DEFAULT_MAX_FILE_SIZE_MB = 2;
const BYTES_PER_MB = 1024 * 1024;
const DEFAULT_MAX_FILE_SIZE_BYTES = DEFAULT_MAX_FILE_SIZE_MB * BYTES_PER_MB;
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_FILE_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export type PresignedKeyResponse = {
  uri: string;
  fields: Record<string, string>;
  key: string;
};

export type FileUploadFieldType = 'file' | 'image';

type FileUploadFieldProps = Readonly<{
  fieldId?: string;
  fieldType: FileUploadFieldType;
  onChange: (value: string | null) => void;
  presignedKeyGetter?: (
    fieldId: string,
    fileNameOrS3Key: string,
    presignedKeyType: 'get' | 'post',
  ) => Promise<PresignedKeyResponse>;
  surfaceClassName?: string;
  value?: string | null;
}>;

export default function FileUploadField({
  fieldId,
  fieldType,
  onChange,
  presignedKeyGetter,
  surfaceClassName,
  value,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const fileName =
    typeof value === 'string' ? value.split('/').pop() || value : null;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !presignedKeyGetter || !fieldId) {
      return;
    }

    if (file.size > DEFAULT_MAX_FILE_SIZE_BYTES) {
      toast.error(
        `File is too large. Max size is ${DEFAULT_MAX_FILE_SIZE_MB}MB.`,
      );
      return;
    }

    if (fieldType === 'image') {
      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG, PNG or GIF.');
        return;
      }
    } else if (!ALLOWED_FILE_MIME_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PDF, DOC or DOCX.');
      return;
    }

    setIsUploading(true);

    try {
      const { uri, fields, key } = await presignedKeyGetter(
        fieldId,
        file.name,
        'post',
      );
      const formData = new FormData();

      Object.entries(fields).forEach(([nextFieldKey, nextFieldValue]) =>
        formData.append(nextFieldKey, nextFieldValue),
      );

      formData.append('Content-Type', file.type);
      formData.append('file', file);

      const response = await fetch(uri, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed. Please try again.');
      }

      onChange(key);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred during upload.');
      }

      onChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handlePreviewClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    if (!presignedKeyGetter || !fieldId || typeof value !== 'string') {
      return;
    }

    setIsPreviewLoading(true);

    try {
      const { uri } = await presignedKeyGetter(fieldId, value, 'get');
      globalThis.open(uri, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error('Could not load the file preview.');
      console.error(`Could not load the file preview. Error: ${error}`);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Uploading...
          </div>
          <Progress value={undefined} className="h-2" />
        </div>
      ) : value && fileName ? (
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors',
            surfaceClassName ?? 'bg-muted/30 hover:bg-muted/50',
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
              <Paperclip className="size-4 text-muted-foreground" />
            </div>

            <div className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-medium" title={fileName}>
                {fileName}
              </span>

              <Button
                type="button"
                variant="link"
                onClick={handlePreviewClick}
                disabled={isPreviewLoading}
                className="h-auto justify-start p-0 text-xs text-muted-foreground hover:text-primary"
              >
                {isPreviewLoading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="size-3 animate-spin" />
                    Opening...
                  </span>
                ) : (
                  'Click to preview'
                )}
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemoveFile}
            aria-label="Remove file"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <UploadSurface
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2',
            surfaceClassName ?? 'hover:border-primary/50 hover:bg-muted/50',
          )}
          icon={<UploadCloud className="size-4 text-muted-foreground" />}
          title={`Upload ${fieldType === 'image' ? 'Image' : 'File'}`}
          description={`${fieldType === 'image' ? 'JPEG, PNG, GIF' : 'PDF, DOC, DOCX'} (Max ${DEFAULT_MAX_FILE_SIZE_MB}MB)`}
        />
      )}
    </div>
  );
}
