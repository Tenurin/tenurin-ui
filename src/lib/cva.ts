import type { ClassValue } from 'clsx';

type CvaClassProps =
  | {
      class: ClassValue;
      className?: never;
    }
  | {
      class?: never;
      className: ClassValue;
    }
  | {
      class?: never;
      className?: never;
    };

export type CvaFn<T extends object = Record<string, never>> = (
  props?: T & CvaClassProps
) => string;
