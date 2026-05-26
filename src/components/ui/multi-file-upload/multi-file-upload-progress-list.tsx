import { Loader2 } from 'lucide-react';

import { Progress } from '../progress';

type MultiFileUploadProgressListProps = Readonly<{
  uploadProgress: Record<string, number>;
}>;

export function MultiFileUploadProgressList({
  uploadProgress,
}: MultiFileUploadProgressListProps) {
  return (
    <>
      {Object.entries(uploadProgress).map(([tempId, progress]) => {
        const fileName = tempId.split('-').slice(0, -1).join('-');
        return (
          <div
            key={tempId}
            className="flex items-center gap-3 rounded-md border bg-muted/50 p-2"
          >
            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
            <div className="flex-1 truncate text-sm text-muted-foreground">
              Uploading {fileName}...
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          </div>
        );
      })}
    </>
  );
}
