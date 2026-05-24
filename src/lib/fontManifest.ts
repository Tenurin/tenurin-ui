export const interFontFileNames = [
  'inter-latin-ext-400-normal.woff2',
  'inter-latin-400-normal.woff2',
  'inter-latin-ext-500-normal.woff2',
  'inter-latin-500-normal.woff2',
  'inter-latin-ext-700-normal.woff2',
  'inter-latin-700-normal.woff2',
  'inter-latin-ext-800-normal.woff2',
  'inter-latin-800-normal.woff2',
] as const;

export type InterFontFileName = (typeof interFontFileNames)[number];

export const isInterFontFileName = (
  value: string,
): value is InterFontFileName =>
  interFontFileNames.includes(value as InterFontFileName);
