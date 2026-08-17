import { describe, expect, expectTypeOf, it } from 'vitest';
import { createSize } from './createSize.ts';
import { defineTokens } from './defineTokens.ts';

describe('createSize', () => {
  it('creates pixel and rem values from a pixel size', () => {
    const size = createSize(16);

    expect(size(16)).toEqual({ px: '16px', rem: '1rem' });
    expect(size(8)).toEqual({ px: '8px', rem: '0.5rem' });
    expect(size(24)).toEqual({ px: '24px', rem: '1.5rem' });
  });

  it('supports zero and decimal sizes', () => {
    const size = createSize(16);

    expect(size(0)).toEqual({ px: '0px', rem: '0rem' });
    expect(size(1)).toEqual({ px: '1px', rem: '0.0625rem' });
  });

  it('preserves very small values and significant decimal precision', () => {
    const size = createSize(1);

    expect(size(1e-11)).toEqual({ px: '1e-11px', rem: '1e-11rem' });
    expect(size(0.123456789012345)).toEqual({
      px: '0.123456789012345px',
      rem: '0.123456789012345rem',
    });
  });

  it('normalises floating-point noise', () => {
    const size = createSize(1);

    expect(size(0.1 + 0.2)).toEqual({ px: '0.3px', rem: '0.3rem' });
  });

  it('uses the configured pixel-to-rem base', () => {
    const size = createSize(10);

    expect(size(15)).toEqual({ px: '15px', rem: '1.5rem' });
  });

  it('returns values that can be composed into tokens', () => {
    const size = createSize(16);
    const sizes = defineTokens({
      '100': size(16),
      '200': size(32),
    });

    expect(sizes['100'].px).toBe('16px');
    expect(sizes['100'].rem).toBe('1rem');
    expectTypeOf(sizes['100'].px).toEqualTypeOf<`${number}px`>();
    expectTypeOf(sizes['100'].rem).toEqualTypeOf<`${number}rem`>();
  });

  it.each([0, -16, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects an invalid pixel-to-rem base of %s',
    (pixelsPerRem) => {
      expect(() => createSize(pixelsPerRem)).toThrow(RangeError);
    },
  );

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects an invalid pixel size of %s',
    (pixels) => {
      const size = createSize(16);

      expect(() => size(pixels)).toThrow(RangeError);
    },
  );
});
