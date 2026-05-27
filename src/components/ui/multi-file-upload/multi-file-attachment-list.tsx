import { Loader2, Paperclip, XIcon } from 'lucide-react';

import { Button } from '../button';

type MultiFileAttachmentListProps = Readonly<{
  files: string[];
  isEditing: boolean;
  isPreviewLoading: Record<string, boolean>;
  isUploading: boolean;
  onPreview: (event: React.MouseEvent, blobId: string) => void;
  onRemove: (index: number) => void;
}>;

export function MultiFileAttachmentList({
  files,
  isEditing,
  isPreviewLoading,
  isUploading,
  onPreview,
  onRemove,
}: MultiFileAttachmentListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {files.length === 0 && !isUploading ? (
        <div className="w-full rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No files attached.
        </div>
      ) : null}

      {files.map((blobId, index) => (
        <AttachedFileItem
          blobId={blobId}
          index={index}
          isEditing={isEditing}
          isLoading={isPreviewLoading[blobId]}
          key={`${blobId}-${index}`}
          onPreview={onPreview}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function AttachedFileItem({
  blobId,
  index,
  isEditing,
  isLoading,
  onPreview,
  onRemove,
}: Readonly<{
  blobId: string;
  index: number;
  isEditing: boolean;
  isLoading: boolean;
  onPreview: (event: React.MouseEvent, blobId: string) => void;
  onRemove: (index: number) => void;
}>) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2 text-sm">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Paperclip className="size-4 shrink-0 text-muted-foreground" />
        <Button
          type="button"
          variant="link"
          onClick={(event) => onPreview(event, blobId)}
          className="h-auto min-w-0 flex-1 justify-start p-0 text-foreground"
          title={`Attachment ${index + 1}`}
          disabled={isLoading}
        >
          <span className="truncate">{'Attachment ' + (index + 1)}</span>
          {isLoading ? (
            <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
          ) : null}
        </Button>
      </div>
      {isEditing ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          onClick={() => onRemove(index)}
          aria-label={`Remove Attachment ${index + 1}`}
          title={`Remove Attachment ${index + 1}`}
        >
          <XIcon className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
