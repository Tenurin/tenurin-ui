/**
 * Composed class bundles for the `--field-surface` token (`bg-field-surface` in Tailwind).
 *
 * For background or hover only, use the utilities directly — do not add thin wrappers:
 * `bg-field-surface`, `hover:bg-field-surface-hover`, `disabled:bg-field-surface`.
 */

/** Bordered inset panel (cards, sections, profile-import rows). Add your own padding. */
export const fieldSurfaceBorderClassName =
  'rounded-sm border border-border/60 bg-field-surface shadow-none';

/** Editable control surface (inputs, selects, textareas). Caller sets height, radius, padding. */
export const fieldSurfaceClassName =
  'border-border/60 bg-field-surface text-sm shadow-none';

/** Clickable upload/drop zone. Same as fieldSurfaceClassName with hover feedback. */
export const fieldSurfaceInteractiveClassName =
  'border-border/60 bg-field-surface hover:bg-field-surface-hover text-sm shadow-none dark:hover:bg-field-surface-hover';

/** Read-only form answer box. Padding included; use as FormFieldShell contentWrapperClassName. */
export const readonlyFieldSurfaceClassName =
  'rounded-sm border border-border/60 bg-field-surface px-4 py-2 text-sm shadow-none';
