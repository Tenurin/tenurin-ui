import { Link } from 'react-router';
import { FileText } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Skeleton } from './skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

type TimelineTableItem = Readonly<{
  postId: string;
  postTitle: string;
  modifiedAt: string;
}>;

type PostsTableProps<TPost extends TimelineTableItem> = Readonly<{
  isPending: boolean;
  isError: boolean;
  pageSize: number;
  posts: TPost[];
  linkForPost: (post: TPost) => string;
  linkStateForPost?: (post: TPost) => unknown;
  secondaryColumnLabel?: string;
  getSecondaryValue?: (post: TPost) => string;
  getUpdatedLabel?: (post: TPost) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  tableClassName?: string;
  rowClassName?: string;
  actionsLabel?: string;
  renderActions?: (post: TPost) => ReactNode;
}>;

const tableHeadClassName = 'py-4 text-[11px] font-medium uppercase tracking-[0.24em]';
const mutedForegroundStyle = { color: 'var(--muted-foreground)' } as const;

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const WEEK_IN_MS = 7 * DAY_IN_MS;
const MONTH_IN_MS = 30 * DAY_IN_MS;
const YEAR_IN_MS = 365 * DAY_IN_MS;

const RELATIVE_UNITS = [
  { label: 'y', duration: YEAR_IN_MS },
  { label: 'mo', duration: MONTH_IN_MS },
  { label: 'w', duration: WEEK_IN_MS },
  { label: 'd', duration: DAY_IN_MS },
  { label: 'h', duration: HOUR_IN_MS },
  { label: 'm', duration: MINUTE_IN_MS },
] as const;

function formatCompactRelativeTime(date: Date | string): string {
  const timestamp = typeof date === 'string' ? new Date(date) : date;
  const elapsed = Date.now() - timestamp.getTime();

  if (Number.isNaN(timestamp.getTime()) || elapsed < MINUTE_IN_MS) {
    return 'now';
  }

  for (const unit of RELATIVE_UNITS) {
    if (elapsed >= unit.duration) {
      return `${Math.floor(elapsed / unit.duration)}${unit.label} ago`;
    }
  }

  return 'now';
}

export default function PostsTable<TPost extends TimelineTableItem>({
  isPending,
  isError,
  pageSize,
  posts,
  linkForPost,
  linkStateForPost,
  secondaryColumnLabel,
  getSecondaryValue,
  getUpdatedLabel = (post) => formatCompactRelativeTime(post.modifiedAt),
  emptyTitle = 'No posts found',
  emptyDescription = 'There are no posts to display at the moment.',
  tableClassName = 'mt-10 min-w-[30rem] w-full table-fixed',
  rowClassName = 'relative',
  actionsLabel = 'Actions',
  renderActions,
}: PostsTableProps<TPost>) {
  const showSecondaryColumn =
    secondaryColumnLabel !== undefined && getSecondaryValue !== undefined;
  const showActionsColumn = renderActions !== undefined;
  const titleColumnClassName = showSecondaryColumn
    ? 'w-7/12'
    : showActionsColumn
      ? 'w-8/12'
      : 'w-9/12';
  const updatedColumnClassName = showActionsColumn ? 'w-28' : 'w-32';
  const actionsColumnClassName = 'w-20';
  const loadingColumnCount = showSecondaryColumn
    ? showActionsColumn
      ? 4
      : 3
    : showActionsColumn
      ? 3
      : 2;
  const showTableHeader = isPending || isError || posts.length > 0;

  return (
    <Table
      className={tableClassName}
      containerClassName="overflow-x-auto lg:overflow-x-visible"
    >
      {showTableHeader ? (
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow>
            <TableHead
              className={`${titleColumnClassName} ${tableHeadClassName}`}
              style={mutedForegroundStyle}
            >
              Post Title
            </TableHead>
            {showSecondaryColumn ? (
              <TableHead
                className={tableHeadClassName}
                style={mutedForegroundStyle}
              >
                {secondaryColumnLabel}
              </TableHead>
            ) : null}
            <TableHead
              className={`${updatedColumnClassName} ${tableHeadClassName}`}
              style={mutedForegroundStyle}
            >
              Updated
            </TableHead>
            {showActionsColumn ? (
              <TableHead
                className={`${actionsColumnClassName} ${tableHeadClassName}`}
                style={mutedForegroundStyle}
              >
                {actionsLabel}
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
      ) : null}
      <TableBody className="[&_tr]:border-b-0">
        {isPending
          ? Array.from({ length: pageSize }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={loadingColumnCount}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          : null}
        {isPending || !isError ? null : (
          <TableRow>
            <TableCell
              colSpan={loadingColumnCount}
              className="text-center text-destructive"
            >
              Failed to load posts. Please try again.
            </TableCell>
          </TableRow>
        )}
        {isPending || isError || posts.length !== 0 ? null : (
          <TableRow>
            <TableCell colSpan={loadingColumnCount} className="h-24 text-center">
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{emptyTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {emptyDescription}
                  </p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
        {isPending || isError || posts.length === 0
          ? null
          : posts.map((post) => (
              <TableRow
                key={post.postId}
                className={cn('relative', rowClassName)}
              >
                <TableCell className="max-w-0 py-1">
                  <Link
                    to={linkForPost(post)}
                    className="absolute inset-0"
                    state={linkStateForPost?.(post)}
                  />
                  <span className="block truncate py-1 pr-2 text-sm">
                    {post.postTitle}
                  </span>
                </TableCell>
                {showSecondaryColumn ? (
                  <TableCell className="max-w-0 py-1 text-sm">
                    <span className="block truncate pr-2">
                      {getSecondaryValue(post)}
                    </span>
                  </TableCell>
                ) : null}
                <TableCell className="py-1 pr-4 text-sm whitespace-nowrap">
                  {getUpdatedLabel(post)}
                </TableCell>
                {showActionsColumn ? (
                  <TableCell className="relative z-10 py-1">
                    {renderActions(post)}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
