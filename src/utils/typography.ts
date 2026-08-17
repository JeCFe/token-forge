import { requireValue } from '../validation/requireValue.ts';
import type { TypographyOptions } from '../tokens/types.ts';

/** Formats one font-family value or an ordered font-family list. */
export const formatFontFamily = (
  fontFamily: TypographyOptions['fontFamily'],
): string => {
  const families =
    typeof fontFamily === 'string' ? [fontFamily] : [...fontFamily];

  if (families.length === 0) {
    throw new RangeError('fontFamily requires at least one value.');
  }

  return families
    .map((family, index) => requireValue(family, `fontFamily[${index}]`))
    .join(', ');
};
