import type { TypographyOptions, TypographyValue } from '@/tokens';
import { requireValue } from '@/validation';
import { formatFontFamily } from './formatFontFamily';

/**
 * Creates a set of CSS typography declarations for use as design tokens.
 * Custom fonts must already be registered by the consuming application.
 *
 * @example
 * ```ts
 * const body = createTypography({
 *   fontFamily: ['Inter', 'Arial', 'sans-serif'],
 *   fontSize: '1rem',
 *   fontWeight: 400,
 *   lineHeight: 1.5,
 *   letterSpacing: '0.01em',
 * });
 * ```
 */
export const createTypography = (
  options: TypographyOptions,
): TypographyValue => {
  const lineHeight = requireValue(options.lineHeight, 'lineHeight');
  if (typeof lineHeight === 'number' && lineHeight < 0) {
    throw new RangeError('lineHeight must not be negative.');
  }

  const typography: TypographyValue = {
    fontSize: requireValue(options.fontSize, 'fontSize'),
    lineHeight,
  };

  if (options.fontFamily !== undefined) {
    typography.fontFamily = formatFontFamily(options.fontFamily);
  }

  if (options.fontWeight !== undefined) {
    const fontWeight = requireValue(options.fontWeight, 'fontWeight');
    if (
      typeof fontWeight === 'number' &&
      (fontWeight < 1 || fontWeight > 1000)
    ) {
      throw new RangeError('fontWeight must be between 1 and 1000.');
    }
    typography.fontWeight = fontWeight;
  }

  if (options.letterSpacing !== undefined) {
    typography.letterSpacing = requireValue(
      options.letterSpacing,
      'letterSpacing',
    );
  }

  return typography;
};
