'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Building2, CalendarDays, Users } from 'lucide-react';
import { TextEditor } from '../../components/ui/texteditor';

type RichTextContent = Record<string, unknown>;

export type PostDetailTemplateProps = Readonly<{
  title: string;
  sourceLabel: string;
  updatedLabel: string;
  audienceLabel: string;
  audienceSectionLabel?: string;
  audienceIcon?: LucideIcon;
  content: RichTextContent | string | null;
  headerActions?: ReactNode;
  footerActions?: ReactNode;
}>;

export function PostDetailTemplate({
  title,
  sourceLabel,
  updatedLabel,
  audienceLabel,
  audienceSectionLabel = 'Batch',
  audienceIcon: AudienceIcon = Users,
  content,
  headerActions,
  footerActions,
}: PostDetailTemplateProps) {
  return (
    <div className="min-h-full w-11/12 xl:w-2/3 mx-auto pb-24">
      <div className="py-10 lg:py-12">
        {headerActions ? (
          <div className="mb-10 flex flex-wrap items-center justify-end gap-3">
            {headerActions}
          </div>
        ) : null}

        <div>
          <div className="xl:mt-9">
            <h1 className="text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
              {title}
            </h1>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <Building2 className="ui-app-accent-triad-a-fg h-4 w-4" />
              <span className="text-[var(--foreground)]">{sourceLabel}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="ui-app-accent-cool-fg h-4 w-4" />
              <span className="text-[var(--foreground)]">{updatedLabel}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <AudienceIcon className="ui-app-accent-triad-c-fg h-4 w-4" />
              <span className="text-[var(--foreground)]">{audienceLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <article>
        <section>
          <TextEditor
            content={content ?? ''}
            onChange={() => {}}
            disabled={true}
            format="json"
            className="!border-0 !bg-transparent text-justify [&_.ProseMirror]:!m-0 [&_.ProseMirror]:!text-sm"
          />
        </section>

        <section className="mt-10 border-t border-neutral-200 pt-7 dark:border-neutral-800">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Source
              </p>
              <p className="mt-2 text-xs font-medium text-[var(--foreground)]">
                {sourceLabel}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Updated
              </p>
              <p className="mt-2 text-xs font-medium text-[var(--foreground)]">
                {updatedLabel}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {audienceSectionLabel}
              </p>
              <p className="mt-2 text-xs font-medium text-[var(--foreground)]">
                {audienceLabel}
              </p>
            </div>
          </div>
        </section>

        {footerActions ? (
          <section className="mt-10 flex flex-wrap items-center justify-end gap-3">
            {footerActions}
          </section>
        ) : null}
      </article>
    </div>
  );
}
