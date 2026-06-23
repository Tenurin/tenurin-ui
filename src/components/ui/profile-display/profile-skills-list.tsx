import { authLabelClassName } from '../auth-form';
import { badgeVariants } from '../badge';
import { cn } from '../../../lib/utils';
import type { ProfileDisplaySkill } from './types';

type ProfileSkillsListProps = Readonly<{
  skills: readonly ProfileDisplaySkill[];
}>;

export function ProfileSkillsList({ skills }: ProfileSkillsListProps) {
  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className={authLabelClassName}>Skills</p>
      <ul className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <li
            key={skill.skillId}
            className={cn(
              badgeVariants({ variant: 'outline' }),
              'rounded-sm px-2 py-0.5 text-xs font-normal',
            )}
          >
            {skill.name ?? skill.skillId}
          </li>
        ))}
      </ul>
    </div>
  );
}
