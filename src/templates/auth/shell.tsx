'use client';

import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

import { Logo } from '../../components/ui/logo';

export type AuthShellProps = Readonly<{
  appName: string;
  portalTitle: string;
  portalDescription: string;
  children: ReactNode;
  showHero?: boolean;
  helpUrl?: string;
  headerAction?: ReactNode;
  themeToggle?: ReactNode;
  termsLink?: ReactNode;
  privacyLink?: ReactNode;
}>;

export function AuthShell({
  appName,
  portalTitle,
  portalDescription,
  children,
  showHero = true,
  helpUrl,
  headerAction,
  themeToggle,
  termsLink,
  privacyLink,
}: AuthShellProps) {
  const defaultHeaderAction = helpUrl ? (
    <a
      href={helpUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold uppercase text-muted-foreground transition hover:text-[var(--foreground)]"
    >
      <span className="hidden sm:inline">Help</span>
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  ) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-[var(--foreground)]">
      <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 md:px-10 md:py-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-6 rounded-md object-contain brightness-125 sm:h-7 sm:w-7" />
            <span className="text-base font-medium text-[var(--foreground)] sm:text-lg">
              {appName}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {headerAction ?? defaultHeaderAction}
            {themeToggle}
          </div>
        </header>

        <main className="flex flex-1 items-center py-6 sm:py-8 lg:py-10">
          {showHero ? (
            <div className="mx-auto flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-around lg:gap-10">
              <section className="hidden lg:block lg:max-w-2xl lg:flex-1">
                <div className="my-10 mt-0">
                  <Logo className="h-24 w-24 object-contain brightness-125" />
                </div>

                <h2 className="max-w-none text-6xl font-medium text-[var(--foreground)]">
                  {portalTitle}
                </h2>
                <p className="mt-6 w-3/4 text-base leading-8 text-muted-foreground">
                  {portalDescription}
                </p>
              </section>

              <div className="mx-auto flex w-full justify-center lg:mx-0 lg:w-[32rem] lg:max-w-none lg:flex-none lg:justify-end">
                {children}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-4xl justify-center">
              {children}
            </div>
          )}
        </main>

        <footer className="flex flex-col items-center justify-center gap-2 pb-1 text-center text-[10px] font-medium uppercase text-muted-foreground sm:text-[11px] md:flex-row md:gap-4">
          <span>© 2026 {appName}. All rights reserved.</span>
          {termsLink ? (
            <div className="flex items-center gap-4">
              <span className="text-border">•</span>
              {termsLink}
            </div>
          ) : null}
          {privacyLink ? (
            <div className="flex items-center gap-4">
              <span className="text-border">•</span>
              {privacyLink}
            </div>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
