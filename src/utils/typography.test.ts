import { describe, expect, it } from 'vitest';
import { formatFontFamily } from './typography.ts';

describe('formatFontFamily', () => {
  it('returns a complete CSS font-family value unchanged', () => {
    expect(formatFontFamily('var(--font-body), sans-serif')).toBe(
      'var(--font-body), sans-serif',
    );
  });

  it('joins an ordered font-family list', () => {
    expect(formatFontFamily(['Inter', 'Arial', 'sans-serif'])).toBe(
      'Inter, Arial, sans-serif',
    );
  });

  it('does not mutate a font-family list', () => {
    const families = ['Inter', 'sans-serif'] as const;

    formatFontFamily(families);

    expect(families).toEqual(['Inter', 'sans-serif']);
  });

  it('rejects an empty font-family list', () => {
    expect(() => formatFontFamily([])).toThrow(
      new RangeError('fontFamily requires at least one value.'),
    );
  });

  it('identifies an empty family in a list', () => {
    expect(() => formatFontFamily(['Inter', ''])).toThrow(
      new TypeError('fontFamily[1] must not be empty.'),
    );
  });
});
