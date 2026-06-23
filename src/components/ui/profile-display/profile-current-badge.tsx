import { Badge } from '../badge';

export function ProfileCurrentBadge() {
  return (
    <Badge
      variant="outline"
      className="rounded-sm px-2 py-0.5 text-xs font-normal ui-app-accent-positive-surface"
    >
      Current
    </Badge>
  );
}
