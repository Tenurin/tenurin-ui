'use client';

import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

export type LegalDialogProps = Readonly<{
  title: string;
  children: ReactNode;
  className?: string;
  label?: string;
  inlineSpacing?: boolean;
}>;

export function LegalDialog({
  title,
  children,
  className,
  label = title,
  inlineSpacing = true,
}: LegalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            'cursor-pointer font-medium text-[color-mix(in_oklab,var(--foreground)_80%,transparent)] transition hover:text-[var(--foreground)]',
            className,
            inlineSpacing && 'mx-1',
          )}
        >
          {label}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[50vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="h-[40vh] space-y-4 overflow-y-auto p-2 text-sm leading-relaxed">
              {children}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
