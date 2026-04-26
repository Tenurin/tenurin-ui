'use client';

import type { ReactNode } from 'react';

import { Button } from '../../components/ui/button';
import { authPanelContainerClassName } from '../../components/ui/auth-form';
import { cn } from '../../lib/utils';

export type AuthPanelProps = Readonly<{
  title: string;
  description: string;
  oauthLabel?: string;
  oauthIcon?: ReactNode;
  onOAuth?: () => void;
  isOAuthDisabled?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}>;

export function AuthPanel({
  title,
  description,
  oauthLabel,
  oauthIcon,
  onOAuth,
  isOAuthDisabled = false,
  children,
  footer,
}: AuthPanelProps) {
  const showOAuth = Boolean(onOAuth && oauthLabel);

  return (
    <section className={authPanelContainerClassName}>
      <div className="space-y-3">
        <h1 className="text-2xl font-medium leading-none text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {showOAuth ? (
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onOAuth}
            disabled={isOAuthDisabled}
            className="mt-7 h-11 w-full rounded-sm border border-sidebar-border bg-neutral-50 px-4 text-sm font-medium text-[var(--foreground)] shadow-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:!bg-neutral-800/30"
          >
            {oauthIcon}
            {oauthLabel}
          </Button>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase text-muted-foreground/80 sm:my-6">
            <div className="h-px flex-1 border-t border-border/80" />
            <span>Or continue with</span>
            <div className="h-px flex-1 border-t border-border/80" />
          </div>
        </>
      ) : null}

      <div className={cn(showOAuth ? undefined : 'mt-4 sm:mt-5')}>
        {children}
      </div>

      {footer ? (
        <div className="mt-4 text-center text-sm sm:mt-5">{footer}</div>
      ) : null}
    </section>
  );
}
