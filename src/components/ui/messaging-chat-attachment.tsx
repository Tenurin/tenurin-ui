import { FileText, ImageIcon, Loader2, Paperclip, X } from 'lucide-react';

import { cn } from '../../lib/utils';

/** Inset surface for attachment groups in message bubbles and the composer. */
export const messagingChatAttachmentContainerClassName =
  'rounded-sm border border-border/60 bg-sidebar px-2.5 py-1.5';

function isImageAttachment(fileName: string): boolean {
  return /\.(?:jpe?g|png|gif|webp)$/i.test(fileName);
}

function splitFileName(fileName: string): Readonly<{
  base: string;
  extension: string;
}> {
  const lastDot = fileName.lastIndexOf('.');

  if (lastDot <= 0) {
    return { base: fileName, extension: '' };
  }

  return {
    base: fileName.slice(0, lastDot),
    extension: fileName.slice(lastDot),
  };
}

export type MessagingChatAttachmentRowProps = Readonly<{
  fileName: string;
  disabled?: boolean;
  isOpening?: boolean;
  isPending?: boolean;
  onClick?: () => void;
}>;

/**
 * Compact in-bubble attachment row styled like Linear comment file links.
 */
export function MessagingChatAttachmentRow({
  fileName,
  disabled = false,
  isOpening = false,
  isPending = false,
  onClick,
}: MessagingChatAttachmentRowProps) {
  const AttachmentIcon = isImageAttachment(fileName) ? ImageIcon : FileText;
  const { base, extension } = splitFileName(fileName);
  const isInteractive = Boolean(onClick) && !disabled && !isPending;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isPending || isOpening}
      className={cn(
        'flex min-w-0 max-w-full items-center gap-2 rounded-sm px-1 py-0.5 text-left text-sm leading-none',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
        isInteractive && 'hover:bg-sidebar-accent',
        'disabled:cursor-default disabled:opacity-60',
      )}
    >
      {isOpening || isPending ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <AttachmentIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      )}

      <span className="min-w-0 truncate">
        {isPending ? (
          <span className="text-muted-foreground">Uploading…</span>
        ) : (
          <>
            <span className="text-[var(--foreground)]">{base}</span>
            {extension ? (
              <span className="text-muted-foreground">{extension}</span>
            ) : null}
          </>
        )}
      </span>
    </button>
  );
}

export type MessagingChatComposerAttachmentProps = Readonly<{
  fileName: string;
  disabled?: boolean;
  onRemove: () => void;
}>;

/**
 * Pending attachment row in the message composer, aligned with Linear's compact file list.
 */
export function MessagingChatComposerAttachment({
  fileName,
  disabled = false,
  onRemove,
}: MessagingChatComposerAttachmentProps) {
  const { base, extension } = splitFileName(fileName);

  return (
    <div className="flex min-w-0 items-center gap-2 py-1.5">
      <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate text-xs">
        <span className="text-[var(--foreground)]">{base}</span>
        {extension ? (
          <span className="text-muted-foreground">{extension}</span>
        ) : null}
      </span>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="shrink-0 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-[var(--foreground)] disabled:opacity-50"
        aria-label={`Remove ${fileName}`}
        title={`Remove ${fileName}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
