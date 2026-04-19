'use client';

import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { Button } from '../../components/ui/button';

export type ErrorStateContent = Readonly<{
  title: string;
  message: string;
}>;

export type RouteErrorStateContentMap = Partial<
  Record<number, ErrorStateContent>
>;

const DEFAULT_STATUS_CODE = '500';
const DEFAULT_TITLE = 'Something went wrong on our end.';
const DEFAULT_MESSAGE =
  'The page could not be loaded because the portal hit an unexpected issue. Please try again in a moment.';

export const DEFAULT_ROUTE_ERROR_STATE_CONTENT: Record<
  number,
  ErrorStateContent
> = {
  401: {
    title: 'You do not have access to this page.',
    message:
      'Your session may have expired, or this section may require permissions that are not available for this account.',
  },
  404: {
    title: 'This page does not exist.',
    message:
      'The link may be outdated, or the page may have moved while the portal structure changed.',
  },
  500: {
    title: DEFAULT_TITLE,
    message: DEFAULT_MESSAGE,
  },
};

type ResolvedRouteErrorState = Readonly<{
  statusCode: string;
  title: string;
  message: string;
}>;

export type RouteErrorTemplateProps = Readonly<{
  backLabel?: string;
  backTo?: string;
  defaultMessage?: string;
  defaultStatusCode?: string;
  defaultTitle?: string;
  stateContent?: RouteErrorStateContentMap;
}>;

function resolveRouteErrorState(
  error: unknown,
  stateContent: RouteErrorStateContentMap,
  defaults: Omit<ResolvedRouteErrorState, 'statusCode'> & {
    statusCode: string;
  },
): ResolvedRouteErrorState {
  if (isRouteErrorResponse(error)) {
    const statusCode = error.status.toString();
    const matchedState = stateContent[error.status];

    if (matchedState) {
      return {
        statusCode,
        title: matchedState.title,
        message: matchedState.message,
      };
    }

    return {
      statusCode,
      title: error.statusText || 'An unexpected error occurred.',
      message: defaults.message,
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: defaults.statusCode,
      title: defaults.title,
      message: error.message,
    };
  }

  return defaults;
}

export function RouteErrorTemplate({
  backLabel = 'Back to Dashboard',
  backTo = '/dashboard',
  defaultMessage = DEFAULT_MESSAGE,
  defaultStatusCode = DEFAULT_STATUS_CODE,
  defaultTitle = DEFAULT_TITLE,
  stateContent = DEFAULT_ROUTE_ERROR_STATE_CONTENT,
}: RouteErrorTemplateProps) {
  const error = useRouteError();
  const { message, statusCode, title } = resolveRouteErrorState(
    error,
    stateContent,
    {
      statusCode: defaultStatusCode,
      title: defaultTitle,
      message: defaultMessage,
    },
  );

  return (
    <section className="flex min-h-screen items-center">
      <div className="mx-auto flex w-full max-w-5xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {statusCode}
          </p>
          <h1 className="mt-4 text-4xl font-medium leading-none tracking-tight text-[var(--foreground)] md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            {message}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={backTo}>
              <Button className="cursor-pointer bg-foreground px-5 py-2.5 text-sm text-background hover:bg-foreground/88">
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
